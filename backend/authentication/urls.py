from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from authentication.views import register, change_password
from backend.authentication.views import CustomTokenObtainPairView

urlpatterns = [
    # path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('register/', register, name='register'),
    path('change-password/', change_password, name='change_password'),
]