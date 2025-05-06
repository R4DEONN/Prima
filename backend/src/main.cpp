#include "iostream"
#include "Common/Chunk.h"
#include "Prelude/Prelude.h"

int main()
{
	Chunk chunk;
	chunk.writeConstant(5, 1);
	chunk.write(OpCode::RETURN, 1);
	Prelude prelude(chunk);
	switch (auto errorCode = prelude.run())
	{
	case PreludeErrorCode::PRELUDE_OK:
		std::cout << "No errors" << std::endl;
		return static_cast<int>(errorCode);
	case PreludeErrorCode::PRELUDE_COMPILE_ERROR:
		std::cout << "Compilation error" << std::endl;
		return static_cast<int>(errorCode);
	case PreludeErrorCode::PRELUDE_RUNTIME_ERROR:
		std::cout << "Runtime error" << std::endl;
		return static_cast<int>(errorCode);
	}
	return EXIT_SUCCESS;
}