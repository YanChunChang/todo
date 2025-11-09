import type { Todo, TodoFormData } from "../../models/types";

export interface TodoControllerInterface {
    getListTodos(): Promise<Todo[]>;
    createTodo(data: TodoFormData): Promise<Todo>;
    updateTodo(id: number, data: Partial<Todo>): Promise<Todo>;
    deleteTodo(id: number): Promise<void>;
}