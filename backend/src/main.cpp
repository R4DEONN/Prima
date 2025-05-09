#include "iostream"
#include "Common/Chunk.h"
#include "Common/OpCode.h"
#include "Prelude/Prelude.h"

int main()
{
	Chunk chunk;

	auto constant = chunk.writeConstant(5);
	chunk.write(OpCode::CONSTANT, 1);
	chunk.write(constant, 1);

	constant = chunk.writeConstant(4);
	chunk.write(OpCode::CONSTANT, 1);
	chunk.write(constant, 1);

	chunk.write(OpCode::SUBTRACT, 1);

	constant = chunk.writeConstant(3);
	chunk.write(OpCode::CONSTANT, 1);
	chunk.write(constant, 1);

	constant = chunk.writeConstant(2);
	chunk.write(OpCode::CONSTANT, 1);
	chunk.write(constant, 1);

	chunk.write(OpCode::MULTIPLY, 1);

	chunk.write(OpCode::GREATER, 1);

	constant = chunk.writeConstant(std::monostate{});
	chunk.write(OpCode::CONSTANT, 1);
	chunk.write(constant, 1);
	chunk.write(OpCode::NOT, 1);

	chunk.write(OpCode::EQUAL, 1);

	chunk.write(OpCode::NOT, 1);

	chunk.write(OpCode::RETURN, 1);

	Prelude prelude(chunk);

	try
	{
		prelude.run();
		std::cout << "No errors" << std::endl;
	}
	catch (const std::exception& e)
	{
		std::cout << e.what() << std::endl;
		return 1;
	}
}