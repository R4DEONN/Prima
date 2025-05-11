#pragma once
#include <unordered_map>

#include "../Common/OpCode.h"

const std::string CONSTANT_STATE_STRING = ".constants";
const std::string CODE_STATE_STRING = ".code";

inline std::unordered_map<OpCode, uint8_t> countCommandBytes = {
	// One byte command
	{OpCode::ADD, 1},
	{OpCode::SUBTRACT, 1},
	{OpCode::MULTIPLY, 1},
	{OpCode::DIVIDE, 1},
	{OpCode::EQUAL, 1},
	{OpCode::GREATER, 1},
	{OpCode::LESS, 1},
	{OpCode::NEGATE, 1},
	{OpCode::NOT, 1},
	{OpCode::TRUE, 1},
	{OpCode::FALSE, 1},
	{OpCode::RETURN, 1},

	// Two bytes
	{OpCode::CONSTANT, 2},

	// Three bytes
	{OpCode::JMP, 3},
	{OpCode::JMP_IF_FALSE, 3},
};

inline int getCountCommandBytes(OpCode opcode)
{
	try
	{
		return countCommandBytes.at(opcode);
	}
	catch (...)
	{
		throw std::invalid_argument("Unknown count bytes for opcode " + toString(opcode));
	}
}