import fs from "fs";

import { fmt } from "./formatter";

export function write<T>(filename: string, arg: T) {
	try {
		if (
			typeof window === "undefined" ||
			typeof localStorage === "undefined"
		) {
			fs.writeFileSync(filename, fmt(arg, "\t", "\n") + "\n");
		} else {
			localStorage.setItem(filename, fmt(arg, "", " "));
		}
	} catch {
		return "";
	}
}
