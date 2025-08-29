from django.urls import path, include
from forms.views import FormTemplateViewSet, FormFieldViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r'templates', FormTemplateViewSet, basename="template")
router.register(r'fields', FormFieldViewSet, basename="field")

urlpatterns = [
    path('', include(router.urls)),
    path('templates/<int:pk>/reorder_fields/', FormTemplateViewSet.as_view({'post': 'reorder_fields'}),
         name='template-reorder-fields'),
]