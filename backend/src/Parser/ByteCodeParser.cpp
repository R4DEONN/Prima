#include <sstream>
#include "ByteCodeParser.h"

#include <unordered_map>

#include "../Value/ValueType.h"

const std::unordered_map<std::string, ValueType> TypeMap = {
	{"number", ValueType::NUMBER},
	{"string", ValueType::STRING},
};

ParsingData ByteCodeParser::createFromFile(const std::string &filename)
{
	try
	{
		processFile(filename);
		return {_chunk, _stringPool};
	}
	catch (const std::exception &e)
	{
		throw std::runtime_error(std::string("Chunk creator error: ") + e.what());
	}
}

void ByteCodeParser::_parseCodeString(const std::string &codeString)
{
	std::stringstream str(codeString);
	int line;
	str >> line;
	_chunk.lines.push_back(line);
	std::string token;
	str >> token;
	OpCode opCode = getOpCodeFromString(token);
	_chunk.code.push_back(static_cast<uint8_t>(opCode));

	if (getCountCommandBytes(opCode) == 2)
	{
		std::string argToken;
		if (!(str >> argToken))
			throw std::runtime_error("Expected argument after opcode: " + token);

		_chunk.code.push_back(std::stoi(argToken));
	}

	if (getCountCommandBytes(opCode) == 3)
	{
		std::string argToken;
		if (!(str >> argToken))
			throw std::runtime_error("Expected argument after opcode: " + token);

		uint16_t arg = static_cast<uint16_t>(std::stoi(argToken));
		_chunk.code.push_back(static_cast<uint8_t>((arg >> 8) & 0xFF));
		_chunk.code.push_back(static_cast<uint8_t>(arg & 0xFF));
	}
}

void ByteCodeParser::_parseConstantString(const std::string &codeString)
{
	std::stringstream strStream(codeString);
	std::string type;
	strStream >> type;

	switch (TypeMap.find(type)->second)
	{
	case ValueType::NUMBER:
	{
		double number;
		strStream >> number;
		_chunk.constants.emplace_back(number);
		break;
	}

	case ValueType::STRING:
	{
		std::string value;
		std::getline(strStream, value, '"');
		value.clear();
		std::getline(strStream, value, '"');
		if (strStream.fail())
		{
			throw std::runtime_error("Invalid string constant format");
		}
		_chunk.constants.emplace_back(_stringPool.intern(value));
		break;
	}

	default:
		throw std::invalid_argument("Invalid value type");
	}
}

void ByteCodeParser::_processCodeDirective(const std::string& codeDirective)
{
	std::stringstream stringStream(codeDirective);
	std::string directive;
	int localCount;
	stringStream >> directive >> localCount;
	if (localCount != 0)
	{

	}
}
