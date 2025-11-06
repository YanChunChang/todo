from rest_framework import serializers
from .models import Todo

# 1. Serializer für Kommunikation zwischen API und Frontend 
# (Umwandlung von Model-Instanzen in JSON und umgekehrt)
# 2. Validierung der Daten bei Erstellung/Aktualisierung von Todos

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'title', 'description', 'status', 'created_at', 'updated_at']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Titel darf nicht leer sein.")
        return value.strip()