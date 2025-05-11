#include "iostream"
#include "Common/Chunk.h"
#include "Common/ChunkCreator.h"
#include "Prelude/Prelude.h"

int main()
{
	auto chunkCreator = ChunkCreator();
	Chunk chunk = chunkCreator.createFromFile("bytecode.prmbc");

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