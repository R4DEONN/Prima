import {GrammarOptimizer} from "./TableOptimizer/TableOptimizer";
import * as fs from "node:fs";
import {SLRTable, SyntacticRecognizer} from "./SyntacticRecognizer/SyntacticRecognizer";

function main(argc: number, argv: string[])
{
	// const inputStr = fs.readFileSync(argv[3], "utf8");
	// GrammarOptimizer.optimize(inputStr, (str) => console.log(str));

	const slrTable: SLRTable = {
		action: (state, symbol) =>
		{
			// Implement action table based on the provided grammar
			switch (state)
			{
				case 0: // Initial state
					if (symbol === 'z')
					{
						return {type: 'accept'};
					}
					if (symbol === 's')
					{
						return {type: 'shift', state: 1};
					}
					if (symbol === 'c')
					{
						return {type: 'shift', state: 4};
					}
					break;

				case 1: // After seeing S
					if (symbol === 'a')
					{
						return {type: 'shift', state: 2};
					}
					if (symbol === 'b')
					{
						return {type: 'shift', state: 3};
					}
					if (symbol === '#')
					{
						return {type: 'reduce', production: 0};
					} // Z -> S
					break;

				case 2: // After seeing Sa
					if (symbol === 'a' || symbol === 'b' || symbol === '#')
					{
						return {type: 'reduce', production: 1};
					} // S -> Sa
					break;

				case 3: // After seeing Sb
					if (symbol === 'a' || symbol === 'b' || symbol === '#')
					{
						return {type: 'reduce', production: 2};
					} // S -> Sb
					break;

				case 4: // After seeing c
					if (symbol === 'a' || symbol === 'b' || symbol === '#')
					{
						return {type: 'reduce', production: 3};
					} // S -> c
					break;
			}
			return {type: 'error'};
		},

		goto: (state, nonTerminal) =>
		{
			// Goto table
			if (nonTerminal === 'S' && state === 0)
			{
				return 1;
			}
			if (nonTerminal === 'Z' && state === 0)
			{
				return 0;
			}
			return -1;
		},

		rule: [
			{left: 'Z', right: ['S']},   // 0: Z -> S
			{left: 'S', right: ['S', 'a']}, // 1: S -> Sa
			{left: 'S', right: ['S', 'b']}, // 2: S -> Sb
			{left: 'S', right: ['c']}    // 3: S -> c
		]
	};

// Example usage with input "csasb#"
	const inputTokens = ['c', 's', 'a', 's', 'b', '#']; // Tokenized input
	const parser = new SyntacticRecognizer(slrTable, inputTokens);
	const success = parser.parse();

	console.log('Parsing result:', success ? 'Accepted' : 'Rejected');
}

main(process.argv.length, process.argv);