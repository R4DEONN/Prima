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

	//Push
	CONSTANT,
	TRUE,
	FALSE,

	//JMP
	JMP,
	JMP_IF_FALSE,

	//Debug
	PRINT,

	//End
	RETURN,
};
