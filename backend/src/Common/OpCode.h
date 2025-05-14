#pragma once
#include <unordered_map>

enum class OpCode : uint8_t
{
	//Unary
	NEGATE,
	NOT,

	//Binary
	ADD,
	SUBTRACT,
	MULTIPLY,
	DIVIDE,
	EQUAL,
	GREATER,
	LESS,

	//Push
	CONSTANT,
	TRUE,
	FALSE,

	//Var
	DEFINE_GLOBAL,
	GET_GLOBAL,
	SET_GLOBAL,

	//JMP
	JMP,
	JMP_IF_FALSE,

	//Debug
	PRINT,

	//End
	RETURN,
};

inline std::string toString(OpCode op)
{
	switch (op)
	{
	case OpCode::NEGATE:
		return "NEGATE";
	case OpCode::NOT:
		return "NOT";
	case OpCode::ADD:
		return "ADD";
	case OpCode::SUBTRACT:
		return "SUBTRACT";
	case OpCode::MULTIPLY:
		return "MULTIPLY";
	case OpCode::DIVIDE:
		return "DIVIDE";
	case OpCode::EQUAL:
		return "EQUAL";
	case OpCode::GREATER:
		return "GREATER";
	case OpCode::LESS:
		return "LESS";
	case OpCode::CONSTANT:
		return "CONSTANT";
	case OpCode::TRUE:
		return "TRUE";
	case OpCode::FALSE:
		return "FALSE";
	case OpCode::JMP:
		return "JMP";
	case OpCode::JMP_IF_FALSE:
		return "JMP_IF_FALSE";
	case OpCode::PRINT:
		return "PRINT";
	case OpCode::RETURN:
		return "RETURN";
	default:
		return "UNKNOWN_OPCODE";
	}
}

inline std::ostream &operator<<(std::ostream &os, const OpCode &op)
{
	return os << toString(op);
}

const std::unordered_map<std::string, OpCode> InstructionMap = {
	{"const", OpCode::CONSTANT},
	{"add", OpCode::ADD},
	{"sub", OpCode::SUBTRACT},
	{"mul", OpCode::MULTIPLY},
	{"div", OpCode::DIVIDE},
	{"neg", OpCode::NEGATE},
	{"ret", OpCode::RETURN},
	{"true", OpCode::TRUE},
	{"false", OpCode::FALSE},
	{"ceq", OpCode::EQUAL},
	{"cgt", OpCode::GREATER},
	{"clt", OpCode::LESS},
	{"not", OpCode::NOT},
	{"jmpfalse", OpCode::JMP_IF_FALSE},
	{"jmp", OpCode::JMP},
	{"defglobal", OpCode::DEFINE_GLOBAL},
	{"setglobal", OpCode::SET_GLOBAL},
	{"getglobal", OpCode::GET_GLOBAL},
};

inline OpCode getOpCodeFromString(const std::string &str)
{
	try
	{
		return InstructionMap.at(str);
	}
	catch (...)
	{
		throw std::invalid_argument("Unknown opcode: " + str);
	}
}
