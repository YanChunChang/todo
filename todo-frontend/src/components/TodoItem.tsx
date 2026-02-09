import { useState } from "react";
import type { Todo, TodoPatchData } from "../models/types";
type Props = {
    todos: Todo[];
    onUpdate?: (id: number, data: TodoPatchData) => Promise<void> | void; 
    onDelete?: (id: number) => Promise<void> | void;                      
  };

export default function TodoItem({ todos, onUpdate, onDelete }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<Todo["status"]>("OPEN");
  
    function startEdit(todo: Todo) {
      setEditingId(todo.id);
      setTitle(todo.title);
      setDescription(todo.description ?? "");
      setStatus(todo.status);
    }

    function cancelEdit() {
      setEditingId(null);
    }

    async function saveEdit() {
      if (!editingId) return;
      const payload: TodoPatchData = {
        title: title.trim(),
        description: description.trim() || "",
        status,
      };
      if (!payload.title) {
        alert("Der Titel darf nicht leer sein.");
        return;
      }
      if (onUpdate) {
        await onUpdate(editingId, payload);
      }
      setEditingId(null);
    }

    async function handleDelete(id: number) {
      if (onDelete) await onDelete(id);
    }

  return (
<>
      <div className="grid gap-2 px-2 py-2">
        {todos.map((todo, index) => {
          const isEditing = editingId === todo.id;

          return (
            <div
              key={todo.id}
              className={`todo-item rounded-xl p-3 ${
                index % 2 === 0
                  ? "bg-linear-to-br from-light-blue to-marine"
                  : "bg-linear-to-br from-light-rosa to-purple"
              }`}
            >
              {!isEditing ? (
                /* ---------- ANZEIGE-MODUS ---------- */
                <>
                  <div className="flex mb-2 md:flex-row justify-between md:items-center">
                    <h3 className="truncate max-w-[70%]">{todo.title}</h3>
                    <span
                    className={`text-xs px-2 py-1 self-start rounded-full border text-white border-white ${
                        todo.status_display === 'Offen'
                        ? "bg-linear-to-br from-pink-300 to-rosa"
                        : todo.status_display === "In Bearbeitung"
                        ? "bg-linear-to-br from-yellow-400 to-orange-500 truncate"
                        : "bg-linear-to-br from-green-400 to-marine"
                        }`}>
                      {todo.status_display}
                    </span>
                  </div>

                  <p>
                    <span className="font-medium"></span>
                    {todo.description || "—"}
                  </p>

                  <p className="mt-2 text-xs">
                     Erstelldatum: {new Date(todo.created_at).toLocaleString()}
                  </p>

                  <p className="mt-2 text-xs">
                     Zuletzt geändert: {new Date(todo.updated_at).toLocaleString()}
                  </p>

                  <div className="flex mt-3 flex-col gap-2 justify-center md:flex-row">
                    <button
                      className="button button-in-todo-item disabled:text-gray-200 disabled:bg-white/30"
                      disabled={todo.status === "COMPLETED"}
                      onClick={() => startEdit(todo)}
                    >
                      Bearbeiten
                    </button>
                    <button
                      className="button button-in-todo-item"
                      onClick={() => handleDelete(todo.id)}
                    >
                      Löschen
                    </button>
                  </div>
                </>
              ) : (
                /* ---------- EDIT-MODUS ---------- */
                <>
                  <div className="mt-2">
                        <label className="text-white mb-2">Titel*</label>
                        <input
                        className="text-dark-pink"
                        placeholder="Titel*"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        />
                    </div>

                  <div className="mt-2">
                    <label className="text-white mb-2">Beschreibung</label>
                    <textarea
                      className="text-dark-pink"
                      rows={3}
                      placeholder="Beschreibung (optional)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="mt-2 flex flex-row gap-2.5 items-center mb-3">
                    <label className="text-white">Status</label>
                    <select
                      className="rounded-xl border border-white p-2 text-dark-pink"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Todo["status"])}
                    >
                      <option value="OPEN">Offen</option>
                      <option value="IN_PROGRESS">In Bearbeitung</option>
                      <option value="COMPLETED">Erledigt</option>
                    </select>
                  </div>

                  <p className="mt-2 text-xs">
                     Erstelldatum: {new Date(todo.created_at).toLocaleString()}
                  </p>
                  <p className="mt-2 text-xs">
                     Zuletzt geändert: {new Date(todo.updated_at).toLocaleString()}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      className="button button-in-todo-item bg-amber-50 text-purple"
                      onClick={saveEdit}
                    >
                      Speichern
                    </button>
                    <button
                      className="button button-in-todo-item bg-amber-50 text-purple"
                      onClick={cancelEdit}
                    >
                      Abbrechen
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
