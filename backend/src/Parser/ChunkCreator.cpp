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
	OpCode opCode = getOpCodeFromString(token);
	_chunk.code.push_back(static_cast<uint8_t>(opCode));

	if (opCode == OpCode::CONSTANT || opCode == OpCode::JMP || opCode == OpCode::JMP_IF_FALSE)
	{
		std::string argToken;
		if (!(str >> argToken))
			throw std::runtime_error("Expected argument after opcode: " + token);

		uint16_t arg = static_cast<uint16_t>(std::stoi(argToken));
		_chunk.code.push_back(static_cast<uint8_t>((arg >> 8) & 0xFF));
		_chunk.code.push_back(static_cast<uint8_t>(arg & 0xFF));
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
