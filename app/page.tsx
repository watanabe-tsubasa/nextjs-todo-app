'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X } from 'lucide-react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch('/api/todos')
      .then((res) => res.json())
      .then(setTodos);
  }, []);

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo }),
    });
    const createdTodo = await res.json();
    setTodos([...todos, createdTodo]);
    setNewTodo('');
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...todo, completed }),
    });
    const updatedTodo = await res.json();
    setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
  };

  const handleDeleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Todo App</h1>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add a new task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <Button onClick={handleAddTodo}>Add Task</Button>
      </div>

      <div className="space-y-2">
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center gap-2 p-2 border rounded-md">
            <Checkbox
              id={`task-${todo.id}`}
              checked={todo.completed}
              onCheckedChange={(checked) => handleToggleTodo(todo.id, !!checked)}
            />
            <Label htmlFor={`task-${todo.id}`} className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </Label>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteTodo(todo.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
