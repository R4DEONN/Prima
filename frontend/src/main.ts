import {GrammarOptimizer} from "./TableOptimizer/TableOptimizer";
import {SyntacticRecognizer} from "./SyntacticRecognizer/SyntacticRecognizer";
import * as fs from "node:fs";

function main(argc: number, argv: string[])
{
	// const inputStr = fs.readFileSync(argv[3], "utf8");
	// GrammarOptimizer.optimize(inputStr, (str) => process.stdout.write(str));
	const table = {
		"<Z>": {
			"<Z>": "OK",
			"<S>": "<S>0,1",
			"~real~": "~real~1,1"
		},
		"<S>0,1": {
			"~#~": "R<Z>1"
		},
		"~real~1,1": {
			"<idlist>": "<idlist>1,2+<idlist>3,1",
			"<id>": "<id>3,1",
			"~A~": "~A~4,1"
		},
		"<idlist>1,2+<idlist>3,1": {
			"~,~": "~,~2,2",
			"~#~": "R<S>2"
		},
		"<id>3,1": {
			"~,~": "R<idlist>1",
			"~#~": "R<idlist>1"
		},
		"~A~4,1": {
			"~,~": "R<id>1",
			"~#~": "R<id>1"
		},
		"~,~2,2": {
			"<id>": "<id>2,3",
			"~A~": "~A~4,1"
		},
		"<id>2,3": {
			"~,~": "R<idlist>3",
			"~#~": "R<idlist>3"
		}
	};

	const input = "~real~ ~A~ ~,~ ~A~ ~,~ ~A~ ~,~ ~A~ ~#~";
	const recognizer = new SyntacticRecognizer(JSON.stringify(table));
	console.log(recognizer.parse(input));
}

main(process.argv.length, process.argv);