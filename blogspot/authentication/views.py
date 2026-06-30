from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .serializers import UserSerializer, LoginSerializer
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from blog.models import Post, Comment

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        
        if 'username' in serializer.errors:
            return Response({'error': serializer.errors['username'][0]}, status=status.HTTP_400_BAD_REQUEST)
        if 'email' in serializer.errors:
            return Response({'error': serializer.errors['email'][0]}, status=status.HTTP_400_BAD_REQUEST)
        if 'password' in serializer.errors:
            return Response({'error': serializer.errors['password'][0]}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'Invalid input.'}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

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
            
            # If request hits admin login endpoint but user is not admin
            if request.path.endswith('admin-login/') and not user.is_staff:
                return Response({'error': 'Invalid admin credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_staff': user.is_staff,
                'username': user.username,
                'email': user.email
            })

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

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

class AdminDashboardDataAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        dashboard_data = {
            'total_posts': Post.objects.count(),
            'total_users': User.objects.count(),
            'total_comments': Comment.objects.count()
        }
        return Response(dashboard_data)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        return User.objects.filter(is_staff=False)