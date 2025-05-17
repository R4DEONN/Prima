#pragma once
#include <vector>
#include "../Value/Value.h"
#include "../Common/Chunk.h"

struct StackFrame
{
	const Chunk *chunk;
	size_t ip = 0;
	std::vector<Value> locals;

	StackFrame(const Chunk *chunk, int localCount)
		: chunk(chunk),
		  locals(localCount)
	{
	}
};
