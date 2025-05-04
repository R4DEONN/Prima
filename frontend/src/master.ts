import {Prima} from "./Prima";

function main(argc: number, argv: string[])
{
	Prima.runFile(argv[2]);
}

main(process.argv.length, process.argv);