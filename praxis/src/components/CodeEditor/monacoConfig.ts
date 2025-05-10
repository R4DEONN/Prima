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
				[/[a-zA-Z_$][\w$]*(?=\()/, 'function.call'],

				[/\bfunction\b/, 'keyword', '@functionName'],

				// Комментарии
				[/\/\/.*$/, 'comment'],
				[/\/\*/, 'comment', '@comment'],

				// Ключевые слова
				[/\b(function|var|const|if|else|for|return|true|false)\b/, 'keyword'],

				// Типы
				[/\b(number|bool|string|array|object|null|void)\b/, 'type'],

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
			],

			functionName: [
				// Следующий идентификатор после function - имя функции
				[/[a-zA-Z_$][\w$]*/, 'function.name', '@pop'],
			],
		}
	});

	monaco.languages.registerCompletionItemProvider('prima', {
		provideCompletionItems: (_model: monaco.editor.ITextModel, _position: monaco.Position) =>
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

	monaco.editor.defineTheme('prima-dark', {
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
			'editor.foreground': '#D4D4D4',
			'editorGutter.background': '#282828' // Цвет фона области номеров строк
		}
	});

	monaco.editor.defineTheme('prima-dark-2', {
		base: 'vs-dark',
		inherit: false,
		rules: [
			{token: 'keyword', foreground: '#c57b39'},
			{token: 'type', foreground: '#c57b39'},
			{token: 'operator', foreground: '#D4D4D4'},
			{token: 'number', foreground: '#6f96ba'},
			{token: 'number.float', foreground: '#6f96ba'},
			{token: 'string', foreground: '#6c875a'},
			{token: 'comment', foreground: '#808080'},
			{token: 'identifier', foreground: '#abb7c5'},
			{token: 'function.name', foreground: '#f9c872'},
			{token: 'function.call', foreground: '#f9c872'},
			{token: 'delimiter', foreground: '#c57b39'}
		],
		colors: {
			'editor.background': '#1c2022',
			'editor.foreground': '#bababa',
			'editorLineNumber.foreground': '#606366',
			'editorLineNumber.activeForeground': '#a4a3a3',
			'editor.lineHighlightBackground': '#202426',
			'editor.lineHighlightBorder': '#202426'
		}
	});

	monaco.editor.defineTheme('prima-dark-3', {
		base: 'vs-dark',
		inherit: false,
		rules: [
			{token: 'keyword', foreground: '#ca906f'},
			{token: 'type', foreground: '#ca906f'},
			{token: 'operator', foreground: '#bcbec4'},
			{token: 'number', foreground: '#46aab7'},
			{token: 'number.float', foreground: '#46aab7'},
			{token: 'string', foreground: '#70aa74'},
			{token: 'comment', foreground: '#7b7e85'},
			{token: 'identifier', foreground: '#9776a9'},
			{token: 'function.name', foreground: '#67a6f3'},
			{token: 'function.call', foreground: '#67a6f3'},
			{token: 'delimiter', foreground: '#bcbec4'}
		],
		colors: {
			'editor.background': '#1e1f22',
			'editor.foreground': '#bcbec4',
			'editorLineNumber.foreground': '#4b5059',
			'editorLineNumber.activeForeground': '#a1a3ab',
			'editor.lineHighlightBackground': '#26282e',
			'editor.lineHighlightBorder': '#26282e'
		}
	});

	// Добавьте этот код после registerCompletionItemProvider
	monaco.languages.registerDocumentFormattingEditProvider('prima', {
		provideDocumentFormattingEdits: (_model: monaco.editor.ITextModel, _options: monaco.languages.FormattingOptions, _token: monaco.CancellationToken) =>
		{
			return [{
				range: _model.getFullModelRange(),
				text: formatPrimaCode(_model.getValue())
			}];
		}
	});

	function formatPrimaCode(code: string): string {
		// Удаляем все существующие точки с запятой (мы добавим их позже)
		code = code.replace(/;/g, '');

		// Нормализуем пробелы
		code = code.replace(/(\w+):(\w+)/g, '$1: $2')  // Типы
			.replace(/\):(\w+)/g, '): $1')      // Возвращаемый тип
			.replace(/(\{|\})/g, ' $1 ')        // Скобки
			.replace(/\s+/g, ' ')               // Множественные пробелы
			.trim();

		const lines = code.split(/(\{|\})/);
		let indentLevel = 0;
		const indentSize = 4;
		let result: string[] = [];
		let inFunction = false;

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i].trim();
			if (line === '') continue;

			// Обработка функции
			if (line.startsWith('function')) {
				// Всегда добавляем пустую строку перед функцией (кроме самой первой)
				if (result.length > 0 && result[result.length-1].trim() === '') {
					result.push('');
				}
				inFunction = true;
				result.push(line);
				continue;
			}

			// Открывающая скобка функции
			if (line === '{' && inFunction) {
				result.push(' '.repeat(indentLevel * indentSize) + line);
				indentLevel++;
				continue;
			}

			// Тело функции
			if (inFunction && line !== '}') {
				if (line.startsWith('return')) {
					result.push(' '.repeat(indentLevel * indentSize) + line + ';');
				}
				continue;
			}

			// Закрывающая скобка функции
			if (line === '}' && inFunction) {
				indentLevel--;
				const closingLine = ' '.repeat(indentLevel * indentSize) + line;
				result.push(closingLine);
				// Всегда добавляем пустую строку после функции
				result.push('');
				inFunction = false;
				continue;
			}

			// Обычные строки
			result.push(' '.repeat(indentLevel * indentSize) + line);
		}

		// Удаляем возможную лишнюю пустую строку в самом конце
		if (result.length > 0 && result[result.length-1].trim() === '') {
			result.pop();
		}

		return result.join('\n');
	}
};

export const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
	minimap: {enabled: false},
	fontSize: 14,
	scrollBeyondLastLine: false,
	automaticLayout: true,
	tabSize: 4,
	formatOnType: true,
	formatOnPaste: true,
};