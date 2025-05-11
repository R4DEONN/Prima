#!/bin/bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
BACKEND_DIR="$SCRIPT_DIR/backend"
BACKEND_BIN_DIR="$BACKEND_DIR/bin"
BYTECODE_FILE_NAME="before.prmbc"
PVM_EXECUTABLE_NAME="PVM"
SOURCE_BYTECODE_PATH="$FRONTEND_DIR/$BYTECODE_FILE_NAME"
DEST_BYTECODE_PATH="$BACKEND_BIN_DIR/$BYTECODE_FILE_NAME"
BUILD_DIR="$BACKEND_DIR/build"

mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"
cmake .. > /dev/null 2>&1
make > /dev/null 2>&1
cd ../..


if [ ! -d "$FRONTEND_DIR" ]; then
    echo "Error: directory $FRONTEND_DIR not found"
    exit 1
fi
cd "$FRONTEND_DIR"

npm run start > /dev/null 2>&1


cp "$SOURCE_BYTECODE_PATH" "$DEST_BYTECODE_PATH"

PVM_PATH="$BACKEND_BIN_DIR/$PVM_EXECUTABLE_NAME"

"$PVM_PATH"
PVM_EXIT_CODE=$?

exit $PVM_EXIT_CODE