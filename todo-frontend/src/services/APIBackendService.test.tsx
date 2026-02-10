import { beforeEach, describe, expect, it, vi } from "vitest";
import { APIBackendService } from "./APIBackendService";
import type { Status, TodoPatchData } from "../models/types";

describe("APIBackendService - success", () => {
    let service: APIBackendService;
    beforeEach(() => {
        //reset fetch mock, damit der Mock nicht im nächsten test aktiv ist
        vi.restoreAllMocks();
        service = new APIBackendService();
        Object.defineProperty(service, "API_URL", { value: "http://test" });
    });

    test("listTodos returns data on success", async () => {
        //kontrollier was fetch zurückgibt
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => [{ id: 1, title: "Test Todo 1" }],
            } as Response)
        );

        const data = await service.listTodos();

        expect(fetch).toHaveBeenCalledWith("http://test/todos/");
        expect(data).toHaveLength(1);
        expect(data[0].title).toBe("Test Todo 1");
    });

    test("create Todo returns data on success", async () => {
        const payload = { title: "Test", description: "Description" };
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ id: 1, ...payload }),
            } as Response)
        );

        const data = await service.createTodo(payload);

        expect(fetch).toHaveBeenCalledWith("http://test/todos/",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        expect(data).toMatchObject(payload);
    });

    test("update Todo returns data on success", async () => {
        const payload = { id: 1, title: "New test", description: "New description", status:"IN_PROGRESS" };
        const patchData = { title: "New test", description: "New description", status: "IN_PROGRESS" as Status };
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ ...payload }),
            } as Response)
        );

        const data = await service.updateTodo(payload.id, patchData);

        expect(fetch).toHaveBeenCalledWith("http://test/todos/1/",{
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patchData),
        });
        expect(data).toMatchObject(payload);
    });

    test("delete Todo returns data on success", async () => {
        const todoId = 1;
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
            } as Response)
        );

        await service.deleteTodo(todoId);

        expect(fetch).toHaveBeenCalledWith("http://test/todos/1/",{
            method: "DELETE"
        });
    });

});

describe("APIBackendService - error", () => {
    let service: APIBackendService;

    beforeEach(() => {
        vi.restoreAllMocks();
        service = new APIBackendService();
        Object.defineProperty(service, "API_URL", { value: "http://test" });
    });

    test("listTodos throws error message on failure", async () => {
        const service = new APIBackendService();
        Object.defineProperty(service, "API_URL", { value: "http://test" });

        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ title: "bad request" }),
            } as Response)
        );

        await expect(service.listTodos()).rejects.toThrow("bad request");
    });

    test("create throws error message on failure", async () => {
        const todoData = {title: "Test", description: "Description"}
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ title: "bad request" }),
            } as Response)
        );

        await expect(service.createTodo(todoData)).rejects.toThrow("bad request");
    });

    test("update throws error message on failure", async () => {
        const todoId = 1;
        const patchTodoData = {title: "Test", description: "Description", status: "IN_PROGRESS" as Status}
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ title: "bad request" }),
            } as Response)
        );

        await expect(service.updateTodo(todoId, patchTodoData)).rejects.toThrow("bad request");
    });

    test("delete throws error message on failure", async () => {
        const todoId = 1;
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ title: "bad request" }),
            } as Response)
        );

        await expect(service.deleteTodo(todoId)).rejects.toThrow("bad request");
    });
});