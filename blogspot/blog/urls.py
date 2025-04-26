# blog/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Template URLs
    path('blogs/', views.BlogListView.as_view(), name='blog_list'),
    path('blogs/<int:pk>/', views.BlogDetailView.as_view(), name='blog_detail'),
    path('admin-posts/', views.AdminPostsView.as_view(), name='admin_posts'),
    path('admin-comments/', views.AdminCommentsView.as_view(), name='admin_comments'),
    # API 
    path('api/blogs/', views.PostListAPIView.as_view(), name='api_blog_list'),
    path('api/blogs/<int:pk>/', views.PostDetailAPIView.as_view(), name='api_blog_detail'),
    path('api/admin/posts/', views.PostManagementAPIView.as_view(), name='post_management'),
    path('api/admin/posts/<int:pk>/', views.PostManagementAPIView.as_view(), name='post_management_detail'),
    path('api/comments/', views.CommentManagementAPIView.as_view(), name='comment_management'),
    path('api/comments/<int:pk>/', views.CommentManagementAPIView.as_view(), name='comment_management_detail'),
    path('api/blogs/<int:pk>/like/', views.PostLikeAPIView.as_view(), name='post_like'),
]