import {
	ctrlchars,
	quotes,
	simple_escapes,
	simple_escape_chars,
	symbols,
	ε,
} from "./symbols";

export enum Mode {
	default,
	quotes,
	escape,
	escape_unicode,
	quoted, // string exists, may be ε
	equals,
	after_equals_newline_expect_comma,
	after_equals_newline_comma_expect_expression,
	comment,
}

export function* lexer(arg: string) {
	let part = "";
	let mode: Mode = Mode.default;
	let quote = '"';
	let uni = "0";

	for (const c of arg) {
		if (mode === Mode.after_equals_newline_expect_comma) {
			if (!c.trim()) {
				continue;
			}

			mode = Mode.after_equals_newline_comma_expect_expression;

			yield symbols[","];

			if (c === ",") {
				continue;
			}
		}

		if (mode === Mode.after_equals_newline_comma_expect_expression) {
			if (!c.trim()) {
				continue;
			}

			mode = Mode.default;

			if (c === ":" || c === "=" || ctrlchars.includes(c)) {
				yield ε;
			}
		}

		if (mode === Mode.equals) {
			mode = Mode.default;

			if (part) {
				yield part;
				part = "";
			}

			yield symbols["=>"];

			if (c === ">") {
				continue;
			}

			if (c === "\r" || c === "\n") {
				yield ε;
				mode = Mode.after_equals_newline_expect_comma;
				continue;
			}
		}

		if (mode === Mode.escape_unicode) {
			if (uni.length > 4 || /[^\da-f]/gi.test(c)) {
				mode = Mode.quotes;
				part += String.fromCodePoint(parseInt(uni, 16));
				uni = "0";
			} else {
				uni += c;
				continue;
			}
		}

		if (mode === Mode.comment) {
			if (c === "\n") {
				mode = Mode.default;
			} else {
				continue;
			}
		}

		switch (mode) {
			case Mode.quoted: {
				mode = Mode.default;

				if (!c.trim()) {
					yield part || ε;

					continue;
				}

				// fall through
			}

			case Mode.default: {
				if (c === "#") {
					mode = Mode.comment;
					continue;
				}

				if (!c.trim()) {
					if (part) {
						yield part;
						part = "";
					}

					continue;
				}

				if (c === "=") {
					mode = Mode.equals;
					continue;
				}

				if (c === ":") {
					if (part) {
						yield part;
						part = "";
					}

					yield symbols["=>"];

					continue;
				}

				if (ctrlchars.includes(c)) {
					if (part) {
						yield part;
						part = "";
					}

					yield symbols[c];

					continue;
				}

				if (quotes.includes(c)) {
					quote = c;
					mode = Mode.quotes;
					continue;
				}

				part += c;
				continue;
			}

			case Mode.quotes:
				if (c === "\\" && quote === '"') {
					mode = Mode.escape;
				} else if (c === quote) {
					mode = Mode.quoted;
				} else {
					part += c;
				}

				continue;

			case Mode.escape:
				if (c === "u" || c === "U") {
					mode = Mode.escape_unicode;
				} else if (simple_escape_chars.includes(c)) {
					mode = Mode.quotes;
					part += simple_escapes[simple_escape_chars.indexOf(c)];
				} else {
					mode = Mode.quotes;
					part += "\\" + c;
				}

				continue;
		}
	}

	if (part) {
		yield part;
	}
}
