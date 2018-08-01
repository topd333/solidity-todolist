pragma solidity ^0.4.0;

contract TodoList {
  TodoItem[] public todoItems;

  struct TodoItem {
    bytes32 value;
    bool active;
  }

  function getTodoItems() constant returns (bytes32[], bool[]) {
    uint length = todoItems.length;

    bytes32[] memory values = new bytes32[](length);
    bool[] memory actives = new bool[](length);

    for (uint i = 0; i < length; i++) {
      values[i] = todoItems[i].value;
      actives[i] = todoItems[i].active;
    }

    return (values, actives);
  }

  function addTodoItem(bytes32 _value) returns (bool success) {// 0x72ba7d8e73fe8eb666ea66babc8116a41bfb10e2000000000000000000000000
    TodoItem memory todoItem;
    todoItem.value = _value;
    todoItem.active = false;

    todoItems.push(todoItem);
    return true;
  }

  function getTodoItem(uint index) constant returns (bytes32, bool) {
    if (index >= todoItems.length) return;

    return (todoItems[index].value, todoItems[index].active);
  }

  function updateTodoItem(uint index, bytes32 _value, bool active) returns (bool success) {
    if (index >= todoItems.length) return;
    TodoItem memory todoItem;

    todoItem.value = _value;
    todoItem.active = active;
    todoItems[index] = todoItem;

    return true;
  }

  function deleteTodoItem(uint index) returns (bool success) {
    if (index >= todoItems.length) return;

    for (uint i = index; i < todoItems.length - 1; i++) {
        todoItems[i] = todoItems[i+1];
    }

    delete todoItems[todoItems.length - 1];
    todoItems.length--;
    return true;
  }
}
