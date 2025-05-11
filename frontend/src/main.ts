import {GrammarProcessor} from "./TableGenerator/Processor/GrammarProcessor";
import {Scanner} from "./Scanner/Scanner";
import {ConsoleReporter} from "./Error/ErrorReporter/ConsoleReporter";
import fs from "node:fs";
import {ConsoleParserErrorReporter} from "./SyntacticRecognizer/ParserTypes";
import {SyntacticRecognizer} from "./SyntacticRecognizer/SyntacticRecognizer";
import {BinaryExpression} from "./AST/Nodes/BinaryExpression";
import {Literal} from "./AST/Nodes/Literal";
import {Type} from "./AST/Types/Type";
import {UnaryExpression} from "./AST/Nodes/UnaryExpression";
import {Program} from "./AST/Nodes/Program";
import {CodeGenerator} from "./CodeGeneration/CodeGenerator";

function main(argc: number, argv: string[])
{
    const input = "!(5 - 4 > 3 * 2 == !0)";

    const minusExpr = new BinaryExpression(
        new Literal(5, Type.NUMBER),
        new Literal(4, Type.NUMBER),
        "-",
        Type.NUMBER
    );

    const multiplyExpr = new BinaryExpression(
        new Literal(3, Type.NUMBER),
        new Literal(2, Type.NUMBER),
        "*",
        Type.NUMBER
    );

    const greaterExpr = new BinaryExpression(
        minusExpr,
        multiplyExpr,
        ">",
        Type.BOOL
    );

    const notZeroExpr = new UnaryExpression(
        "!",
        new Literal(0, Type.NUMBER),
        Type.BOOL
    );

    const equalityExpr = new BinaryExpression(
        greaterExpr,
        notZeroExpr,
        "==",
        Type.BOOL
    );

    const rootExpression = new UnaryExpression(
        "!",
        equalityExpr,
        Type.BOOL
    );

    const program = new Program([rootExpression]);

    const generator = new CodeGenerator();
    program.generate(generator);

    console.log('.constants');
    console.log(generator.getConstants().join('\n'));
    console.log('.code');
    console.log(generator.getCode().join('\n'));

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