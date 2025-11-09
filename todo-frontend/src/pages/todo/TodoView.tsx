import { useEffect, useState } from 'react';
import TodoForm from '../../components/TodoForm';
import type { Todo, TodoFormData, TodoPatchData } from '../../models/types';
import TodoItem from '../../components/TodoItem';
import type { TodoControllerInterface } from './TodoControllerInterface';

interface TodoViewProps {
  controller: TodoControllerInterface;
}

export default function TodoView({ controller }: TodoViewProps) {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Liste laden
  async function refresh() {
    try { 
      const data = await controller.getListTodos(); 
      setTodos(data);
    } catch (error) {
      alert(`Fehler beim Laden der Aufgaben: ${error}`);
    }
  }

  async function handleCreate(todoData: TodoFormData) {
    let newTodo: Todo;
    try {
      newTodo = await controller.createTodo(todoData);
    } catch (error) {
      alert(`${error}`);
      return;
    }
    alert('Aufgabe gespeichert!');
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  }

  async function handleUpdate(id: number, data: TodoPatchData) {
    try{
      await controller.updateTodo(id, data);
    }
    catch(error){
      alert(`${error}`);
      return;
    }

    setTodos(prevTodos => prevTodos.map( todo =>
      todo.id === id
      ? { ...todo, ...data, updated_at: new Date().toISOString() }
      : todo
    ));

    await refresh();
  };

  async function handleDelete(id: number) {
    try{
      await controller.deleteTodo(id);
    }
    catch(error){
      alert(`${error}`);
      return;
    }
    
    setTodos(prevTodos => prevTodos.filter(t => t.id !== id));
  }
  

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