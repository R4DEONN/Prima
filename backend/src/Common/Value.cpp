#include "Value.h"

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
			throw std::invalid_argument("Invalid type");
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
			return std::monostate{};
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
				return std::monostate{};
			}
		}
		else
		{
			if (b == 0)
			{
				return std::monostate{};
			}
		}

		return a / b;
	});
}
