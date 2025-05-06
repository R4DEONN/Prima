#pragma once

#include <cstdint>

#include "vector"
#include "OpCode.h"
#include "Value.h"

class Chunk
{
public:
	void write(OpCode byte, int line)
	{
		code.push_back(static_cast<uint8_t>(byte));
		lines.push_back(line);
	}

	void writeConstant(const Value &value, int line)
	{
		auto constantIndex = constants.size();
		constants.push_back(value);
		write(OpCode::CONSTANT, line);
		code.push_back(static_cast<uint8_t>(constantIndex));
	}

	std::vector<uint8_t> code;
	std::vector<int> lines;
	std::vector<Value> constants;
};
