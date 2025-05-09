#pragma once

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

	//Declaration
	CONSTANT,
	NIL,
	TRUE,
	FALSE,

	//End
	RETURN,
};
