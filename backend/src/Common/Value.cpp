#include "Value.h"

std::string getTypeName(const Value &value)
{
	return std::visit([](auto &&arg) -> std::string
	{
		using T = std::decay_t<decltype(arg)>;

		if constexpr (std::is_same_v<T, bool>)
		{
			return "bool";
		}
		else if constexpr (std::is_integral_v<T>)
		{
			return "number";
		}
		else if constexpr (std::is_floating_point_v<T>)
		{
			return "number";
		}
		else if constexpr (std::is_same_v<T, std::string>)
		{
			return "string";
		}
		else
		{
			throw std::runtime_error("Invalid type");
		}
	}, value);
}

bool toBool(const Value& value)
{
	return std::visit([](auto&& arg) -> bool
	{
		using T = std::decay_t<decltype(arg)>;

		if constexpr (std::is_same_v<T, bool>)
		{
			return arg;
		}
		else if constexpr (std::is_integral_v<T> || std::is_floating_point_v<T>)
		{
			return static_cast<bool>(arg);
		}
		else if constexpr (std::is_same_v<T, std::string>)
		{
			return !arg.empty();
		}
		else
		{
			throw std::runtime_error("Invalid value type");
		}
	}, value);
}

std::ostream &operator<<(std::ostream &output, const Value &value)
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

Value operator-(const Value &value)
{
	return std::visit([](auto &&arg) -> Value
	{
		using T = std::decay_t<decltype(arg)>;

		if constexpr (std::is_arithmetic_v<T>)
		{
			return -arg;
		}
		else
		{
			throw std::invalid_argument("Cannot negate value of type: " + getTypeName(arg));
		}
	}, value);
}

template<typename Op>
Value applyArithmeticOp(const Value &lhs, const Value &rhs, Op op)
{
	return std::visit([&op](auto &&l, auto &&r) -> Value
	{
		using L = std::decay_t<decltype(l)>;
		using R = std::decay_t<decltype(r)>;

		if constexpr (std::is_arithmetic_v<L> && std::is_arithmetic_v<R>)
		{
			return op(l, r);
		}
		else
		{
			throw std::invalid_argument("Cannot do this operation with: " + getTypeName(l) + " and " + getTypeName(r));
		}
	}, lhs, rhs);
}

Value operator-(const Value &lhs, const Value &rhs)
{
	return applyArithmeticOp(lhs, rhs, [](auto a, auto b) { return a - b; });
}

Value operator+(const Value &lhs, const Value &rhs)
{
	return applyArithmeticOp(lhs, rhs, [](auto a, auto b) { return a + b; });
}

Value operator*(const Value &lhs, const Value &rhs)
{
	return applyArithmeticOp(lhs, rhs, [](auto a, auto b) { return a * b; });
}

Value operator/(const Value &lhs, const Value &rhs)
{
	return applyArithmeticOp(lhs, rhs, [](auto a, auto b) -> Value
	{
		using T = decltype(a);

		if constexpr (std::is_floating_point_v<T>)
		{
			constexpr T epsilon = static_cast<T>(1e-9);
			if (std::abs(b) < epsilon)
			{
				throw std::runtime_error("Divide by zero");
			}
		}
		else
		{
			if (b == 0)
			{
				throw std::runtime_error("Divide by zero");
			}
		}

		return a / b;
	});
}

bool operator==(const Value& lhs, const Value& rhs)
{
	return std::visit([](const auto& l, const auto& r) -> bool
	{
		using L = std::decay_t<decltype(l)>;
		using R = std::decay_t<decltype(r)>;

		if constexpr (std::is_same_v<L, R>)
		{
			return l == r;
		}
		else
		{
			throw std::invalid_argument("Cannot compare: " + getTypeName(l) + " and " + getTypeName(r));
		}
	}, lhs, rhs);
}

bool operator!=(const Value& lhs, const Value& rhs)
{
	return !(lhs == rhs);
}

bool operator<(const Value& lhs, const Value& rhs)
{
	return std::visit([](const auto& l, const auto& r) -> bool
	{
		using L = std::decay_t<decltype(l)>;
		using R = std::decay_t<decltype(r)>;

		if constexpr (std::is_same_v<L, R>)
		{
			return l < r;
		}
		else
		{
			throw std::invalid_argument("Cannot compare: " + getTypeName(l) + " and " + getTypeName(r));
		}
	}, lhs, rhs);
}

bool operator>(const Value& lhs, const Value& rhs) { return rhs < lhs; }
bool operator<=(const Value& lhs, const Value& rhs) { return !(rhs < lhs); }
bool operator>=(const Value& lhs, const Value& rhs) { return !(lhs < rhs); }