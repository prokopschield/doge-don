import {
	ctrlchars,
	quotes,
	simple_escapes,
	simple_escape_chars,
	symbols,
} from "./symbols";

export enum Mode {
	default,
	quotes,
	escape,
	escape_unicode,
	equals,
}

export function* lexer(arg: string) {
	let part = "";
	let mode: Mode = Mode.default;
	let quote = '"';
	let uni = "0";

	for (const c of arg) {
		if (mode === Mode.equals) {
			mode = Mode.default;

			if (c === ">") {
				if (part) {
					yield part;
					part = "";
				}

				yield symbols["=>"];

				continue;
			} else {
				part += "=";
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

		switch (mode) {
			case Mode.default: {
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
					mode = Mode.default;
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
