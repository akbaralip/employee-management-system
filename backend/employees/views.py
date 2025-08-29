from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Employee
from .serializers import EmployeeCreateSerializer, EmployeeListSerializer


class EmployeeViewSet(viewsets.ModelViewSet):

    def get_queryset(self):
        # Only show employees created by the logged-in user
        return Employee.objects.filter(created_by=self.request.user)

    def get_serializer_class(self):
        # Use different serializers for list and create actions
        if self.action in ['create', 'update', 'partial_update']:
            return EmployeeCreateSerializer
        return EmployeeListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')

        # Search across all dynamic fields
        queryset = self.get_queryset().filter(
            data__field_value__icontains=query
        ).distinct()

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)