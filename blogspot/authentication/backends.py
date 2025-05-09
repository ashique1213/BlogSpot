from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class EmailBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        User = get_user_model()
        try:
            user = User.objects.get(email__iexact=email)  # Case-insensitive lookup
        except User.DoesNotExist:
            return None
        if user.check_password(password):
            return user
        return None