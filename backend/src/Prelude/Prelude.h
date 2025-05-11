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
			throw std::runtime_error(e.what() + std::string(" at line ") + std::to_string(chunk.lines[ip]));
		}
	}

	void runImpl()
	{
		while (ip < chunk.code.size())
		{
			switch (static_cast<OpCode>(advanceCode()))
			{
			case OpCode::CONSTANT:
			{
				Value constant = chunk.constants[advanceCode() - 1];
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
			case OpCode::JMP:
			{
				uint16_t offset = (static_cast<uint16_t>(advanceCode()) << 8) | advanceCode();
				ip = offset;
				break;
			}
			case OpCode::JMP_IF_FALSE:
			{
				uint16_t offset = (static_cast<uint16_t>(advanceCode()) << 8) | advanceCode();
				if (!toBool(pop()))
					ip = offset;
				break;
			}
			default:
				throw std::runtime_error("Unknown opcode");
			}
		}
	}

private:
	uint8_t advanceCode()
	{
		return chunk.code[ip++];
	}

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
	size_t ip = 0;
	std::stack<Value> stack;
};
