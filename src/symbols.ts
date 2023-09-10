export const ctrlchars = ["=>", ...",[]{}"];
export const quotes = [..."'\"`"];

export const simple_escape_chars = [...'"\\/bfrnt'];
export const simple_escapes = [...'"\\/\b\f\n\r\t'];

export const symbols = Object.fromEntries(ctrlchars.map((c) => [c, Symbol(c)]));

symbols[":"] = symbols["=>"];

export const constants = Object.fromEntries(
	[true, false, null, undefined].map((thing) => [String(thing), thing])
);
