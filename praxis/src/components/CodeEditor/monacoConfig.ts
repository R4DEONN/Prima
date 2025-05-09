import type * as monaco from 'monaco-editor';

export const registerPrimaLanguage = (monaco: any) =>
{
	monaco.languages.register({id: 'prima'});

	// Конфигурация языка (токенизатор)
	monaco.languages.setMonarchTokensProvider('prima', {
		defaultToken: 'invalid',

		// Ключевые слова
		keywords: [
			'function', 'var', 'const', 'if', 'else', 'for', 'return',
			'int', 'float', 'bool', 'string', 'array', 'object', 'null', 'void'
		],

		// Операторы
		operators: [
			'=', '+=', '-=', '||', '&&', '==', '!=', '<', '<=', '>', '>=',
			'+', '-', '*', '/', '%', '**', '!', '++', '--'
		],

		// Символы
		symbols: /[=><!~?:&|+\-*\/\^%]+/,

		// Числовые литералы
		numberLiterals: [
			'IntegerLiteral', 'FloatLiteral'
		],

		// Строковые литералы
		stringLiterals: [
			'StringLiteral'
		],

		// Логические литералы
		booleanLiterals: [
			'BooleanLiteral'
		],

		// Разделители
		delimiters: [';', ',', '(', ')', '{', '}', '[', ']', ':', '.'],

		// Идентификаторы
		identifier: /^[_a-zA-Z][_a-zA-Z0-9]*/,

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
				[/[^\/*]+/, 'comment'],
				[/\/\*/, 'comment', '@push'],
				["\\*/", 'comment', '@pop'],
				[/[\/*]/, 'comment']
			],

			whitespace: [
				[/[ \t\r\n]+/, 'white'],
				[/\/\*/, 'comment', '@comment'],
				[/\/\/.*$/, 'comment']
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
					insertText: 'function newFun(): void {}'
				},
				{
					label: 'if',
					kind: monaco.languages.CompletionItemKind.Keyword,
					documentation: 'If statement',
					insertText: 'if (${1:condition}) {\n\t${2}\n}'
				},
				{
					label: 'for',
					kind: monaco.languages.CompletionItemKind.Keyword,
					documentation: 'For loop',
					insertText: 'for (${1:init}; ${2:condition}; ${3:update}) {\n\t${4}\n}'
				},
				{
					label: 'var',
					kind: monaco.languages.CompletionItemKind.Keyword,
					documentation: 'Variable declaration',
					insertText: 'var ${1:name}: ${2:type} = ${3:value};'
				},
				{
					label: 'return',
					kind: monaco.languages.CompletionItemKind.Keyword,
					documentation: 'Return statement',
					insertText: 'return ${1:value};'
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
			{token: 'delimiter', foreground: '#D4D4D4'}
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