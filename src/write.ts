import fs from "fs";

import { fmt, fmt_rc } from "./formatter";

export function write<T>(filename: string, arg: T, rc = false) {
	const formatter = rc ? fmt_rc : fmt;

	try {
		if (
			typeof window === "undefined" ||
			typeof localStorage === "undefined"
		) {
			fs.writeFileSync(filename, formatter(arg, "\t", "\n") + "\n");
		} else {
			localStorage.setItem(filename, formatter(arg, "", " "));
		}
	} catch {
		return "";
	}
}
