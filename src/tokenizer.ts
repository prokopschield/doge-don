import { lexer } from "./lexer";
import { symbols } from "./symbols";

export function* tokenizer(
	arg: any,
	stack = new Array<any>()
): Generator<string | symbol, undefined, undefined> {
	if (!arg || typeof arg !== "object") {
		return yield String(arg);
	}

	for (const key of ["toDON", "toJSON"]) {
		if (key in arg) {
			try {
				const transformed = arg[key]();

				const tokens = [
					...(typeof transformed === "string"
						? lexer(transformed)
						: tokenizer(transformed)),
				];

				for (const token of tokens) {
					yield token;
				}

				return;
			} catch {
				// well, we gave it a fair shot
			}
		}
	}

	yield symbols["["];

	stack.push(arg);

	let counter = 0;

	for (const [key, value] of Object.entries(arg)) {
		if (stack.includes(value)) {
			continue;
		}

		if (counter) {
			yield symbols[","];
		}

		if (String(key) !== String(counter++)) {
			yield String(key);
			yield symbols["=>"];
		}

		for (const token of tokenizer(value, stack)) {
			yield token;
		}
	}

	stack.pop();

	yield symbols["]"];
}
