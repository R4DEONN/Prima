#pragma once
#include <memory>
#include <string>
#include <unordered_map>

#include "Value.h"

class StringPool
{
public:
	StringPtr intern(std::string str)
	{
		str = _unescapeString(str);
		auto it = _stringPool.find(str);
		if (it != _stringPool.end())
		{
			return it->second;
		}

		auto stringPointer = std::make_shared<std::string>(str);
		_stringPool[str] = stringPointer;
		return stringPointer;
	}

private:
	static std::string _unescapeString(const std::string &input)
	{
		std::string result;
		for (size_t i = 0; i < input.size(); ++i)
		{
			if (input[i] == '\\' && i + 1 < input.size())
			{
				switch (input[i + 1])
				{
				case 'n':
					result += '\n';
					i++;
					break;
				case 't':
					result += '\t';
					i++;
					break;
				case '"':
					result += '"';
					i++;
					break;
				case '\\':
					result += '\\';
					i++;
					break;
				default:
					result += input[i + 1];
					i++;
					break;
				}
			}
			else
			{
				result += input[i];
			}
		}
		return result;
	}

	std::unordered_map<std::string, StringPtr> _stringPool;
};
