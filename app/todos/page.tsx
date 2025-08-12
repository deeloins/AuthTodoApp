"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function TodosPage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [todos, setTodos] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchTodos();
  }, [token]);

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todo");
      setTodos(res.data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      await api.post("/todo", { title, isDone: false });
      setTitle("");
      fetchTodos();
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await api.delete(`/todo/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const toggleTodo = async (id: number, currentStatus: boolean) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;
      
      await api.put(`/todo/${id}`, {
        title: todo.title,
        isDone: !currentStatus
      });
      fetchTodos();
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const startEdit = (todo: any) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const saveEdit = async (id: number, isDone: boolean) => {
    if (!editTitle.trim()) return;
    
    try {
      await api.put(`/todo/${id}`, {
        title: editTitle,
        isDone: isDone
      });
      setEditingId(null);
      setEditTitle("");
      fetchTodos();
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
          YESLIST!
        </h1>
        <p className="text-gray-600 text-lg mt-2">Your productivity companion</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Todos</h2>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Add a new task..."
          className="border border-gray-300 p-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button 
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
        >
          Add Task
        </button>
      </form>

      {/* Todos List */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No todos yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-4 border rounded-lg transition-all ${
                todo.isDone 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:shadow-md'
              }`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.isDone}
                onChange={() => toggleTodo(todo.id, todo.isDone)}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />

              {/* Todo Content */}
              <div className="flex-1">
                {editingId === todo.id ? (
                  // Edit Mode
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(todo.id, todo.isDone)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // Display Mode
                  <span
                    className={`text-lg ${
                      todo.isDone 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.title}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              {editingId !== todo.id && !todo.isDone && (
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(todo)}
                    className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Show only delete for completed todos */}
              {editingId !== todo.id && todo.isDone && (
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {todos.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total: {todos.length} tasks</span>
            <span>Completed: {todos.filter(t => t.isDone).length}</span>
            <span>Remaining: {todos.filter(t => !t.isDone).length}</span>
          </div>
        </div>
      )}
    </div>
  );
}