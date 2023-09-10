import { lexer } from "./lexer";
import { parser } from "./parser";

export function decode(arg: string) {
	return parser([...lexer(arg)]);
}
