cmake_minimum_required(VERSION 3.22)
project(PVM)

set(CMAKE_CXX_STANDARD 23)
set(EXECUTABLE_OUTPUT_PATH "${CMAKE_CURRENT_SOURCE_DIR}/bin")
set(DEBUG_TRACE_EXECUTION true)

add_executable(${PROJECT_NAME}
        src/main.cpp
        src/Common/Chunk.h
        src/Common/OpCode.h
        src/Common/Value.h
        src/Prelude/Prelude.h
        src/Common/Value.cpp
)

find_package(Catch2)

if(Catch2_FOUND)
    add_executable(test
            test/ChunkTest.cpp
            src/Common/Chunk.h
            src/Common/OpCode.h
            src/Common/Value.h
            src/Prelude/Prelude.h
            src/Common/Value.cpp
    )

    target_link_libraries(test PRIVATE Catch2::Catch2WithMain)
endif()