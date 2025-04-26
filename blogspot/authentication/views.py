# authentication/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import UserSerializer, LoginSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import render
from django.contrib.auth import get_user_model
from blog.models import Post, Comment
from django.views import View
from rest_framework_simplejwt.exceptions import TokenError
from django.views.decorators.cache import never_cache

User = get_user_model()

class HomeView(APIView):
    permission_classes = []

    def get(self, request):
        return render(request, 'home.html')

class UserRegisterView(APIView):
    permission_classes = []

    def get(self, request):
        return render(request, 'user-register.html')

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    permission_classes = []

    def get(self, request):
        return render(request, 'user-login.html')

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            if "email" in serializer.errors:
                return Response({"error": serializer.errors["email"][0]}, status=status.HTTP_400_BAD_REQUEST)
            if "password" in serializer.errors:
                return Response({"error": serializer.errors["password"][0]}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": "Invalid input."}, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(email=email, password=password)
        if user:
            if not user.is_active:
                return Response({'error': 'Your account is blocked'}, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_staff': user.is_staff
            })

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class AdminLoginView(APIView):
    permission_classes = []

    def get(self, request):
        return render(request, 'admin-login.html')

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(email=email, password=password)
            if user and user.is_staff:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'is_staff': user.is_staff
                })
            return Response({'error': 'Invalid admin credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminDashboardView(View):
    def get(self, request):
        return render(request, 'admin-dashboard.html')

class AdminDashboardDataAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        dashboard_data = {
            'total_posts': Post.objects.count(),
            'total_users': User.objects.count(),
            'total_comments': Comment.objects.count()
        }
        return Response(dashboard_data)


class BlogListView(APIView):
    permission_classes = []  
    def get(self, request):
        return render(request, 'blog-list.html')

class LogoutView(APIView):
    permission_classes = []

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_204_NO_CONTENT)
        except TokenError as e:
            if str(e) == 'Token is blacklisted':
                return Response({'message': 'Already logged out'}, status=status.HTTP_200_OK)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class AdminUsersView(View):
    def get(self, request):
        return render(request, 'admin-users.html')


class UserManagementAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        users = User.objects.filter(is_staff=False)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)