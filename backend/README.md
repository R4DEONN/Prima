# Виртуальная машина языка Prima

Интерпретатор - Prelude

JIT-компилятор - Prisma

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
    class ValueType {
        <<Enumeration>>
        NULL
        BOOL
        DOUBLE
        STRING
        FUNCTION
    }
    
    class Value

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

    class Chunk {
        code: vector~OpCode~
        lines: vector~int~
        constants: vector~Value~
    }

    Chunk *-- OpCode
    Chunk *-- Value
```