from rest_framework import serializers
from .models import Employee, EmployeeData

class EmployeeDataSerializer(serializers.ModelSerializer):
    field_value = serializers.CharField(required=False)

    class Meta:
        model = EmployeeData
        fields = ['id', 'field_label', 'field_value']
        read_only_fields = ['id']

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

    def update(self, instance, validated_data):
        employee_data_list = validated_data.pop('data')

        # Update the main employee instance
        instance.form_template = validated_data.get('form_template', instance.form_template)
        instance.save()

        # Update the nested EmployeeData objects
        for employee_data_item in employee_data_list:
            field_id = employee_data_item.get('id')
            if field_id:
                # Update existing EmployeeData
                try:
                    employee_data_instance = EmployeeData.objects.get(id=field_id, employee=instance)
                    employee_data_instance.field_value = employee_data_item.get('field_value',
                                                                                employee_data_instance.field_value)
                    employee_data_instance.save()
                except EmployeeData.DoesNotExist:
                    continue
            else:
                EmployeeData.objects.create(employee=instance, **employee_data_item)
        return instance

class EmployeeListSerializer(serializers.ModelSerializer):
    data = EmployeeDataSerializer(many=True, read_only=True)
    form_template_name = serializers.CharField(source='form_template.name', read_only=True)

    class Meta:
        model = Employee
        fields = ['id', 'form_template', 'form_template_name', 'data', 'created_at']