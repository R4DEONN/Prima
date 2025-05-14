#include "iostream"
#include "Common/Chunk.h"
#include "Parser/ByteCodeParser.h"
#include "Parser/Preprocessor.h"
#include "Prelude/Prelude.h"

int main()
{
	try
	{
		auto preprocessor = Preprocessor();
		preprocessor.preprocessFile("before.prmbc", "after.prmbc");
		auto chunkCreator = ByteCodeParser();
		auto [chunk, stringPool] = chunkCreator.createFromFile("after.prmbc");

		Prelude prelude(chunk, stringPool);

		prelude.run();
		std::cout << "No errors" << std::endl;
	}
	catch (const std::exception& e)
	{
		std::cout << e.what() << std::endl;
		return 1;
	}
}