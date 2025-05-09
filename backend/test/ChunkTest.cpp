#include "catch2/catch_test_macros.hpp"
#include "../src/Common/Chunk.h"

TEST_CASE("Chunk")
{
	auto chunk = Chunk();
	chunk.write(OpCode::RETURN, 1);

	REQUIRE(chunk.code[0] == static_cast<uint8_t>(OpCode::RETURN));
}
