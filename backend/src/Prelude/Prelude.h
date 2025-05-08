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

class Prelude
{
public:
	explicit Prelude(Chunk chunk)
		: chunk(std::move(chunk))
	{
	}

	void run()
	{
		try
		{
			runImpl();
		}
		catch (const std::exception& e)
		{
			throw std::runtime_error(e.what() + std::string(" at line ") + std::to_string(chunk.lines[ip - chunk.code.begin()]));
		}
	}

	void runImpl()
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
			case OpCode::NOT:
				push(!toBool(pop()));
				break;
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
				return;
			case OpCode::NIL:
				push(std::monostate{});
				break;
			case OpCode::TRUE:
				push(true);
				break;
			case OpCode::FALSE:
				push(false);
				break;
			case OpCode::EQUAL:
				BINARY_OP(==);
				break;
			case OpCode::GREATER:
				BINARY_OP(>);
				break;
			case OpCode::LESS:
				BINARY_OP(<);
				break;
			default:
				throw std::runtime_error("Unknown opcode");
			}
		}
	}

private:
	void push(const Value &value)
	{
		stack.push(value);
	}

	Value pop()
	{
		if (stack.empty())
		{
			throw std::runtime_error("Stack underflow");
		}
		auto value = stack.top();
		stack.pop();
		return value;
	}

	Chunk chunk;
	std::vector<uint8_t>::const_iterator ip;
	std::stack<Value> stack;
};
