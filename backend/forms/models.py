from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class FormTemplate(models.Model):
    FIELD_TYPES = [
        ('text', 'Text'),
        ('number', 'Number'),
        ('email', 'Email'),
        ('password', 'Password'),
        ('date', 'Date'),
        ('textarea', 'Textarea'),
        ('select', 'Select'),
        ('checkbox', 'Checkbox'),
        ('radio', 'Radio'),
    ]

    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"FormTemplate: {self.name}"

class FormField(models.Model):
    form_template = models.ForeignKey(FormTemplate, related_name='fields', on_delete=models.CASCADE)
    label = models.CharField(max_length=255)
    field_type = models.CharField(max_length=50, choices=FormTemplate.FIELD_TYPES)
    required = models.BooleanField(default=False)
    options = models.JSONField(blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.label} ({self.field_type})"
