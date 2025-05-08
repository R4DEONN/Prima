#include "iostream"
#include "Common/Chunk.h"
#include "Common/OpCode.h"
#include "Prelude/Prelude.h"

int main()
{
	Chunk chunk;
	auto constant = chunk.writeConstant(1.2);

	chunk.write(OpCode::CONSTANT, 1);
	chunk.write(constant, 1);

	constant = chunk.writeConstant(3.4);
	chunk.write(OpCode::CONSTANT, 1);
	chunk.write(constant, 1);

	chunk.write(OpCode::ADD, 1);

	constant = chunk.writeConstant(5.6);
	chunk.write(OpCode::CONSTANT, 1);
	chunk.write(constant, 1);

	chunk.write(OpCode::DIVIDE, 1);
	chunk.write(OpCode::NEGATE, 1);

	chunk.write(OpCode::RETURN, 1);

	Prelude prelude(chunk);
	switch (auto errorCode = prelude.run())
	{
	case PreludeErrorCode::PRELUDE_OK:
		std::cout << "No errors" << std::endl;
		return static_cast<int>(errorCode);
	// ReSharper disable once CppDFAUnreachableCode
	case PreludeErrorCode::PRELUDE_COMPILE_ERROR:
		std::cout << "Compilation error" << std::endl;
		return static_cast<int>(errorCode);
	case PreludeErrorCode::PRELUDE_RUNTIME_ERROR:
		std::cout << "Runtime error" << std::endl;
		return static_cast<int>(errorCode);
	}
}