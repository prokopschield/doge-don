import { constants, symbols } from "./symbols";

try {
	if (!("toJSON" in BigInt.prototype)) {
		Object.assign(BigInt.prototype, {
			toJSON() {
				return String(this);
			},
		});
	}
} catch {
	// assigned by another module
}

export function convert_token<T>(token: string | T) {
	if (typeof token !== "string" || !token.trim()) {
		return token;
	}

	if (token in constants) {
		return constants[token];
	}

	const number = Number(token);

	if (number === number) {
		if (String(number) === token || !token.match(/^\d+$/g)) {
			return number;
		} else if (token.match(/^\d+$/g)) {
			return BigInt(token);
		}
	}

	return token;
}

export function parse_object(tokens: Array<string | symbol>) {
	let remove_bracket = Symbol("");

	if (tokens[0] === symbols["["] || tokens[0] === symbols["{"]) {
		if (tokens[0] === symbols["["]) {
			remove_bracket = symbols["]"];
		} else {
			remove_bracket = symbols["}"];
		}

		tokens.shift();
	}

	let key_count = 0;

	const keys = new Array<string | undefined>();
	const values = new Array<any>();

	let key = "";
	let last = "";

	while (
		tokens.length &&
		tokens[0] !== symbols["]"] &&
		tokens[0] !== symbols["}"]
	) {
		if (tokens[0] === symbols["=>"]) {
			if (key) {
				tokens.unshift(last);

				++key_count;
				keys.push(key);
				values.push(parse_object(tokens));

				key = last = "";
			} else {
				tokens.shift();
				key = last;
				last = "";
			}

			continue;
		}

		if (tokens[0] === symbols[","]) {
			if (key) {
				++key_count;
				keys.push(key);
				values.push(last);
			} else {
				keys.push(undefined);
				values.push(last);
			}

			tokens.shift();
			key = last = "";

			continue;
		}

		if (tokens[0] === symbols["["] || tokens[0] === symbols["{"]) {
			if (last) {
				keys.push(undefined);
				values.push(last);
				last = "";
			}

			if (key) {
				++key_count;
				keys.push(key);
				key = "";
			}

			values.push(parse_object(tokens));

			continue;
		}

		if (key) {
			if (last) {
				++key_count;
				keys.push(key);
				values.push(last);
				key = "";
			}
			last = String(tokens.shift());
		} else {
			if (last) {
				keys.push(undefined);
				values.push(last);
			}

			last = String(tokens.shift());
		}
	}

	if (key) {
		++key_count;
		keys.push(key);
		values.push(last);
	} else if (last) {
		keys.push(undefined);
		values.push(last);
	}

	if (tokens[0] === remove_bracket) {
		tokens.shift();
	}

	if (!key_count) {
		return values.map(convert_token);
	} else {
		const return_value: any = {};

		let key_counter = 0;

		for (let index = 0; index < values.length; ++index) {
			let key = keys[index];

			while (!key || key in return_value) {
				key = String(key_counter++);
			}

			const value = values[index];

			return_value[key] = convert_token(value);
		}

		return return_value;
	}
}

export function parser(
	tokens: Array<string | symbol>,
	items = new Array<any>()
) {
	if (tokens.length === 0) {
		return undefined;
	}

	if (tokens.length === 1 && typeof tokens[0] !== "symbol") {
		return convert_token(tokens.shift());
	}

	while (tokens.length) {
		const first = parse_object(tokens);

		if (tokens[0] === symbols["]"] || tokens[0] === symbols["}"]) {
			tokens.shift();
			items.push([first]);
		} else {
			items.push(first);
		}

		if (tokens[0] === symbols[","]) {
			tokens.shift();
		}
	}

	if (items.length > 1) {
		return items;
	} else {
		return items.shift();
	}
}
