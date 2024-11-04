import fs from "doge-fs";

import { decode } from "./decode";

export function read(filename: string) {
	return fs.read(filename).then(decode, () => "");
}
