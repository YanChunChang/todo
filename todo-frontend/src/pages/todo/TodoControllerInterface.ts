import type { Todo, TodoFormData, TodoPatchData } from "../../models/types";

export interface TodoControllerInterface {
    getListTodos(): Promise<Todo[]>;
    createTodo(data: TodoFormData): Promise<Todo>;
    updateTodo(id: number, data: TodoPatchData): Promise<Todo>;
    deleteTodo(id: number): Promise<void>;
}