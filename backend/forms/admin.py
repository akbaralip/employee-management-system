from django.contrib import admin
from .models import FormTemplate, FormField

# Register your models here
admin.site.register(FormTemplate)
admin.site.register(FormField)