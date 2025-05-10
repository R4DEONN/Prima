#include <fstream>
#include <sstream>
#include "ChunkCreator.h"

#include <unordered_map>

#include "ValueType.h"

const std::string CONSTANT_STATE_STRING = ".constants";
const std::string CODE_STATE_STRING = ".code";

const std::unordered_map<std::string, OpCode> InstructionMap = {
	{"const", OpCode::CONSTANT},
	{"add", OpCode::ADD},
	{"sub", OpCode::SUBTRACT},
	{"mul", OpCode::MULTIPLY},
	{"div", OpCode::DIVIDE},
	{"neg", OpCode::NEGATE},
	{"ret", OpCode::RETURN},
	{"true", OpCode::TRUE},
	{"false", OpCode::FALSE},
	{"ceq", OpCode::EQUAL},
	{"cgt", OpCode::GREATER},
	{"clt", OpCode::LESS},
	{"not", OpCode::NOT},
};

const std::unordered_map<std::string, ValueType> TypeMap = {
	{"number", ValueType::NUMBER},
};

Chunk ChunkCreator::createFromFile(const std::string &filename)
{
	_chunk = Chunk();
	std::ifstream file(filename);

	if (!file.is_open())
	{
		throw std::runtime_error("Cannot open file: " + filename);
	}

	std::string line;
	while (std::getline(file, line))
	{
		if (line.empty())
		{
			continue;
		}
		if (line.find(CONSTANT_STATE_STRING) != std::string::npos)
		{
			_state = State::CONST;
			continue;
		}
		if (line.find(CODE_STATE_STRING) != std::string::npos)
		{
			_state = State::CODE;
			continue;
		}

		switch (_state)
		{
		case State::CONST:
			parseConstantString(line);
			break;
		case State::CODE:
			parseCodeString(line);
			break;
		}
	}

	return _chunk;
}

void ChunkCreator::parseCodeString(const std::string &codeString)
{
	std::stringstream str(codeString);
	int line;
	str >> line;
	_chunk.lines.push_back(line);
	std::string token;
	str >> token;
	_chunk.code.push_back(static_cast<uint8_t>(InstructionMap.find(token)->second));

	while (str >> token)
	{
		_chunk.code.push_back(std::stoi(token));
	}
}

void ChunkCreator::parseConstantString(const std::string &codeString)
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
	}
}
