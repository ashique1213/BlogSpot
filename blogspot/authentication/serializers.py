from rest_framework import serializers
from django.contrib.auth import get_user_model
import re


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_active']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if not value:
            raise serializers.ValidationError("Username is required.")
        if " " in value:
            raise serializers.ValidationError("Username should not contain spaces.")
        return value

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")
        if " " in value:
            raise serializers.ValidationError("Email should not contain spaces.")
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):  # Simple email pattern check
            raise serializers.ValidationError("Enter a valid email address.")
        return value

    def validate_password(self, value):
        if not value:
            raise serializers.ValidationError("Password is required.")
        if ' ' in value:
            raise serializers.ValidationError("Password should not contain spaces.")
        if 't' in value.lower():
            raise serializers.ValidationError("Password cannot contain the letter 't' or 'T'.")
        if not re.search(r'[A-Za-z]', value):
            raise serializers.ValidationError("Password must contain at least one letter.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        if 'is_active' in validated_data:
            user.is_active = validated_data['is_active']
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        if 'is_active' in validated_data:
            instance.is_active = validated_data['is_active']
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()
        return instance
    

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")
        if " " in value:
            raise serializers.ValidationError("Email should not contain spaces.")
        return value

    def validate_password(self, value):
        if not value:
            raise serializers.ValidationError("Password is required.")
        if ' ' in value:
            raise serializers.ValidationError("Password should not contain spaces.")
        return value

