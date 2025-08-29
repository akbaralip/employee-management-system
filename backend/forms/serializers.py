from rest_framework import serializers
from .models import FormField, FormTemplate

class FormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormField
        fields = ['id', 'label', 'field_type', 'required', 'options', 'order']
        read_only_fields = ['id']
        extra_kwargs = {
            'form_template': {'write_only': True, 'required': False}
        }

    def validate_options(self, value):
        if value is not None and not isinstance(value, dict):
            raise serializers.ValidationError("Options must be a valid JSON object.")
        return value


class FormTemplateSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True, required=False)

    class Meta:
        model = FormTemplate
        fields = ['id', 'name', 'fields', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        fields_data = validated_data.pop('fields', [])

        form_template = FormTemplate.objects.create(**validated_data)

        for field_data in fields_data:
            FormField.objects.create(form_template=form_template, **field_data)

        return form_template