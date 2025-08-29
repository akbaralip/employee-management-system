from django.db import models
from django.contrib.auth.models import User
from forms.models import FormTemplate

# Create your models here.
class Employee(models.Model):
    form_template = models.ForeignKey(FormTemplate, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Employee #{self.id} (Form: {self.form_template.name})"

class EmployeeData(models.Model):
    employee = models.ForeignKey(Employee, related_name='data', on_delete=models.CASCADE)
    field_label = models.CharField(max_length=255)
    field_value = models.TextField()

    def __str__(self):
        return f"{self.field_label}: {self.field_value}"