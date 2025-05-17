#pragma once
#include <algorithm>
#include <fstream>
#include <vector>
#include <string>
#include <unordered_map>
#include <sstream>

#include "AbstractByteCodeProcessor.h"
#include "Constants.h"

class Preprocessor : AbstractByteCodeProcessor
{
public:
	void preprocessFile(const std::string &inputFileName, const std::string &outputFileName)
	{
		try
		{
			processFile(inputFileName);
			std::vector<std::string> output = _generateByteCode();
			_writeLinesToFile(outputFileName, output);
		}
		catch (const std::exception& e)
		{
			throw std::runtime_error(std::string("Preprocessor error: ") + e.what());
		}
	}

private:
	std::vector<std::string> _newConstantLines;
	std::vector<std::string> _newCodeLines;
	int _currentAddress = 0;
	std::unordered_map<std::string, int> _labels;

	void _processCodeDirective(const std::string &codeDirective) override
	{
		_newCodeLines.push_back(codeDirective);
	}

	void _parseConstantString(const std::string &codeString) override
	{
		_newConstantLines.push_back(codeString);
	}

	void _parseCodeString(const std::string &codeString) override
	{
		if (endsWithLabel(codeString))
		{
			std::string labelName = getLabelName(codeString);
			_labels[labelName] = _currentAddress;
		}
		else
		{
			_newCodeLines.push_back(codeString);
			if (isHeader(codeString))
			{
				return;
			}
			std::istringstream iss(codeString);
			std::string linePos, opcodeStr;
			iss >> linePos >> opcodeStr;

			try
			{
				std::stoi(linePos);
			}
			catch (...)
			{
				throw std::invalid_argument("Expected line position, but came: " + linePos);
			}

			_currentAddress += getCountCommandBytes(getOpCodeFromString(opcodeStr));
		}
	}

	static void _writeLinesToFile(const std::string &filename, const std::vector<std::string> &lines)
	{
		std::ofstream file(filename, std::ios::trunc);
		if (!file.is_open())
		{
			throw std::runtime_error("Could not write to file: " + filename);
		}

		for (const auto &line: lines)
		{
			file << line << std::endl;
		}
	}

	std::vector<std::string> _generateByteCode()
	{
		std::vector<std::string> output;

		if (!_newConstantLines.empty())
		{
			output.push_back(CONSTANT_STATE_STRING);
			std::ranges::for_each(_newConstantLines, [&](auto &line) {output.push_back(line);});
		}

		if (!_newCodeLines.empty())
		{
			std::ranges::for_each(_newCodeLines, [&](auto &line)
			{
				if (includesJump(line))
				{
					output.push_back(_generateJmp(line));
				}
				else
				{
					output.push_back(line);
				}
			});
		}

		return output;
	}

	std::string _generateJmp(const std::string &line)
	{
		std::istringstream iss(line);
		std::string linePos, opcode, label;
		iss >> linePos >> opcode >> label;

		if (_labels.find(label) != _labels.end())
		{
			int offset = _labels[label];
			return linePos + " " + opcode + " " + std::to_string(offset);
		}

		throw std::runtime_error("Undefined label: " + label);
	}

	bool endsWithLabel(const std::string &line)
	{
		return line.find(':') != std::string::npos;
	}

	std::string getLabelName(const std::string &line)
	{
		size_t pos = line.find(':');
		std::string name = line.substr(0, pos);
		return name;
	}

	bool isHeader(const std::string &line)
	{
		return includes(line, CONSTANT_STATE_STRING) || includes(line, CODE_STATE_STRING);
	}

	bool includesJump(const std::string &line)
	{
		return includes(line, "jmp");
	}

	bool includes(const std::string &str, const std::string &substring)
	{
		return str.find(substring) != std::string::npos;
	}
};
