import type { TodoControllerInterface } from './TodoControllerInterface';
import type { Todo, TodoFormData, TodoPatchData } from '../../models/types';
import type { BackendServiceInterface } from '../../services/TodoBackendServiceInterface';

export class TodoController implements TodoControllerInterface{
    private backend: BackendServiceInterface;

    constructor(backend: BackendServiceInterface) {
        this.backend = backend;
    }

    getListTodos(): Promise<Todo[]> {
        return this.backend.listTodos();
    }
    createTodo(data: TodoFormData): Promise<Todo> {
        return this.backend.createTodo(data);
    }
    updateTodo(id: number, data: TodoPatchData): Promise<Todo> {
        return this.backend.updateTodo(id, data);
    }
    deleteTodo(id: number): Promise<void> {
        return this.backend.deleteTodo(id);
    }

}