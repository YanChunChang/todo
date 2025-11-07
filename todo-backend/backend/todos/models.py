from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.
class Todo(models.Model):
    class Status(models.TextChoices):
        OPEN = 'OPEN', _('Offen')
        IN_PROGRESS = 'IN_PROGRESS',  _('In Bearbeitung')
        COMPLETED = 'COMPLETED',  _('Fertig')
        
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# für bessere Lesbarkeit in Admin
    def __str__(self):
       return self.title

# Migration Befehle:
# python manage.py makemigrations 
# python manage.py migrate