import {GrammarParser, TableGenerator} from "./TableGenerator/TableGenerator";
import {GrammarOptimizer} from "./TableOptimizer/TableOptimizer";
import * as fs from "node:fs";

function main(argc: number, argv: string[])
{
    if (process.argv[2] == 'table')
    {
        const parser = new GrammarParser(process.argv[3]);
        const grammar = parser.parseGrammar();

        const generator = new TableGenerator(grammar);
        generator.generateTable();
    }
    else if (process.argv[2] == 'optimize')
    {
        const inputStr = fs.readFileSync(argv[3], "utf8");
        GrammarOptimizer.optimize(inputStr, (str) => console.log(str));
    }
    else if (process.argv[2] == 'recognize')
    {

    }

}

main(process.argv.length, process.argv);