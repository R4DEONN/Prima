import {describe, expect, test} from "@jest/globals";

describe("mew", () =>
{
	test("test", () =>
	{
		expect(1).toBe(1);
		expect({'s': 's'}).toStrictEqual({'s': 's'});

		expect(() =>
		{
			throw new Error()
		}).toThrow()
	});
});