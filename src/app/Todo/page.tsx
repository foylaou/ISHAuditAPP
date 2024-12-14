"use client";
import React, { useState, useEffect } from "react";
import { SquarePlus, SquareX } from "lucide-react";

export interface Todo {
  id: string;
  text: string;
  DateTime: string;
}

export default function TodoList() {
  const [todolist, setTodolist] = useState<Todo[]>([]); // 代辦事項
  const [inputText, setInputText] = useState<string>(""); // 控制輸入框內容
  const [error, setError] = useState<string>(""); // 錯誤訊息

  // 初始化時從 localStorage 讀取資料

  //	•	JSON.stringify()：將物件/陣列轉換成 字串格式，方便存儲。
  // 	•	JSON.parse()：將存儲的 JSON 字串轉換回 物件/陣列，方便程式使用。
  useEffect(() => {
    const savedTodos = localStorage.getItem("todolist");
    if (savedTodos) {
      setTodolist(JSON.parse(savedTodos));
    }
  }, []);

  // 每當 todolist 更新時，將資料存入 localStorage
  useEffect(() => {
    localStorage.setItem("todolist", JSON.stringify(todolist));
  }, [todolist]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault(); // 防止預設行為

    // 驗證輸入框內容
    if (!inputText.trim()) {
      setError("請輸入待辦事項內容！");
      return;
    }

    setError("");
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText,
      DateTime: new Date().toLocaleString(),
    };

    setTodolist([...todolist, newTodo]);
    setInputText("");
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todolist.filter((todo) => todo.id !== id);
    setTodolist(updatedTodos);
  };

  return (
    <div className="p-32 items-center justify-center">
      <form onSubmit={addTodo}>
        <textarea
          className="textarea textarea-bordered w-full mb-4"
          placeholder="輸入待辦事項..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        ></textarea>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button className="btn btn-primary w-full mb-4" type="submit">
          <SquarePlus />
          加入
        </button>
      </form>

      <ul className="list-disc pl-4">
        {todolist.map((item) => (
          <li key={item.id} className="mb-2 flex justify-between items-center">
            <div>
              <div>序列：{item.id}</div>
              <div>待辦事項：{item.text}</div>
              <div>時間：{item.DateTime}</div>
            </div>
            <button
              className="btn btn-error"
              onClick={() => deleteTodo(item.id)}
            >
              <SquareX />
              刪除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
