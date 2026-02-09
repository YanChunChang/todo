import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import TodoForm from "./TodoForm";

const mockOnCreate = vi.fn();

test("shows the form with title and description fields", () => {
    // Render the TodoForm component
    render(<TodoForm />);

    // Check if the fields are present
    expect(screen.getByRole("heading",{name:/Aufgaben erstellen/i})).toBeInTheDocument();
    expect(screen.getByLabelText(/titel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/beschreibung/i)).toBeInTheDocument();
    expect(screen.getByRole("button", {name:/speichern/i})).toBeInTheDocument();
    expect(screen.getByRole("button", {name:/zurücksetzen/i})).toBeInTheDocument();
});

test("user can type into title and description", async () => {
    render(<TodoForm />);

    // Check if the inputfields are present
    const titleInput = screen.getByRole("textbox", {name:/titel/i});
    const descriptionInput = screen.getByRole("textbox", {name:/beschreibung/i});

    // Simulate user typing into the fields
    await userEvent.type(titleInput, "My Test Task");
    await userEvent.type(descriptionInput, "Some descriptions for the task");

    expect(titleInput).toHaveValue("My Test Task");
    expect(descriptionInput).toHaveValue("Some descriptions for the task");
});


test("user can clear the form", async () => {
    render(<TodoForm />);

    const titleInput = screen.getByRole("textbox", {name:/titel/i});
    const descriptionInput = screen.getByRole("textbox", {name:/beschreibung/i});

    await userEvent.type(titleInput, "My Test Task");
    await userEvent.type(descriptionInput, "Some descriptions for the task");
    await userEvent.click(screen.getByRole("button", {name:/zurücksetzen/i}));

    expect(titleInput).toHaveValue("");
    expect(descriptionInput).toHaveValue("");
});

test("user can submit the form", async () => {
    render(<TodoForm onCreate={mockOnCreate}/>);

    const titleInput = screen.getByRole("textbox", {name:/titel/i});
    const descriptionInput = screen.getByRole("textbox", {name:/beschreibung/i});

    await userEvent.type(titleInput, "My Test Task");
    await userEvent.type(descriptionInput, "Some descriptions for the task");
    await userEvent.click(screen.getByRole("button", {name:/speichern/i}));

    expect(mockOnCreate).toHaveBeenCalledWith({
        title: "My Test Task",
        description: "Some descriptions for the task"
    });
});
