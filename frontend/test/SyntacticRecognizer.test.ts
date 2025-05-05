import {describe, expect, test} from "@jest/globals";
import {SyntacticRecognizer} from "../src/SyntacticRecognizer/SyntacticRecognizer";

describe('SyntacticRecognizer', () =>
{
	// Простая грамматика для арифметических выражений
	const arithmeticGrammar = {
		"<Z>": {
			"<E>": "<E>0,1",
			"~#~": "OK"
		},
		"<E>0,1": {
			"~#~": "R<Z>1",
			"~+~": "~+~1,1"
		},
		"~+~1,1": {
			"<E>": "<E>1,2"
		},
		"<E>1,2": {
			"~#~": "R<E>3"
		},
		"~n~": {
			"~#~": "R<E>1",
			"~+~": "R<E>1"
		}
	};

	// Грамматика для списка идентификаторов
	const idListGrammar = {
		"<Z>": {
			"<S>": "<S>0,1",
			"~#~": "OK"
		},
		"<S>0,1": {
			"~#~": "R<Z>1",
			"~id~": "~id~1,1"
		},
		"~id~1,1": {
			"~#~": "R<S>1",
			"~,~": "~,~1,1"
		},
		"~,~1,1": {
			"~id~": "~id~1,2"
		},
		"<id>1,2": {
			"~#~": "R<S>3",
			"~,~": "R<S>3"
		}
	};

	// Грамматика с ошибкой (не SLR(1))
	const errorGrammar = {
		"<Z>": {
			"<S>": "<S>0,1"
		},
		"<S>0,1": {
			"~a~": "~a~1,1",
			"~b~": "~b~1,1"
		},
		"~a~1,1": {
			"~a~": "~a~1,1"
		} // Намеренная ошибка - бесконечная рекурсия
	};

	const nehoroshkovaTable = {
		"<Z>": {
			"<Z>": "OK",
			"<S>": "<S>0,1",
			"~real~": "~real~1,1"
		},
		"<S>0,1": {
			"~#~": "R<Z>1"
		},
		"~real~1,1": {
			"<idlist>": "<idlist>1,2+<idlist>3,1",
			"<id>": "<id>3,1",
			"~A~": "~A~4,1"
		},
		"<idlist>1,2+<idlist>3,1": {
			"~,~": "~,~2,2",
			"~#~": "R<S>2"
		},
		"<id>3,1": {
			"~,~": "R<idlist>1",
			"~#~": "R<idlist>1"
		},
		"~A~4,1": {
			"~,~": "R<id>1",
			"~#~": "R<id>1"
		},
		"~,~2,2": {
			"<id>": "<id>2,3",
			"~A~": "~A~4,1"
		},
		"<id>2,3": {
			"~,~": "R<idlist>3",
			"~#~": "R<idlist>3"
		}
	}

	describe('Арифметическая грамматика', () =>
	{
		const recognizer = new SyntacticRecognizer(JSON.stringify(arithmeticGrammar));

		test('Корректное выражение', () =>
		{
			expect(recognizer.parse("~n~ ~+~ ~n~ ~#~")).toBe(true);
		});

		test('Незавершенное выражение', () =>
		{
			expect(recognizer.parse("~n~ ~+~")).toBe(false);
		});

		test('Лишние токены', () =>
		{
			expect(recognizer.parse("~n~ ~+~ ~n~ ~n~ ~#~")).toBe(false);
		});
	});

	describe('Грамматика списка идентификаторов', () =>
	{
		const recognizer = new SyntacticRecognizer(JSON.stringify(idListGrammar));

		test('Один идентификатор', () =>
		{
			expect(recognizer.parse("~id~ ~#~")).toBe(true);
		});

		test('Несколько идентификаторов', () =>
		{
			expect(recognizer.parse("~id~ ~,~ ~id~ ~,~ ~id~ ~#~")).toBe(true);
		});

		test('Лишняя запятая в конце', () =>
		{
			expect(recognizer.parse("~id~ ~,~ ~id~ ~,~ ~#~")).toBe(false);
		});
	});

	describe('Ошибочные случаи', () =>
	{
		test('Неверная грамматика', () =>
		{
			const recognizer = new SyntacticRecognizer(JSON.stringify(errorGrammar));
			expect(() => recognizer.parse("~a~ ~a~ ~a~ ~#~")).toThrow();
		});

		test('Неизвестные токены', () =>
		{
			const recognizer = new SyntacticRecognizer(JSON.stringify(arithmeticGrammar));
			expect(recognizer.parse("~x~ ~+~ ~y~ ~#~")).toBe(false);
		});

		test('Пустой ввод', () =>
		{
			const recognizer = new SyntacticRecognizer(JSON.stringify(arithmeticGrammar));
			expect(recognizer.parse("")).toBe(false);
		});
	});

	describe('Внутренние методы', () =>
	{
		const recognizer = new SyntacticRecognizer(JSON.stringify(arithmeticGrammar));

		test('_parseReduceAction корректно парсит действия', () =>
		{
			const result = recognizer['_parseReduceAction']("R<E>3");
			expect(result).toEqual({symbol: "<E>", count: 3});
		});

		test('_parseReduceAction бросает ошибку при неверном формате', () =>
		{
			expect(() => recognizer['_parseReduceAction']("Invalid")).toThrow();
		});
	});

	describe('Грамматика Нехорошковой', () =>
	{
		const recognizer = new SyntacticRecognizer(JSON.stringify(nehoroshkovaTable));

		test('Корректный вход', () =>
		{
			expect(recognizer.parse("~real~ ~A~ ~,~ ~A~ ~,~ ~A~ ~,~ ~A~ ~#~")).toBe(true);
		});

		test('Неверный вход', () =>
		{
			expect(recognizer.parse("~real~ ~A~ ~,~ ~A~ ~,~ ~A~ ~,~ ~#~")).toBe(false);
		});
	});
});
