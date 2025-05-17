#pragma once
#include <vector>
#include "../Value/Value.h"
#include "../Common/Chunk.h"

struct StackFrame
{
	Chunk chunk;
	size_t ip = 0;
	std::vector<Value> locals;

	explicit StackFrame(Chunk chunk)
		: chunk(std::move(chunk)),
		  locals(chunk.localCount)
	{}
};
