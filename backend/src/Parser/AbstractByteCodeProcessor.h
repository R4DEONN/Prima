#pragma once
#include <string>
#include <fstream>

#include "Constants.h"

enum class State
{
	CONST,
	CODE,
};


class AbstractByteCodeProcessor
{
public:
	virtual ~AbstractByteCodeProcessor() = default;

protected:
	void processFile(const std::string& filename)
	{
		std::ifstream file(filename);

		if (!file.is_open())
		{
			throw std::runtime_error("Cannot open file: " + filename);
		}

		std::string line;
		while (std::getline(file, line))
		{
			line = _trim(line);
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
				_processCodeDirective(line);
				continue;
			}

			switch (_state)
			{
			case State::CONST:
				_parseConstantString(line);
				break;
			case State::CODE:
				_parseCodeString(line);
				break;
			}
		}
	}
	virtual void _processCodeDirective(const std::string& codeDirective) = 0;
	virtual void _parseCodeString(const std::string& codeString) = 0;
	virtual void _parseConstantString(const std::string& codeString) = 0;
private:
	State _state = State::CONST;

	static std::string _trim(const std::string &s)
	{
		auto start = s.begin();
		while (start != s.end() && std::isspace(*start))
		{
			++start;
		}

		auto end = s.end();
		do
		{
			--end;
		}
		while (end != start && std::isspace(*end));

		return {start, end + 1};
	}
};