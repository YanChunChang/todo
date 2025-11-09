from django.shortcuts import render, HttpResponse
from rest_framework import viewsets, filters
from .models import Todo
from .serializers import TodoSerializer

# Create your views here.
def health_check(request):
    return HttpResponse("OK")

# ViewSet (CRUD selbst schreiben)
# ModelViewSet für CRUD-Operationen auf Todo-Modell
# list, create, retrieve, update, delete

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all().order_by('-created_at')
    serializer_class = TodoSerializer