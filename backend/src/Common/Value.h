#pragma once

#include <variant>
#include <string>
#include <iostream>

using Value = std::variant<std::monostate, int, double, bool, std::string>;

std::ostream& operator<<(std::ostream& output, const Value& value);