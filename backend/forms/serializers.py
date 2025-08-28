from rest_framework import serializers
from .models import FormField, FormTemplate

class FormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormField
        fields = ['id', 'label', 'field_type', 'required', 'options', 'order', 'form_template']

class FormTemplateSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True, read_only=True)

    class Meta:
        model = FormTemplate
        fields = ['id', 'name', 'fields', 'created_at', 'updated_at']

