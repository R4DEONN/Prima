# Виртуальная машина для языка Prima

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
        Null
        Bool(bool)
        Int(i64)
        Float(f64)
        String(Rc<String>)
        Function(Rc<Function>)
    }

    class OpCode {
        <<Enumeration>>
        Push
        Pop
        Add
        Sub
        Mul
        Div
        JumpIfFalse(usize)
        Jump(usize)
        Call(usize)
        Return
        LoadConstant(usize)
    }

    class Instruction {
        opCode: OpCode
        line: usize
    }
    
    class MemoryManager {
        allocate(&mut self, size: usize) Result<*mut u8, Error>
        deallocate(&mut self, ptr: *mut u8)
        collect_garbage(&mut self)
    }
```