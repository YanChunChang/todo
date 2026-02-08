import pytest
from rest_framework.test import APIClient
from todos.models import Todo

# Preparation
@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def todo():
    return Todo.objects.create(
        title="Test Todo",
        status="OPEN"
    )

@pytest.fixture
def todos():
    return Todo.objects.create(
        title="Test 0",
        status="OPEN"
    ), Todo.objects.create(
        title="Test 1",
        status="IN_PROGRESS"
    )

@pytest.mark.django_db
def test_get_todos_empty(api_client):
    response = api_client.get("/api/todos/")
    assert response.status_code == 200
    assert response.data == []

@pytest.mark.django_db
def test_get_todos_list(api_client, todos):
    response = api_client.get("/api/todos/")
    assert response.status_code == 200
    assert len(response.data) == 2
    titles = {item["title"] for item in response.data}
    assert titles == {"Test 0", "Test 1"}

@pytest.mark.django_db
def test_get_todo_detail(api_client, todo):
    response = api_client.get(f"/api/todos/{todo.id}/")

    assert response.status_code == 200
    assert response.data["title"] == "Test Todo"
    assert response.data["status"] == "OPEN"

@pytest.mark.django_db
def test_create_todo(api_client):
    response = api_client.post("/api/todos/", {
        "title": "New Todo",
        "status": "OPEN"
    }, format="json")

    assert response.status_code == 201
    assert response.data["title"] == "New Todo"
    assert response.data["status"] == "OPEN"

