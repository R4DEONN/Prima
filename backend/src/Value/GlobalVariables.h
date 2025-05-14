#pragma once
#include <unordered_map>

#include "Value.h"

class GlobalVariables
{
public:
	void define(StringPtr name, const Value &value)
	{
		_variables.emplace(name, value);
	}

	void set(const StringPtr &name, const Value &value)
	{
		auto it = _variables.find(name);
		it->second = value;
	}

	Value get(const StringPtr &name)
	{
		auto it = _variables.find(name);
		return it->second;
	}

private:
	std::unordered_map<StringPtr, Value> _variables;
};
