#pragma once

#include <variant>
#include <string>
#include <iostream>
#include <memory>

using StringPtr = std::shared_ptr<std::string>;

using Value = std::variant<int, double, bool, StringPtr>;

std::ostream& operator<<(std::ostream& output, const Value& value);

bool toBool(const Value& value);

Value operator-(const Value& value);
Value operator-(const Value& lhs, const Value& rhs);
Value operator+(const Value& lhs, const Value& rhs);
Value operator*(const Value& lhs, const Value& rhs);
Value operator/(const Value& lhs, const Value& rhs);

bool operator==(const Value& lhs, const Value& rhs);
bool operator!=(const Value& lhs, const Value& rhs);
bool operator<(const Value& lhs, const Value& rhs);
bool operator>(const Value& lhs, const Value& rhs);
bool operator<=(const Value& lhs, const Value& rhs);
bool operator>=(const Value& lhs, const Value& rhs);