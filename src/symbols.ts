export const ctrlchars = ["=>", ...",[]{}"];
export const quotes = [..."'\"`"];

export const simple_escape_chars = [...'"\\/bfrnt'];
export const simple_escapes = [...'"\\/\b\f\n\r\t'];

export const symbols = Object.fromEntries(ctrlchars.map((c) => [c, Symbol(c)]));

export const ε = Symbol("");

symbols.ε = symbols[""] = ε;

symbols[":"] = symbols["=>"];

export function Σ(Σ: string | typeof ε) {
	return Σ === ε ? "" : String(Σ);
}

export const constants = Object.fromEntries(
	[true, false, null, undefined].map((thing) => [String(thing), thing])
);
