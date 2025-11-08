import type { Todo } from '../models/types';

const env = import.meta.env
const API_URL = env.VITE_API_BASE_URL

export async function listTodos(): Promise<Todo[]> {
    const res = await fetch(`${API_URL}/todos/`);
    
    await errorHandler(res);

    const data = await res.json();
    return data as Todo[];
}

export async function createTodo(todoData: Omit<Todo, 'id' | 'status_display' | 'created_at' | 'updated_at'>): Promise<Todo> {
    const res = await fetch(`${API_URL}/todos/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
    });

    await errorHandler(res);

    const data = await res.json();
    return data as Todo;
}

export async function updateTodo(id: number, data: Partial<Todo>): Promise<Todo> {
    const res = await fetch(`${API_URL}/todos/${id}/`, {
        method: "PATCH",                              // Teill-Update
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    await errorHandler(res);

    const updated = await res.json();
    return updated as Todo;
}

export async function deleteTodo(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/todos/${id}/`, { method: "DELETE" });
    await errorHandler(res);
}

 async function errorHandler(res: Response) {
    if (!res.ok) {
        let errorMessage = '';
        try {
          const error = await res.json(); 
          const field = Object.keys(error)[0];
          const value = error[field];
          errorMessage = value;
        } catch (err) {
          console.error('Fehler beim Lesen der Fehlermeldung:', err);
          errorMessage = 'Unbekannter Fehler';
        }
        throw new Error(errorMessage);
      }
}


