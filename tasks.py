import os
import sys
import shutil
from invoke import task, Context, Result

PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")
BACKEND_BUILD_OUTPUT_DIR = os.path.join(BACKEND_DIR, "bin")
PVM_EXECUTABLE_NAME = "PVM.exe" if sys.platform == "win32" else "PVM"
PVM_EXECUTABLE_PATH = os.path.join(BACKEND_BUILD_OUTPUT_DIR, PVM_EXECUTABLE_NAME)
FRONTEND_GENERATED_BYTECODE_FILE = os.path.join(FRONTEND_DIR, "before.prmbc")
BACKEND_EXPECTED_BYTECODE_FILE = os.path.join(BACKEND_BUILD_OUTPUT_DIR, "before.prmbc")
DEFAULT_INPUT_PATH = os.path.join(FRONTEND_DIR, "input.txt")

def _run_command(c: Context, command: str, workdir: str, error_message_prefix: str, hide_command_output=False) -> Result:
    use_pty = sys.platform != "win32"
    run_options = {'warn': True, 'hide': hide_command_output, 'pty': use_pty}

    if sys.platform == "win32" and command.strip().lower().startswith("npm"):
        run_options['shell'] = True

    with c.cd(workdir):
        result = c.run(command, **run_options)

    if result.failed:
        print(f"{error_message_prefix}: Команда завершилась с ошибкой (код {result.return_code}).")
        print(f"Команда: {result.command}")
        if result.stdout:
            print(f"STDOUT:\n{result.stdout}")
        if result.stderr:
            print(f"STDERR:\n{result.stderr}")
        raise SystemExit(result.return_code)

    return result

@task
def build_backend(c, verbose=False):
    os.makedirs(BACKEND_BUILD_OUTPUT_DIR, exist_ok=True)

    cmake_configure_parts = ["cmake"]
    if sys.platform == "win32":
        cmake_configure_parts.extend(["-G", "MinGW Makefiles"])
    cmake_configure_parts.append(".")

    cmake_configure_command = " ".join(cmake_configure_parts)

    _run_command(c, cmake_configure_command, BACKEND_DIR, "Ошибка конфигурации CMake", hide_command_output=not verbose)
    _run_command(c, "cmake --build .", BACKEND_DIR, "Ошибка сборки CMake", hide_command_output=not verbose)

    if not os.path.exists(PVM_EXECUTABLE_PATH):
        print(f"ОШИБКА: Исполняемый файл бэкенда {PVM_EXECUTABLE_PATH} не найден после сборки.")
        return False

    return True

@task
def run_frontend(c, input_file, verbose=False):
    absolute_input_file = os.path.abspath(input_file)
    if not os.path.exists(absolute_input_file):
        print(f"ОШИБКА: Входной файл для фронтенда '{absolute_input_file}' не найден.")
        return False

    node_modules_path = os.path.join(FRONTEND_DIR, "node_modules")
    if not os.path.exists(node_modules_path):
        if verbose:
            print(f"Папка 'node_modules' не найдена в {FRONTEND_DIR}. Выполняется 'npm ci'...")
        _run_command(c, "npm ci", FRONTEND_DIR, "Ошибка при выполнении 'npm ci'", hide_command_output=not verbose)

    _run_command(c, f"npm run start \"{absolute_input_file}\"", FRONTEND_DIR, "Ошибка при запуске npm скрипта фронтенда", hide_command_output=not verbose)

    if not os.path.exists(FRONTEND_GENERATED_BYTECODE_FILE):
        print(f"ОШИБКА: Фронтенд не создал ожидаемый файл {FRONTEND_GENERATED_BYTECODE_FILE}")
        return False

    return True

@task
def copy_bytecode(c):
    if not os.path.exists(FRONTEND_GENERATED_BYTECODE_FILE):
        print(f"ОШИБКА: Исходный файл байт-кода {FRONTEND_GENERATED_BYTECODE_FILE} не найден.")
        return False

    os.makedirs(BACKEND_BUILD_OUTPUT_DIR, exist_ok=True)
    try:
        shutil.copy2(FRONTEND_GENERATED_BYTECODE_FILE, BACKEND_EXPECTED_BYTECODE_FILE)
        os.remove(FRONTEND_GENERATED_BYTECODE_FILE)
        return True
    except Exception as e:
        print(f"ОШИБКА: Не удалось скопировать файл байт-кода: {e}")
        return False

@task
def run_pvm(c):
    if not os.path.exists(PVM_EXECUTABLE_PATH):
        print(f"ОШИБКА: Исполняемый файл PVM {PVM_EXECUTABLE_PATH} не найден.")
        return False
    if not os.path.exists(BACKEND_EXPECTED_BYTECODE_FILE):
        print(f"ОШИБКА: Файл байт-кода {BACKEND_EXPECTED_BYTECODE_FILE} не найден в директории PVM ({BACKEND_BUILD_OUTPUT_DIR}).")
        return False

    _run_command(c, PVM_EXECUTABLE_PATH, BACKEND_BUILD_OUTPUT_DIR, "Ошибка при запуске PVM", hide_command_output=False)
    return True

@task(default=True, help={
    "input_file": f"Путь к входному файлу для компилятора. По умолчанию: {DEFAULT_INPUT_PATH}",
    "verbose": "Показывать детальные логи сборки бэкенда и запуска фронтенда."
})
def run(c, input_file=DEFAULT_INPUT_PATH, verbose=False):
    if not build_backend(c, verbose=verbose):
        sys.exit(1)

    if not run_frontend(c, input_file=input_file, verbose=verbose):
        sys.exit(1)

    if not copy_bytecode(c):
        sys.exit(1)

    if not run_pvm(c):
        sys.exit(1)
