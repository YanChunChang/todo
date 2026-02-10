import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import TodoView from "./TodoView";
import type { TodoControllerInterface } from "./TodoControllerInterface";
import userEvent from "@testing-library/user-event";

const mockTodos = [
    {
        id: 1,
        title: "Test Todo 1",
        description: "Description for Test Todo 1",
        status: "OPEN",
        status_display: "Offen",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    {
        id: 2,
        title: "Test Todo 2",
        description: "Description for Test Todo 2",
        status: "IN_PROGRESS",
        status_display: "In Bearbeitung",
        created_at: "2024-01-02T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
    },
];

const mockController: TodoControllerInterface = {
    getListTodos: vi.fn().mockResolvedValue(mockTodos),
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
};

// Ui tests
test("there is no todo in todo-list",() =>{
    render(<TodoView controller={mockController}/>);
    expect(screen.getByRole("heading", { name: /deine aufgaben/i })).toBeInTheDocument();
    expect(screen.getByText(/Noch nichts eingetragen/i)).toBeInTheDocument();
})

test("there are todos in todo-list", async () =>{
    render(<TodoView controller={mockController}/>);

    expect(await screen.findByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Description for Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Offen")).toBeInTheDocument();

    expect(await screen.findByText("Test Todo 2")).toBeInTheDocument();
    expect(screen.getByText("Description for Test Todo 2")).toBeInTheDocument();
    expect(screen.getByText("In Bearbeitung")).toBeInTheDocument();
})

// Functional tests
test("refreshes todo list on load", async () => {
    render(<TodoView controller={mockController} />);
    expect(mockController.getListTodos).toHaveBeenCalled();
});

// Integration test
//todo: ist dieser test richtig?
test("handles create todo", async () => {
    const mockNewTodoFormData = {
        title: "Test Todo 3",
        description: "Description for Test Todo 3",
    };
    const createdTodo = {
        id: 3,
        title: mockNewTodoFormData.title,
        description: mockNewTodoFormData.description,
        status: "OPEN",
        status_display: "Offen",
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
    };
    const controller = {
        ...mockController,
        createTodo: vi.fn().mockResolvedValue(createdTodo),
    };
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<TodoView controller={controller} />);
    await userEvent.type(screen.getByLabelText(/Titel/i), mockNewTodoFormData.title);
    await userEvent.type(screen.getByLabelText(/Beschreibung/i), mockNewTodoFormData.description);
    await userEvent.click(screen.getByRole("button", { name: /speichern/i }));

    await waitFor(() => {
        expect(controller.createTodo).toHaveBeenCalledWith(mockNewTodoFormData);
    });
    expect(alertSpy).toHaveBeenCalledWith("Aufgabe gespeichert!");
    alertSpy.mockRestore();
});

// todo: wo ist der fehler Unable to find an accessible element with the role "button" and name `/bearbeiten/i`
test("handles update todo", async () => {
    const updatedData = {
        title: "Updated Test Todo 1",
        description: "Updated description for Test Todo 1",
        status: "IN_PROGRESS",
    };
    const controller = {
        ...mockController,
        getListTodos: vi.fn().mockResolvedValue(mockTodos),
        updateTodo: vi.fn().mockResolvedValue(updatedData)
    }

    render(<TodoView controller={controller} />);

    const editButtons = await screen.findAllByRole("button", { name: /bearbeiten/i });
    await userEvent.click(editButtons[0]);

    await userEvent.clear(screen.getByLabelText(/titel/i));
    await userEvent.type(screen.getByLabelText(/titel/i), updatedData.title);

    await userEvent.clear(screen.getByLabelText(/beschreibung/i));
    await userEvent.type(screen.getByLabelText(/beschreibung/i), updatedData.description);

    await userEvent.selectOptions(screen.getByRole("combobox"), updatedData.status);
    const saveButtons = await screen.findAllByRole("button", {name: /speichern/i});
    await userEvent.click(saveButtons[0]);

    await waitFor(() => {
        expect(controller.updateTodo).toHaveBeenCalledWith(mockTodos[0].id, updatedData);
    });

});

test("handles delete todo", async () => {
    
});

test("handles Error", async () => {
    
});
