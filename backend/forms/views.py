from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from forms.serializers import FormTemplateSerializer, FormFieldSerializer
from .models import FormTemplate, FormField

# Create your views here.

class FormTemplateViewSet(viewsets.ModelViewSet):
    serializer_class = FormTemplateSerializer

    def get_queryset(self):
        return FormTemplate.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def add_field(self, request, pk=None):
        from_template = self.get_object()
        serializer = FormFieldSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(from_template=from_template)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def reorder_fields(self, request):
        form_template = self.get_object()
        field_orders = request.data.get('field_orders', [])

        for item in field_orders:
            FormField.objects.filter(
                id=item['id'],
                form_template=form_template,
            ).update(order=item['order'])
        return Response({'message': 'Fields reordered successfully'})

class FormFieldViewSet(viewsets.ModelViewSet):
    serializer_class = FormFieldSerializer

    def get_queryset(self):
        return FormField.objects.filter(form_template__created_by=self.request.user)