from rest_framework import serializers
from .models import Todo

# 1. Serializer für Kommunikation zwischen API und Frontend 
# (Umwandlung von Model-Instanzen in JSON und umgekehrt)
# 2. Validierung der Daten bei Erstellung/Aktualisierung von Todos

class TodoSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Todo
        fields = ['id', 'title', 'description', 'status','status_display','created_at', 'updated_at']
        extra_kwargs = {
                    'title': {
                        'error_messages': {
                            'blank': 'Titel darf nicht leer sein.',
                            'required': 'Bitte gib einen Titel ein.',
                            'max_length': 'Titel darf höchstens 50 Zeichen haben.'
                        }
                    }
                }
    # def validate_title(self, value):
    #     if not value or not value.strip():
    #         raise serializers.ValidationError("Titel darf nicht leer sein.")
    #     return value.strip()

# Validierungsreihenfolge:
# In Views wird der Serializer aufgerufen, um die Daten zu validieren -> serializer.is_valid()
# Prüf erst Serializer-Feldvalidierungen (z.B. max_length) -> Standardvalidierungen
# Dann werden benutzerdefinierte Validierungen aufgerufen (z.B. validate_title)
# Mit Schlüsselwort validate_<feldname> erkennt DRF automatisch Validierungsfunktionen für spezifische Felder
# kein Fehler -> Daten als gültig betrachtet und weiterverarbeitet -> serializer.save()
# extra_kwargs nutzen, um vorhandene Regeln anzupassen (z.B. Fehlermeldungen)