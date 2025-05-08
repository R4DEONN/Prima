#pragma once

#include <stack>
#include <utility>
#include "../Common/Chunk.h"

#define BINARY_OP(op) \
do { \
Value b = pop(); \
Value a = pop(); \
push(a op b); \
} while (false)

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
		ip = chunk.code.begin();
		while (ip < chunk.code.end())
		{
			switch (static_cast<OpCode>(*ip++))
			{
			case OpCode::CONSTANT:
			{
				Value constant = chunk.constants[*ip++];
				push(constant);
				break;
			}
			case OpCode::ADD:
				BINARY_OP(+);
				break;
			case OpCode::SUBTRACT:
				BINARY_OP(-);
				break;
			case OpCode::MULTIPLY:
				BINARY_OP(*);
				break;
			case OpCode::DIVIDE:
				BINARY_OP(/);
				break;
			case OpCode::NEGATE:
				push(-pop());
				break;
			case OpCode::RETURN:
				std::cout << pop() << std::endl;
				return PreludeErrorCode::PRELUDE_OK;
			default:
				return PreludeErrorCode::PRELUDE_RUNTIME_ERROR;
			}
		}

		return PreludeErrorCode::PRELUDE_OK;
	}

private:
	void push(const Value &value)
	{
		stack.push(value);
	}

	Value pop()
	{
		auto value = stack.top();
		stack.pop();
		return value;
	}

	Chunk chunk;
	std::vector<uint8_t>::const_iterator ip;
	std::stack<Value> stack;
};
