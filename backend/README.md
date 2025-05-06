# Виртуальная машина для языка Prima

Интерпретатор - Prelude

JIT-компилятор - Prism

## Список команд
| Код                     | Обозначение | Название  | Стек         | Действие |
|-------------------------|-------------|-----------|--------------|----------|
| c>=0                    | Нет         | Константа | → с          |          |
| -1                      | STOP        | Остановка | Не меняется  |          |
| Арифмитические операции |
| -2                      | ADD         | Сложение  | x, y → x + y |          |

## Архитектура виртуальной машины
```mermaid
classDiagram
    class Value {
        <<Enumeration>>
        NULL
        BOOL
        INT
        FLOAT
        STRING
        FUNCTION
    }

    class OpCode {
        <<Enumeration>>
        PUSH
        POP
        ADD
        SUB
        MUL
        DIV
        CALL
        RETURN
        CONSTANT
    }

    class Instruction {
        opCode: OpCode
        line: usize
    }
    
    class Chunk {
        code: vector~OpCode~
        constants: vector~Value~
    }

    Chunk *-- OpCode
    Chunk *-- Value
```