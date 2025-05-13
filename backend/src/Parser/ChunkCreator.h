#pragma once

#include <string>
#include "../Common/Chunk.h"
#include "AbstractByteCodeProcessor.h"

class ChunkCreator : AbstractByteCodeProcessor
{
public:
	Chunk createFromFile(const std::string& filename);
private:
	void _parseConstantString(const std::string &codeString) override;

	void _parseCodeString(const std::string& codeString) override;

	Chunk _chunk;
};
