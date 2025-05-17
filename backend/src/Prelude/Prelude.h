#pragma once

#include <stack>
#include <utility>

#include "StackFrame.h"
#include "../Common/Chunk.h"
#include "../Value/GlobalVariables.h"

#define BINARY_OP(op) \
do { \
Value b = pop(); \
Value a = pop(); \
push(a op b); \
} while (false)

class Prelude
{
public:
	explicit Prelude(Chunk chunk, StringPool stringPool)
		: _chunk(std::move(chunk)),
			_stringPool(std::move(stringPool))
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
			throw std::runtime_error(e.what() + std::string(" at line ") + std::to_string(_chunk.lines[_ip]));
		}
	}

	void runImpl()
	{
		while (_ip < _chunk.code.size())
		{
			switch (static_cast<OpCode>(advanceCode()))
			{
			case OpCode::CONSTANT:
			{
				Value constant = _chunk.constants[advanceCode() - 1];
				push(constant);
				break;
			}
			case OpCode::NOT:
				push(!toBool(pop()));
				break;
			case OpCode::ADD:
			{
				Value b = pop();
				Value a = pop();
				auto newValue = a + b;
				if (std::holds_alternative<StringPtr>(newValue))
				{
					newValue = _stringPool.intern(*std::get<StringPtr>(newValue));
				}
				push(newValue);
				break;
			}
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
				_ip = offset;
				break;
			}
			case OpCode::JMP_IF_FALSE:
			{
				uint16_t offset = (static_cast<uint16_t>(advanceCode()) << 8) | advanceCode();
				if (!toBool(pop()))
				{
					_ip = offset;
				}
				break;
			}
			case OpCode::DEFINE_GLOBAL:
			{
				Value constant = _chunk.constants[advanceCode() - 1];
				_globals.define(std::get<StringPtr>(constant), pop());
				break;
			}
			case OpCode::GET_GLOBAL:
			{
				Value constant = _chunk.constants[advanceCode() - 1];
				push(_globals.get(std::get<StringPtr>(constant)));
				break;
			}
			case OpCode::SET_GLOBAL:
			{
				Value constant = _chunk.constants[advanceCode() - 1];
				_globals.set(std::get<StringPtr>(constant), pop());
				break;
			}
			case OpCode::GET_LOCAL:
				break;
			case OpCode::SET_LOCAL:
				break;
			default:
				throw std::runtime_error("Unknown opcode");
			}
		}
	}

private:
	uint8_t advanceCode()
	{
		return _chunk.code[_ip++];
	}

	void push(const Value &value)
	{
		_stack.push(value);
	}

	Value pop()
	{
		if (_stack.empty())
		{
			throw std::runtime_error("Stack underflow");
		}
		auto value = _stack.top();
		_stack.pop();
		return value;
	}

	Chunk _chunk;
	StringPool _stringPool;
	GlobalVariables _globals;
	size_t _ip = 0;
	std::stack<Value, std::vector<Value>> _stack;
	std::vector<StackFrame> _frames;
};
