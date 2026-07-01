# BlogSpot

A full-stack Content Management System (CMS) for publishing and sharing blog posts with user and admin functionalities.

## Overview

BlogSpot is a modern CMS designed for seamless blog post creation, management, and interaction. Users can read, like, comment, and share posts, while administrators have tools to manage users, posts, and comments. The system features a secure REST API with Django REST Framework, JWT authentication, Cloudinary for media storage, and a responsive frontend built with React, Vite, and Tailwind CSS.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
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
- **Backend:** Secure REST API using Django REST Framework and SimpleJWT for authentication.
- **Frontend:** Modern, responsive UI built with React 19, Vite, TypeScript, and Tailwind CSS.
- **Database:** PostgreSQL database (configurable for other databases).
- **Storage:** Cloudinary integration for efficient media storage and delivery.
- **Security:** CORS support for cross-origin API access.

## Project Structure

The repository contains two main directories:
- `blogspot/`: The Django backend application (API).
- `frontend/`: The React/Vite frontend application (UI).

## Installation

Follow these steps to set up BlogSpot on your local machine.

### Prerequisites
- Python 3.8 or higher
- Node.js (v18 or higher recommended)
- PostgreSQL (or another Django-supported database)
- Cloudinary account for media storage
- Git

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ashique1213/BlogSpot.git
   cd BlogSpot
   ```

2. **Backend Setup**:
   ```bash
   # Create and activate a virtual environment in the root directory
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt
   
   # Navigate to the backend project directory
   cd blogspot

   # Apply Migrations
   python manage.py makemigrations
   python manage.py migrate

   # Create a Superuser (Admin)
   python manage.py createsuperuser

   # Run the Backend Development Server
   python manage.py runserver
   ```
   - The API will be accessible at `http://localhost:8000`.

3. **Frontend Setup**:
   ```bash
   # Open a new terminal and navigate to the frontend directory
   cd frontend

   # Install Node.js dependencies
   npm install

   # Run the Frontend Development Server
   npm run dev
   ```
   - The UI will be accessible at `http://localhost:5173`.

## Configuration

1. **Backend Environment Variables**:
   - Navigate to `blogspot/blogspot/` and create a `.env` file (you can copy an example if provided).
   - Update `.env` with your settings:
     ```env
     DEBUG=True
     SECRET_KEY=your-secret-key
     DATABASE_NAME=blogspot
     DATABASE_USER=postgres
     DATABASE_PASSWORD=your_password
     DATABASE_HOST=localhost
     DATABASE_PORT=5432
     DATABASE_URL=postgresql://user:password@localhost:5432/blogspot
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```

2. **Cloudinary Setup**:
   - Sign up at [Cloudinary](https://cloudinary.com).
   - Retrieve your API key, API secret, and cloud name from the Cloudinary dashboard.
   - Add the Cloudinary variables to the `.env` file.

3. **Database Setup**:
   - Create a PostgreSQL database matching the credentials provided in your `.env` file.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.
