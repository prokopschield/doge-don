import { decode } from "./decode";
import { print_token } from "./encode";
import { symbols } from "./symbols";
import { tokenizer } from "./tokenizer";

export function* formatter<T>(arg: T, indenter = "\t", newline = "\n") {
	let indentation = 0;

	for (const token of tokenizer(
		typeof arg === "string" ? decode(arg) : arg
	)) {
		if (token === symbols["["]) {
			yield "[";
			yield newline;
			yield indenter.repeat(++indentation);
		} else if (token === symbols["]"]) {
			yield newline;
			yield indenter.repeat(--indentation);
			yield "]";
		} else if (token === symbols[","]) {
			yield ",";
			yield newline;
			yield indenter.repeat(indentation);
		} else if (token === symbols["=>"]) {
			yield " => ";
		} else {
			yield print_token(token);
		}
	}
}

export function fmt<T>(arg: T, indenter = "\t", newline = "\n") {
	return [...formatter(arg, indenter, newline)].join("");
}

export function* formatter_rc<T>(arg: T) {
	let depth = 0;

	for (const token of tokenizer(
		typeof arg === "string" ? decode(arg) : arg
	)) {
		if (token === symbols["["]) {
			if (depth++) {
				yield "[";
			}
		} else if (token === symbols["]"]) {
			if (--depth) {
				yield "]";
			}
		} else if (token === symbols[","]) {
			yield depth > 1 ? "," : "\n";
		} else if (token === symbols["=>"]) {
			yield depth > 1 ? "=>" : "=";
		} else {
			yield print_token(token);
		}
	}
}

export function fmt_rc<T>(arg: T) {
	return [...formatter_rc(arg)].join("");
}
