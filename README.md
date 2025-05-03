BlogSpot
A Content Management System (CMS) for publishing and sharing blog posts with user and admin functionalities.
Description
BlogSpot is a Django-based CMS that allows users to read, like, comment, and share blog posts, while administrators can manage users, posts, and comments. It features a secure REST API with JWT authentication, cloud storage for media using Cloudinary, and a frontend built with Django templates. The application supports user registration, post creation with image uploads, comment moderation, and like/unlike functionalities.
Table of Contents

Features
Installation
Configuration
Usage
API Endpoints
Contributing
License
Contact

Features

User Features:
View all blog posts with images and read counts.
Read detailed blog posts.
Like or unlike posts.
Add comments (pending admin approval).
User registration and login.


Admin Features:
Manage users (list, create, update, delete).
Manage posts (list, create, update, delete) with image uploads to Cloudinary.
Moderate comments (approve, block, or delete).
View dashboard with analytics.


Technical Features:
REST API secured with JWT (Django REST Framework + SimpleJWT).
PostgreSQL database (configurable with other databases).
Cloudinary for media storage.
Django templates for frontend.
CORS support for API access.



Installation
Follow these steps to set up BlogSpot locally.
Prerequisites

Python 3.8+
PostgreSQL (or another database supported by Django)
Node.js (optional, for frontend asset compilation if needed)
Cloudinary account for media storage
Git

Steps

Clone the Repository:
git clone https://github.com/ashique1213/BlogSpot.git
cd BlogSpot


Create a Virtual Environment:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


Install Dependencies:
pip install -r requirements.txt


Set Up PostgreSQL Database:

Create a database in PostgreSQL:CREATE DATABASE blogspot;

Update database settings in .env (see Configuration).


Apply Migrations:
python manage.py makemigrations
python manage.py migrate


Create a Superuser (Admin):
python manage.py createsuperuser


Run the Development Server:
python manage.py runserver

Access the app at http://localhost:8000.


Configuration

Create a .env File:Copy the example environment file and update it with your settings:
cp .env.example .env
  *x* ```bash
mv .env.example .env


Update .env with the following:
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://user:password@localhost:5432/blogspot
CLOUDINARY_URL=cloudinary://api-key:api-secret@cloud-name
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000


Cloudinary Setup:

Sign up at Cloudinary.
Get your API key, secret, and cloud name from the Cloudinary dashboard.
Add the CLOUDINARY_URL to .env.

Usage

User Access:

Visit http://localhost:8000/ to view the homepage.
Register at http://localhost:8000/register/.
Log in at http://localhost:8000/login/.
Browse blogs at http://localhost:8000/blogs/.
View a specific blog at http://localhost:8000/blogs/<id>/ and add comments or likes.


Admin Access:

Log in at http://localhost:8000/admin-login/.
Access the admin dashboard at http://localhost:8000/admin-dashboard/.
Manage users at http://localhost:8000/admin-users/.
Manage posts at http://localhost:8000/admin-posts/.
Moderate comments at http://localhost:8000/admin-comments/.

Django Admin:

Access the Django admin interface at http://localhost:8000/admin/ using superuser credentials.

API Endpoints
The REST API is secured with JWT. Obtain a token by logging in via /api/auth/login/.
Authentication

POST /api/auth/register/: Register a new user.
POST /api/auth/login/: Log in and receive JWT tokens.
POST /api/auth/admin-login/: Admin login.
POST /api/auth/logout/: Log out.

Blog Posts

GET /api/blogs/: List all published posts.
GET /api/blogs/<id>/: Get post details.
POST /api/blogs/<id>/like/: Like or unlike a post.

Admin APIs

GET /api/admin/dashboard-data/: Admin dashboard analytics.
GET, POST /api/admin/users/: List or create users.
GET, PUT, DELETE /api/admin/users/<id>/: Retrieve, update, or delete a user.
GET, POST /api/admin/posts/: List or create posts.
GET, PUT, DELETE /api/admin/posts/<id>/: Retrieve, update, or delete a post.
GET, POST /api/comments/: List or create comments.
GET, PUT, DELETE /api/comments/<id>/: Retrieve, update, or delete a comment.

See CONTRIBUTING.md for more details.
License
This project is licensed under the MIT License - see LICENSE for details.
