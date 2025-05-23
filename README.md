# BlogSpot

A Content Management System (CMS) for publishing and sharing blog posts with user and admin functionalities.

## Overview

BlogSpot is a Django-based CMS designed for seamless blog post creation, management, and interaction. Users can read, like, comment, and share posts, while administrators have tools to manage users, posts, and comments. The system features a secure REST API with JWT authentication, Cloudinary for media storage, and a responsive frontend built with Django templates.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [License](#license)

## Features

### User Features
- Browse and read blog posts with images and view read counts.
- Like or unlike posts.
- Add comments (subject to admin approval).
- Register and log in to access personalized features.

### Admin Features
- Manage users (create, update, delete, and list).
- Create, edit, and delete blog posts with image uploads to Cloudinary.
- Moderate comments (approve, block, or delete).
- Access a dashboard with analytics on posts, users, and engagement.

### Technical Features
- Secure REST API using Django REST Framework and SimpleJWT for authentication.
- PostgreSQL database (configurable for other databases).
- Cloudinary integration for efficient media storage and delivery.
- Frontend built with Django templates for rapid development and customization.
- CORS support for cross-origin API access.

## Installation

Follow these steps to set up BlogSpot on your local machine.

### Prerequisites
- Python 3.8 or higher
- PostgreSQL (or another Django-supported database)
- Cloudinary account for media storage
- Git
- Node.js (optional, for frontend asset compilation)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ashique1213/BlogSpot.git
   cd BlogSpot
   ```

2. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up PostgreSQL Database**:
   - Create a database:
     ```sql
     CREATE DATABASE blogspot;
     ```
   - Configure database settings in the `.env` file (see [Configuration](#configuration)).

5. **Apply Migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create a Superuser (Admin)**:
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the Development Server**:
   ```bash
   python manage.py runserver
   ```
   - Access the app at `http://localhost:8000`.

## Configuration

1. **Create a `.env` File**:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Alternatively, rename the example file:
     ```bash
     mv .env.example .env
     ```

2. **Update `.env` with Your Settings**:
   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key
   DATABASE_URL=postgres://user:password@localhost:5432/blogspot
   CLOUDINARY_URL=cloudinary://api-key:api-secret@cloud-name
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
   ```

3. **Cloudinary Setup**:
   - Sign up at [Cloudinary](https://cloudinary.com).
   - Retrieve your API key, API secret, and cloud name from the Cloudinary dashboard.
   - Add the `CLOUDINARY_URL` to the `.env` file.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.
