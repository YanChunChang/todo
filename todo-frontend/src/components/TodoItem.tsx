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
        <div className="flex flex-col mb-2">
            <h3 className="truncate max-w-[80%]">Titel: {todo.title}</h3>
            <span className="text-xs px-2 py-1 self-start rounded-full border text-amber-50 border-amber-50 bg-yellow-500">
            {todo.status_display}
            </span>
        </div>

        <p>
        <span className="font-medium">Beschreibung:</span> <br/>
          {todo.description}
        </p>
        <p>
          Datum: {todo.created_at}
        </p>

        <div className="flex mt-3 flex-col gap-2 justify-center md:flex-row">
            <button className="button button-in-todo-item">Bearbeiten</button>
            <button className="button button-in-todo-item">Löschen</button>
        </div>
      </div>
    ))}
  </div>
  );
}