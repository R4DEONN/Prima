import {Prima} from "./Prima";

function printUsage()
{
	console.log(`
Использование: prima <режим> [входные_данные]

Режимы:
  source    - выполнить указанный исходный код
  file      - выполнить код из указанного файла
  prompt    - запустить интерактивную консоль (REPL)

Примеры:
  prima source "print(42);"
  prima file example.prm
  prima prompt
`);
}

function main(argc: number, argv: string[])
{
	if (argc < 3)
	{
		printUsage();
		process.exit(1);
	}

	const mode = argv[2];

	switch (mode)
	{
		case "source":
			if (argc < 4)
			{
				console.error("Ошибка: требуется строка с исходным кодом для режима 'source'");
				printUsage();
				process.exit(1);
			}
			Prima.run(argv[3]);
			break;

		case "file":
			if (argc < 4)
			{
				console.error("Ошибка: требуется имя файла для режима 'file'");
				printUsage();
				process.exit(1);
			}
			Prima.runFile(argv[3]);
			break;

		case "prompt":
			(async () =>
			{
				await Prima.runPrompt();
			})();
			break;

		default:
			console.error(`Неизвестный режим: ${mode}`);
			printUsage();
			process.exit(1);
	}
}

main(process.argv.length, process.argv);