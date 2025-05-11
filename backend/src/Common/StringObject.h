#pragma once
#include "Object.h"

class StringObject : public Object
{
private:
	int length;
	char* data;
};
