#include "Value.h"

std::ostream& operator<<(std::ostream& output, const Value& value)
{
	if (std::holds_alternative<int>(value))
	{
		output << std::get<int>(value);
	}
	else if (std::holds_alternative<double>(value))
	{
		output << std::get<double>(value);
	}
	else if (std::holds_alternative<bool>(value))
	{
		output << (std::get<bool>(value) ? "true" : "false");
	}
	else if (std::holds_alternative<std::string>(value))
	{
		output << "\"" << std::get<std::string>(value) << "\"";
	}
	else
	{
		output << "null";
	}
	return output;
}