from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from backend.authentication.views import register, change_password

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register, name='register'),
    path('change-password/', change_password, name='change_password'),
]