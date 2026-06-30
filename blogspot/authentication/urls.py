from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'admin/users', views.UserViewSet, basename='user')

urlpatterns = [
    # Auth Endpoints
    path('register/', views.RegisterView.as_view(), name='api_register'),
    path('login/', views.LoginView.as_view(), name='api_login'),
    path('admin-login/', views.LoginView.as_view(), name='api_admin_login'),
    path('logout/', views.LogoutView.as_view(), name='api_logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Admin Endpoints
    path('admin/dashboard-data/', views.AdminDashboardDataAPIView.as_view(), name='admin_dashboard_data'),
    
    # Router URLs
    path('', include(router.urls)),
]