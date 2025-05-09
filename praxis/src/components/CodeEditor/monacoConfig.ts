import type * as monaco from 'monaco-editor';

export const registerPrimaLanguage = (monaco: any) =>
{
	monaco.languages.register({id: 'prima'});

	// Конфигурация языка (токенизатор)
	monaco.languages.setMonarchTokensProvider('prima', {
		defaultToken: 'invalid',

		// Список зарезервированных слов языка, которые должны подсвечиваться особым образом
		keywords: [
			'function', 'var', 'const', 'if', 'else', 'for', 'return',
			'int', 'float', 'bool', 'string', 'array', 'object', 'null', 'void'
		],

		// Список операторов (например, +, &&, ==), которые будут распознаваться отдельно от других символов
		operators: [
			'=', '+=', '-=', '||', '&&', '==', '!=', '<', '<=', '>', '>=',
			'+', '-', '*', '/', '%', '**', '!', '++', '--'
		],

		// Регулярное выражение, которое описывает символы, используемые в операторах.
		// Это нужно для группировки символов, которые могут быть частью операторов (например, +=, !=).
		symbols: /[=><!~?:&|+\-*\/\^%]+/,

		// Категории литералов (чисел, строк, булевых значений), которые могут использоваться для дополнительной обработки
		numberLiterals: ['IntegerLiteral', 'FloatLiteral'],
		stringLiterals: ['StringLiteral'],
		booleanLiterals: ['BooleanLiteral'],

		// Разделители
		delimiters: [';', ',', '(', ')', '{', '}', '[', ']', ':', '.'],

		// Идентификаторы
		identifier: /^[_a-zA-Z][_a-zA-Z0-9]*/,

		//Токенизатор — это набор правил, которые разбивают исходный код на токены (ключевые слова, строки, числа и т. д.).
		// Он работает как конечный автомат, переключаясь между состояниями (root, comment, whitespace).
		tokenizer: {
			root: [
				// Комментарии
				[/\/\/.*$/, 'comment'],
				[/\/\*/, 'comment', '@comment'],

				// Типы
				[/\b(int|float|bool|string|array|object|null|void)\b/, 'type'],

				// Ключевые слова
				[/\b(function|var|const|if|else|for|return)\b/, 'keyword'],

				// Идентификаторы
				[/[a-zA-Z_$][\w$]*/, {
					cases: {
						'@keywords': 'keyword',
						'@default': 'identifier'
					}
				}],

				// Числа
				[/\d+\.\d+([eE][\-+]?\d+)?/, 'number.float'],
				[/\d+/, 'number'],

				// Строки
				[/"([^"\\]|\\.)*$/, 'string.invalid'],
				[/"([^"\\]|\\.)*"/, 'string'],

				// Операторы
				[/@symbols/, {
					cases: {
						'@operators': 'operator',
						'@default': ''
					}
				}],

				// Разделители
				[/[;,.:(){}[\]]/, 'delimiter'],

				// Пробелы
				{include: '@whitespace'}
			],

			comment: [
				[/[^\/*]+/, 'comment'],         // Любой текст внутри /* ... */
				[/\/\*/, 'comment', '@push'],   // Вложенный комментарий (переход в новое состояние)
				["\\*/", 'comment', '@pop'],    // Конец комментария (возврат в предыдущее состояние)
				[/[\/*]/, 'comment']            // Одиночные / или *
			],

			whitespace: [
				[/[ \t\r\n]+/, 'white'],          // Пробелы, табы, переносы строк
				[/\/\*/, 'comment', '@comment'],  // Начало многострочного комментария
				[/\/\/.*$/, 'comment']            // Однострочный комментарий
			]
		}
	});

	monaco.languages.registerCompletionItemProvider('prima', {
		provideCompletionItems: (model: any, position: any) =>
		{
			const suggestions = [
				{
					label: 'function',
					kind: monaco.languages.CompletionItemKind.Keyword,
					documentation: 'Define a new function',
					insertText: 'function'
				},
				{
					label: 'if',
					kind: monaco.languages.CompletionItemKind.Keyword,
					documentation: 'If statement',
					insertText: 'if ()'
				},
				{
					label: 'for',
					kind: monaco.languages.CompletionItemKind.Keyword,
					documentation: 'For loop',
					insertText: 'for (;;)'
				},
				{
					label: 'var',
					kind: monaco.languages.CompletionItemKind.Keyword,
					documentation: 'Variable declaration',
					insertText: 'var'
				},
				{
					label: 'return',
					kind: monaco.languages.CompletionItemKind.Keyword,
					documentation: 'Return statement',
					insertText: 'return;'
				},
				{
					label: 'int',
					kind: monaco.languages.CompletionItemKind.TypeParameter,
					documentation: 'Integer type',
					insertText: 'int'
				},
				{
					label: 'float',
					kind: monaco.languages.CompletionItemKind.TypeParameter,
					documentation: 'Float type',
					insertText: 'float'
				}
			];

			return {suggestions};
		}
	});

	monaco.editor.defineTheme('primaTheme', {
		base: 'vs-dark',
		inherit: true,
		rules: [
			{token: 'keyword', foreground: '#569CD6'},
			{token: 'type', foreground: '#4EC9B0'},
			{token: 'operator', foreground: '#D4D4D4'},
			{token: 'number', foreground: '#B5CEA8'},
			{token: 'number.float', foreground: '#B5CEA8'},
			{token: 'string', foreground: '#CE9178'},
			{token: 'comment', foreground: '#6A9955'},
			{token: 'identifier', foreground: '#9CDCFE'},
			{token: 'delimiter', foreground: '#F9D829'}
		],
		colors: {
			'editor.background': '#1E1E1E',
			'editor.foreground': '#D4D4D4'
		}
	});
};

export const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
	minimap: {enabled: false},
	fontSize: 14,
	scrollBeyondLastLine: false,
	automaticLayout: true,
};