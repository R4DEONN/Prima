import {GrammarOptimizer} from "./TableOptimizer/TableOptimizer";
import * as fs from "node:fs";

function main(argc: number, argv: string[])
{
	const inputStr = fs.readFileSync(argv[3], "utf8");
	GrammarOptimizer.optimize(inputStr, (str) => process.stdout.write(str));
}

main(process.argv.length, process.argv);