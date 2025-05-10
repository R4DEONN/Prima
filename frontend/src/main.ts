import {GrammarProcessor} from "./TableGenerator/Processor/GrammarProcessor";
import {Scanner} from "./Scanner/Scanner";
import {ConsoleReporter} from "./Error/ErrorReporter/ConsoleReporter";
import fs from "node:fs";
import {ConsoleParserErrorReporter} from "./SyntacticRecognizer/ParserTypes";
import {SyntacticRecognizer} from "./SyntacticRecognizer/SyntacticRecognizer";

function main(argc: number, argv: string[])
{
    if (argv[2] == "table")
    {
        const processor = new GrammarProcessor("grammar.txt");
        processor.processGrammar();
        processor.exportTable("output.json");
    }
    else if (argv[2] == "recognize")
    {
        const errorReporter = new ConsoleReporter();
        const source = fs.readFileSync("input.txt", 'utf8');
        const scanner = new Scanner(source, errorReporter);
        const tokens = scanner.scanTokens()


        const parserErrorReporter = new ConsoleParserErrorReporter();

        const recognizer = new SyntacticRecognizer("./output.json", tokens, parserErrorReporter);

        const success = recognizer.parse();

        if (success)
        {
            console.log("\nParsing successful!");
        }
        else
        {
            console.log("\nParsing failed.");
        }
    }
}

main(process.argv.length, process.argv);