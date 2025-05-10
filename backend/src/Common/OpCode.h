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
	TRUE,
	FALSE,

	//End
	RETURN,
};
