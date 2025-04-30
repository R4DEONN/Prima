enum EntityType {
	TERMINAL = "TERMINAL",
	NON_TERMINAL = "NON_TERMINAL",
}

abstract class Entity {
	protected constructor(
		protected _value: string
	) {
	}

	getValue(): string {
		return this._value;
	}

	abstract getType(): EntityType;

	equals(rhs: Entity): boolean {
		return this.getType() === rhs.getType() && this._value === rhs.getValue();
	}
}

type Rule = Array<Entity>;
type Rules = Array<Rule>;

class NonTerminal extends Entity {
	constructor(
		value: string,
		private _rules: Rules = []
	) {
		super(value);
	}

	addRule(rule: Rule): void {
		const isRuleExists = this._rules.some(existingRule =>
			existingRule.length === rule.length &&
			existingRule.every((entity, index) => entity.equals(rule[index]))
		);

		if (!isRuleExists) {
			this._rules.push([...rule]);
		}
	}

	clearRules(): void {
		this._rules = [];
	}

	getRules(): Rules {
		return this._rules;
	}

	getType(): EntityType {
		return EntityType.NON_TERMINAL;
	}
}

class Terminal extends Entity {
	constructor(value: string) {
		super(value);
	}

	getType(): EntityType {
		return EntityType.TERMINAL;
	}
}

export {EntityType, Entity, Rule, Rules, Terminal, NonTerminal};