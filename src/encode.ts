import { constants } from "./symbols";
import { tokenizer } from "./tokenizer";

export const safe_regexp = /^[!'()*-._~\d\w]+$/;
export const safe_regexp_double = /^[^"\\]*$/;
export const safe_regexp_single = /^[^']*$/;
export const safe_regexp_template = /^[^`]*$/;

export function print_token(token: string | symbol) {
	if (typeof token === "symbol") {
		return token.description;
	} else if (token in constants) {
		return constants[token];
	} else if (safe_regexp.test(token)) {
		return token;
	} else if (safe_regexp_double.test(token)) {
		return `"${token}"`;
	} else if (safe_regexp_single.test(token)) {
		return `'${token}'`;
	} else if (safe_regexp_template.test(token)) {
		"`" + token + "`";
	} else {
		return JSON.stringify(token);
	}
}

export function encode<T>(arg: T) {
	return [...tokenizer(arg)].map(print_token).join("");
}
