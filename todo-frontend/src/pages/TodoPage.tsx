import { useEffect, useState } from 'react';
import TodoForm from '../components/TodoForm';
import type { Todo } from '../models/types';
import { createTodo, deleteTodo, listTodos, updateTodo } from '../services/todoService';
import TodoItem from '../components/TodoItem';


export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Liste laden
  async function refresh() {
    try { 
      setLoading(true); 
      setError(null);
      const data = await listTodos(); setTodos(data);
    } catch (e:any) {
       setError(e.message ?? "Fehler beim Laden");
      }
    finally { setLoading(false); }
  }

  async function handleCreate(todoData: Omit<Todo, 'id' | 'status_display' | 'created_at' | 'updated_at'>) {
    let newTodo: Todo;
    try {
      newTodo = await createTodo(todoData);
    } catch (error) {
      alert(`${error}`);
      return;
    }
    alert('Aufgabe gespeichert!');
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  }

  async function handleUpdate(id: number, data: Partial<Todo>) {
    await updateTodo(id, data);
    setTodos(prev => prev.map(t => t.id === id ? 
      { ...t, 
        ...data, 
        updated_at: new Date().toISOString() } : t));
    await refresh();
  };
  
  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => { refresh(); }, []);
  

  return (
    <div className="container mx-auto bg-gray-100 p-10 mt-10 rounded-2xl " >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

        {/* To-Do Liste */}
        <aside className="rounded-2xl bg-white p-4 shadow-lg h-auto md:h-[80vh] md:flex md:flex-col">
          <h2 className="mb-2">Deine Aufgaben</h2>

          {/* für leere Liste */}
          <div className="mt-2 md:flex-1 md:overflow-auto custom-scrollbar">
            <TodoItem todos={todos} onUpdate={handleUpdate} onDelete={handleDelete} />
            {todos.length === 0 && (
              <div className="text-lg text-gray-500">Noch nichts eingetragen.</div>
            )}
          </div>
        </aside>

        {/* Aufgaben erstellen */}
        <main className="rounded-2xl shadow-lg bg-white p-6">
          <TodoForm onCreate={handleCreate} />
        </main>
      </div>
    </div>
  );
}