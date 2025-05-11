#pragma once

#include <string>
#include "Chunk.h"

enum class State
{
	CONST,
	CODE,
};

class ChunkCreator
{
public:
	Chunk createFromFile(const std::string& filename);
private:
	void parseCodeString(const std::string& codeString);
	void parseConstantString(const std::string& codeString);

	State _state = State::CONST;
	Chunk _chunk;
};
