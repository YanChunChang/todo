import pytest
from rest_framework.test import APIClient

# Create your tests here.
@pytest.mark.django_db
def test_create_todo():
    client = APIClient()
    response = client.get("/api/todos/")
    assert response.status_code == 200
    assert response.data == []
