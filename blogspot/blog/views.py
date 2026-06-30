from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Exists, OuterRef
from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action in ['create']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated] # We will check object level permissions below
        return [permission() for permission in permission_classes]

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if self.action in ['update', 'partial_update', 'destroy']:
            if not (request.user.is_staff or obj.author == request.user):
                self.permission_denied(request, message="You do not have permission to modify this post.")

    def get_queryset(self):
        queryset = Post.objects.select_related('author').prefetch_related('comments', 'comments__user').annotate(likes_count=Count('like'))
        
        # Non-admins only see published posts
        if self.action in ['list', 'retrieve'] and not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(status='published')
            
        author_username = self.request.query_params.get('author')
        if author_username:
            if author_username.lower() == 'blogspot editor':
                author_username = 'admin'
            queryset = queryset.filter(author__username__iexact=author_username)
            
        if self.request.user and self.request.user.is_authenticated:
            queryset = queryset.annotate(is_liked=Exists(Like.objects.filter(post=OuterRef('pk'), user=self.request.user)))
            
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment read count for non-admins reading published posts
        if instance.status == 'published' and not request.user.is_staff:
            instance.reads += 1
            instance.save(update_fields=['reads'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        if not request.user.is_active:
            return Response({'error': 'Your account is blocked'}, status=status.HTTP_403_FORBIDDEN)
        
        post = self.get_object()
        like, created = Like.objects.get_or_create(post=post, user=request.user)

        if not created:
            like.delete()
            message = 'Post unliked successfully'
            liked = False
        else:
            message = 'Post liked successfully'
            liked = True
            
        # Re-fetch post to get updated likes_count
        updated_post = Post.objects.annotate(likes_count=Count('like')).get(pk=post.pk)

        return Response({
            'message': message,
            'liked': liked,
            'likes': updated_post.likes_count
        }, status=status.HTTP_200_OK)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Comment.objects.select_related('user', 'post')
        if self.request.user.is_staff:
            return queryset.all()
        return queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        if not request.user.is_active:
            return Response({'error': 'Your account is blocked'}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'error': 'Only admins can update comment status'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not (request.user.is_staff or (instance.user == request.user and request.user.is_active)):
            return Response({'error': 'You cannot delete this comment'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
