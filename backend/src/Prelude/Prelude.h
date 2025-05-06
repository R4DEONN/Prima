#pragma once

#include <stack>
#include <utility>
#include "../Common/Chunk.h"

enum class PreludeErrorCode
{
	PRELUDE_OK = 0,
	PRELUDE_COMPILE_ERROR = 1,
	PRELUDE_RUNTIME_ERROR = 2,
};

class Prelude
{
public:
	explicit Prelude(Chunk chunk)
		: chunk(std::move(chunk))
	{
	}

	PreludeErrorCode run()
	{
		while (ip < chunk.code.end())
		{
			OpCode instruction = static_cast<OpCode>(*ip++);

			switch (instruction)
			{
			case OpCode::CONSTANT: {
				Value constant = chunk.constants[*ip++];
				std::cout << constant << std::endl;
				break;
			}
			case OpCode::RETURN:
				return PreludeErrorCode::PRELUDE_OK;
			default:
				return PreludeErrorCode::PRELUDE_RUNTIME_ERROR;
			}
		}
	}

private:
	Chunk chunk;
	std::vector<uint8_t>::iterator ip;
	std::stack<Value> stack;
};
