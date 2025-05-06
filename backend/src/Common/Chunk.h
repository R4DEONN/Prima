#pragma once

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

	std::vector<uint8_t> code;
	std::vector<int> lines;
	std::vector<Value> constants;
};
