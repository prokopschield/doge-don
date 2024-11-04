import fs from "doge-fs";

import { fmt, fmt_rc } from "./formatter";

export function write<T>(filename: string, arg: T, rc = false) {
	const formatter = rc ? fmt_rc : fmt;

	if (typeof window === "undefined" || typeof localStorage === "undefined") {
		return fs.write(filename, formatter(arg, "\t", "\n") + "\n");
	} else {
		localStorage.setItem(filename, formatter(arg, "", " "));
	}
}
