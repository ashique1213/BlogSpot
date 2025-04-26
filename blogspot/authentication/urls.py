# authentication/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # API Endpoints
    path('api/auth/register/', views.UserRegisterView.as_view(), name='api_register'),
    path('api/auth/login/', views.UserLoginView.as_view(), name='api_login'),
    path('api/auth/admin-login/', views.AdminLoginView.as_view(), name='api_admin_login'),
    path('api/auth/logout/', views.LogoutView.as_view(), name='api_logout'),
    path('api/admin/dashboard-data/', views.AdminDashboardDataAPIView.as_view(), name='admin_dashboard_data'),
    path('api/admin/users/', views.UserManagementAPIView.as_view(), name='user_management'),
    path('api/admin/users/<int:pk>/', views.UserManagementAPIView.as_view(), name='user_management_detail'),

    
    # Template
    path('', views.HomeView.as_view(), name='home'),
    path('register/', views.UserRegisterView.as_view(), name='user_register'),
    path('login/', views.UserLoginView.as_view(), name='user_login'),
    path('admin-login/', views.AdminLoginView.as_view(), name='admin_login'),
    path('admin-users/', views.AdminUsersView.as_view(), name='admin_users'),
    path('admin-dashboard/', views.AdminDashboardView.as_view(), name='admin_dashboard'),
    path('blogs/', views.BlogListView.as_view(), name='blog_list'),
]