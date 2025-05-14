#pragma once

#include <string>
#include "../Common/Chunk.h"
#include "AbstractByteCodeProcessor.h"
#include "../Value/StringPool.h"

struct ParsingData
{
	Chunk chunk;
	StringPool stringPool;
};

class ByteCodeParser : AbstractByteCodeProcessor
{
public:
	ParsingData createFromFile(const std::string& filename);
private:
	void _parseConstantString(const std::string &codeString) override;

	void _parseCodeString(const std::string& codeString) override;

	Chunk _chunk;
	StringPool _stringPool;
};
