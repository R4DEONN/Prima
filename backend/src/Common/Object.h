#pragma once

#include "ObjectType.h"

class Object
{
public:
	explicit Object(ObjectType type)
		: _type(type)
	{}

	[[nodiscard]] ObjectType getType() const
	{
		return _type;
	}
private:
	ObjectType _type;
};
