#include <fstream>
#include <sstream>
#include "ChunkCreator.h"

#include <unordered_map>

#include "../Common/ValueType.h"

const std::unordered_map<std::string, ValueType> TypeMap = {
	{"number", ValueType::NUMBER},
};

Chunk ChunkCreator::createFromFile(const std::string &filename)
{
	processFile(filename);
	return _chunk;
}

void ChunkCreator::_parseCodeString(const std::string &codeString)
{
	std::stringstream str(codeString);
	int line;
	str >> line;
	_chunk.lines.push_back(line);
	std::string token;
	str >> token;
	_chunk.code.push_back(static_cast<uint8_t>(getOpCodeFromString(token)));

	while (str >> token)
	{
		_chunk.code.push_back(std::stoi(token));
	}
}

void ChunkCreator::_parseConstantString(const std::string &codeString)
{
	std::stringstream str(codeString);
	std::string type;
	str >> type;
	ValueType valueType = TypeMap.find(type)->second;

	std::string value;
	str >> value;
	switch (valueType)
	{
	case ValueType::NUMBER:
		_chunk.constants.push_back(std::stod(value));
		break;
	default:
		throw std::invalid_argument("Invalid value type");
	}
}
