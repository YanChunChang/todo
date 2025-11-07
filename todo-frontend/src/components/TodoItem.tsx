import type { Todo } from "../models/types";

export default function TodoItem({ todos }: { todos: Todo[] }) {
  return (
    <div className="grid gap-2 px-2 py-2">
    {todos.map((todo, index) => (
      <div
        key={todo.id}
        className={`todo-item ${index % 2 === 0
          ? "bg-linear-to-br from-light-blue to-marine"
          : "bg-linear-to-br from-light-rosa to-purple"
          }`}
      >
        <h3>Titel: {todo.title}</h3>
        <p>
          Beschreibung:<br />
          {todo.description}
        </p>
        <p>
          Status: {todo.status_display}
        </p>
        <p>
          Datum: {todo.created_at}
        </p>
      </div>
    ))}
  </div>
  );
}