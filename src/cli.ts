#!/usr/bin/env node

import { fmt } from "./formatter";

process.stdin.on("data", (chunk) => {
	console.log(fmt(String(chunk), "    "));
});
