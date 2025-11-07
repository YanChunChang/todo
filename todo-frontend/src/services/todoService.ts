import type { Todo } from '../models/types';

const env = import.meta.env
const API_URL = env.VITE_API_BASE_URL

export async function listTodos(): Promise<Todo[]> {
    const res = await fetch(`${API_URL}/todos/`);
    console.log('Fetch todos response:', res);

    if (!res.ok) {
        throw new Error(`Fehler beim Laden: ${res.status}`);
    }

    const data = await res.json();
    console.log('Fetched todos data:', data);

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

    if (!res.ok) {
        let error = '';
        let errorMessage = '';
        try {
            error = await res.json();                   //javascript object

            if (error && typeof error === 'object') {
                const field = Object.keys(error)[0];    //title
                const value = error[field];             // error message in Title
                errorMessage = value;

                // Wenn es ein Array ist, nimm den ersten Text
                // if (Array.isArray(value)) {
                //     errorMessage = value[0];
                // } else if (typeof value === 'string') {
                //     errorMessage = value;
                // }
            }

        }
        catch (err) {
            console.error('Fehler beim Lesen der Fehlermeldung:', err);
            errorMessage = 'Unbekannter Fehler';
        }
        throw new Error(`${errorMessage}`);
    }

    const data = await res.json();
    return data as Todo;
}