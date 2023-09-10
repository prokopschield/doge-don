import fs from "fs";

import { decode } from "./decode";

export function read(filename: string) {
	try {
		decode(
			typeof window === "undefined" || typeof localStorage === "undefined"
				? fs.readFileSync(filename, "utf-8")
				: localStorage.getItem(filename) || ""
		);
	} catch {
		return "";
	}
}
