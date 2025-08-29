from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from forms.serializers import FormTemplateSerializer, FormFieldSerializer
from rest_framework.permissions import IsAuthenticated
from .models import FormTemplate, FormField

# Create your views here.

class FormTemplateViewSet(viewsets.ModelViewSet):
    queryset = FormTemplate.objects.all()
    serializer_class = FormTemplateSerializer
    permission_classes = [IsAuthenticated]

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

    @action(detail=True, methods=['post'])
    def reorder_fields(self, request, pk=None):
        try:
            form_template = self.get_object()
        except FormTemplate.DoesNotExist:
            return Response({'error': 'Form template not found.'}, status=status.HTTP_404_NOT_FOUND)

        field_orders = request.data.get('field_orders', [])
        if not field_orders:
            return Response({'error': 'No field orders provided.'}, status=status.HTTP_400_BAD_REQUEST)

        for item in field_orders:
            field_id = item.get('id')
            new_order = item.get('order')
            if field_id is not None and new_order is not None:
                try:
                    FormField.objects.filter(
                        id=field_id,
                        form_template=form_template,
                    ).update(order=new_order)
                except FormField.DoesNotExist:
                    continue
        return Response({'message': 'Fields reordered successfully'}, status=status.HTTP_200_OK)

class FormFieldViewSet(viewsets.ModelViewSet):
    serializer_class = FormFieldSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FormField.objects.filter(form_template__created_by=self.request.user)