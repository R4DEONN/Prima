import {Scanner} from "./Scanner/Scanner";
import {ConsoleReporter} from "./Error/ErrorReporter/ConsoleReporter";
import fs from "node:fs";
import {ConsoleParserErrorReporter} from "./SyntacticRecognizer/ParserTypes";
import {SyntacticRecognizer} from "./SyntacticRecognizer/SyntacticRecognizer";
import {CodeGenerator} from "./CodeGeneration/CodeGenerator";

function main(argc: number, argv: string[])
{
    const errorReporter = new ConsoleReporter();
    const source = fs.readFileSync("input.txt", 'utf8');
    const scanner = new Scanner(source, errorReporter);
    const tokens = scanner.scanTokens()


    const parserErrorReporter = new ConsoleParserErrorReporter();

    const recognizer = new SyntacticRecognizer("./output.json", tokens, parserErrorReporter);

    const rootNode = recognizer.parse();

    const generator = new CodeGenerator();

    rootNode.generate(generator);

    let bytecode = "";
    bytecode += ".constants\n"
    bytecode += generator.getConstants().join('\n');
    bytecode += "\n.code\n";
    bytecode += generator.getCode().join('\n');

    fs.writeFileSync("./before.prmbc", bytecode);
}

main(process.argv.length, process.argv);