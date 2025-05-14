#pragma once

#include <cstdint>

#include "OpCode.h"
#include "vector"
#include "../Value/Value.h"

class Chunk
{
public:
	void write(uint8_t byte, int line)
	{
		code.push_back(byte);
		lines.push_back(line);
	}

	void write(OpCode opcode, int line)
	{
		code.push_back(static_cast<uint8_t>(opcode));
		lines.push_back(line);
	}

	auto writeConstant(const Value &value)
	{
		auto constantIndex = constants.size();
		constants.push_back(value);

		return constantIndex;
	}

	std::vector<uint8_t> code;
	std::vector<int> lines;
	std::vector<Value> constants;
};
