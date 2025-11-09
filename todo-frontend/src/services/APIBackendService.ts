import type { Todo, TodoFormData } from '../models/types';
import type { BackendServiceInterface } from './TodoBackendServiceInterface';

export class APIBackendService implements BackendServiceInterface {
    readonly env = import.meta.env;
    readonly API_URL = this.env.VITE_API_BASE_URL;

    async listTodos(): Promise<Todo[]> {
        const res = await fetch(`${this.API_URL}/todos/`);

        await this.errorHandler(res);

        const data = await res.json();
        return data as Todo[];
    }

    async createTodo(todoData: TodoFormData): Promise<Todo> {
        const res = await fetch(`${this.API_URL}/todos/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todoData),
        });

        await this.errorHandler(res);

        const data = await res.json();
        return data as Todo;
    }

    async updateTodo(id: number, data: Partial<Todo>): Promise<Todo> {
        const res = await fetch(`${this.API_URL}/todos/${id}/`, {
            method: "PATCH",                             
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        await this.errorHandler(res);

        const updated = await res.json();
        return updated as Todo;
    }

    async deleteTodo(id: number): Promise<void> {
        const res = await fetch(`${this.API_URL}/todos/${id}/`, { 
            method: "DELETE" 
        });
        await this.errorHandler(res);
    }

    async errorHandler(res: Response) {
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


}