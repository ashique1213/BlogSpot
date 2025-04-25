# blog/serializers.py
from rest_framework import serializers
from .models import Post, Comment, Like
from django.contrib.auth import get_user_model
import cloudinary

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    post_title = serializers.CharField(source='post.title', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'post_title', 'user', 'content', 'created_at', 'status']
        read_only_fields = ['user', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context.get('request').user
        return super().create(validated_data)

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    cover_image = serializers.ImageField(allow_null=True, required=False)
    cover_image_url = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'cover_image', 'cover_image_url', 'author', 'publish_date', 'status', 'reads', 'likes', 'comments', 'liked']
        read_only_fields = ['author', 'publish_date', 'reads']

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return cloudinary.CloudinaryImage(str(obj.cover_image)).build_url()
        return None

    def get_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(post=obj, user=request.user).exists()
        return False

    def get_likes(self, obj):
        return obj.likes

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authenticated user required")
        validated_data['author'] = request.user
        return super().create(validated_data)