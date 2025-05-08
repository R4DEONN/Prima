#pragma once

enum class OpCode : uint8_t
{
	//Unary
	NEGATE,

	//Binary
	ADD,
	SUBTRACT,
	MULTIPLY,
	DIVIDE,

	//Declaration
	CONSTANT,

	//End
	RETURN,
};
