import type { Todo, TodoFormData } from "../models/types";

export interface BackendServiceInterface{
    listTodos(): Promise<Todo[]>;
    createTodo(todo: TodoFormData): Promise<Todo>;
    updateTodo(id: number, data: Partial<Todo>): Promise<Todo>;
    deleteTodo(id: number): Promise<void>;
}