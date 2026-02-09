import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import TodoItem from "./TodoItem";
import type { Todo } from "../models/types";

const mockTodo: Todo = {
    id: 1,
    title: "Test Todo",
    description: "Test description",
    status: "OPEN",
    status_display: "Offen",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

test("show the todo",() =>{
    render(<TodoItem todos={[mockTodo]}/>);

    expect(screen.getByText("Test Todo")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("Offen")).toBeInTheDocument();
    expect(screen.getByText(/erstelldatum/i)).toBeInTheDocument();
    expect(screen.getByText(/zuletzt geändert/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /bearbeiten/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /löschen/i })).toBeInTheDocument();
})

test("user can delete todo",async () =>{
    const mockOnDelete = vi.fn();
    render(<TodoItem todos={[mockTodo]} onDelete={mockOnDelete}/>);

    await userEvent.click(screen.getByRole("button", { name: /löschen/i }));

    expect(mockOnDelete).toHaveBeenCalledWith(1);
})


test("user click edit-button and it shows edit-mode",async() =>{
    render(<TodoItem todos={[mockTodo]}/>);

    await userEvent.click(screen.getByRole("button", {name: /bearbeiten/i}));

    expect(screen.getByDisplayValue("Test Todo")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test description")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("OPEN");
})

test("user can edit and save the fields",async() =>{
    const mockOnUpdate = vi.fn();
    render(<TodoItem todos={[mockTodo]} onUpdate={mockOnUpdate}/>);
    await userEvent.click(screen.getByRole("button", {name: /bearbeiten/i}));

    const titleInput = screen.getByDisplayValue(/test todo/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Updated Todo");
    
    const descriptionInput = screen.getByDisplayValue(/test description/i);
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, "Updated description");

    await userEvent.selectOptions(screen.getByRole("combobox"), "IN_PROGRESS");
    await userEvent.click(screen.getByRole("button", { name: /speichern/i }));
    
    expect(mockOnUpdate).toHaveBeenCalledWith(1, {
        title: "Updated Todo",
        description: "Updated description",
        status: "IN_PROGRESS",
    });
})

test("user can stop edit-mode",async() =>{
    render(<TodoItem todos={[mockTodo]}/>);
    await userEvent.click(screen.getByRole("button", {name: /bearbeiten/i}));

    const titleInput = screen.getByDisplayValue(/test todo/i);
    await userEvent.clear(screen.getByDisplayValue(/test todo/i));
    await userEvent.type(titleInput, "Updated Todo");
    await userEvent.click(screen.getByRole("button", { name: /abbrechen/i }));
    
    // Edit-Modus sollte verlassen werden, ohne dass die Änderungen gespeichert werden
    expect(screen.queryByDisplayValue("Test Todo")).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue("Test description")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /speichern/i })).not.toBeInTheDocument();
    
    expect(screen.getByText("Test Todo")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("Offen")).toBeInTheDocument();
})
