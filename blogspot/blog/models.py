# blog/models.py
from django.db import models
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField

User = get_user_model()

class Post(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    cover_image = CloudinaryField('blogspot', blank=True, null=True,folder="blogspot")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    publish_date = models.DateField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[('draft', 'Draft'), ('published', 'Published')],
        default='draft'
    )
    reads = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

    @property
    def likes(self):
        return self.like_set.count()

    class Meta:
        ordering = ['-publish_date']

class Comment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('blocked', 'Blocked'),
    ]

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"

    class Meta:
        ordering = ['-created_at']

class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')

    def __str__(self):
        return f"{self.user.username} likes {self.post.title}"