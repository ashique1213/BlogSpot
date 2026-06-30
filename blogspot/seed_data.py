import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blogspot.settings')
django.setup()

from django.contrib.auth import get_user_model
from blog.models import Post
from django.utils import timezone

User = get_user_model()

# Create Users
users_data = [
    {'username': 'john_doe', 'email': 'john@example.com', 'password': 'password123'},
    {'username': 'jane_smith', 'email': 'jane@example.com', 'password': 'password123'},
    {'username': 'tech_guru', 'email': 'guru@example.com', 'password': 'password123'},
    {'username': 'alice_wonder', 'email': 'alice@example.com', 'password': 'password123'},
]

created_users = []
for data in users_data:
    user, created = User.objects.get_or_create(username=data['username'], email=data['email'])
    if created:
        user.set_password(data['password'])
        user.save()
    created_users.append(user)
    print(f"User {user.username} created.")

# Create Posts
posts_data = [
    {
        'title': 'The Future of AI',
        'content': '<p>Artificial intelligence is evolving at a breakneck pace. Here are some thoughts on where we are headed next.</p>',
        'author': created_users[0],
        'status': 'published'
    },
    {
        'title': '10 Tips for Better React Code',
        'content': '<p>Writing clean React code can be challenging. In this post, I share my top 10 tips for writing maintainable components.</p>',
        'author': created_users[1],
        'status': 'published'
    },
    {
        'title': 'Why Django is Still Relevant in 2026',
        'content': '<p>Despite the rise of many new frameworks, Django remains a robust and reliable choice for backend development.</p>',
        'author': created_users[2],
        'status': 'published'
    },
    {
        'title': 'My Journey Learning Framer Motion',
        'content': '<p>Framer Motion has completely changed how I think about animations in React. Here is my journey and some cool examples.</p>',
        'author': created_users[3],
        'status': 'published'
    }
]

for i, data in enumerate(posts_data):
    post, created = Post.objects.get_or_create(
        title=data['title'],
        defaults={
            'content': data['content'],
            'author': data['author'],
            'status': data['status']
        }
    )
    if created:
        print(f"Post '{post.title}' created.")

print("Seeding complete!")
