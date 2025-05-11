@echo off
setlocal enabledelayedexpansion

set EXIT_CODE=0

for %%I in ("%~dp0.") do set "SCRIPT_DIR=%%~fI"

set "FRONTEND_DIR=%SCRIPT_DIR%\frontend"
set "BACKEND_DIR=%SCRIPT_DIR%\backend"
set "BACKEND_BIN_DIR=%BACKEND_DIR%\bin"
set "BYTECODE_FILE_NAME=before.prmbc"
set "PVM_EXECUTABLE_NAME=PVM.exe"
set "SOURCE_BYTECODE_PATH=%FRONTEND_DIR%\%BYTECODE_FILE_NAME%"
set "DEST_BYTECODE_PATH=%BACKEND_BIN_DIR%\%BYTECODE_FILE_NAME%"
set "BUILD_DIR=%BACKEND_DIR%\build"

mkdir "%BUILD_DIR%" >nul 2>&1
pushd "%BUILD_DIR%"
cmake .. >nul 2>&1
if %errorlevel% neq 0 (
    echo CMake failed with error %errorlevel%
    set EXIT_CODE=1
    goto :exit
)

make >nul 2>&1
if %errorlevel% neq 0 (
    echo Make failed with error %errorlevel%
    set EXIT_CODE=1
    goto :exit
)
popd

if not exist "%FRONTEND_DIR%" (
    echo Error: directory %FRONTEND_DIR% not found
    set EXIT_CODE=1
    goto :exit
)

pushd "%FRONTEND_DIR%"
npm run start >nul 2>&1
if %errorlevel% neq 0 (
    echo npm run start failed with error %errorlevel%
    set EXIT_CODE=1
    goto :exit
)

copy "%SOURCE_BYTECODE_PATH%" "%DEST_BYTECODE_PATH%" >nul 2>&1
if %errorlevel% neq 0 (
    echo Failed to copy bytecode file
    set EXIT_CODE=1
    goto :exit
)

set "PVM_PATH=%BACKEND_BIN_DIR%\%PVM_EXECUTABLE_NAME%"
"%PVM_PATH%"
set EXIT_CODE=%errorlevel%

:exit
popd
exit /b %EXIT_CODE%