from rest_framework import serializers
from .models import Employee, EmployeeData

class EmployeeDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeData
        fields = ['field_label', 'field_value']


class EmployeeCreateSerializer(serializers.ModelSerializer):
    data = EmployeeDataSerializer(many=True)

    class Meta:
        model = Employee
        fields = ['form_template', 'data']

    def create(self, validated_data):
        employee_data = validated_data.pop('data')
        employee = Employee.objects.create(
            created_by=self.context['request'].user,
            **validated_data
        )

        for data in employee_data:
            EmployeeData.objects.create(employee=employee, **data)

        return employee


class EmployeeListSerializer(serializers.ModelSerializer):
    data = EmployeeDataSerializer(many=True, read_only=True)
    form_template_name = serializers.CharField(source='form_template.name', read_only=True)

    class Meta:
        model = Employee
        fields = ['id', 'form_template', 'form_template_name', 'data', 'created_at']