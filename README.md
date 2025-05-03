Thanks for sharing the full project structure. Based on your code, APIs, models, views, and project description, here's a professional and well-structured `README.md` file tailored to your CMS blog application named **BlogSpot**.

---

````markdown
# BlogSpot 

BlogSpot is a simple yet powerful **Content Management System (CMS)** for blogging. It allows users to read, comment, and like blog posts, while admins can manage users, posts, and comments through a clean interface. Built using **Django**, **Django REST Framework**, **JWT**, and **Cloudinary**.

---

##  Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Admin Features](#admin-features)
- [User Features](#user-features)
- [Media Handling](#media-handling)
- [Project Structure](#project-structure)
- [License](#license)

---

##  Features

-  User and Admin Authentication (JWT)
-  Blog Post Management (Create, Read, Update, Delete)
-  Comments with Approval System
-  Like/Unlike & Read Count Tracking
-  Admin Dashboard
-  REST API + Django Template Frontend
-  Media Uploads to Cloudinary

---

## 🛠 Tech Stack

| Layer         | Tech Used                                 |
|--------------|-------------------------------------------|
| Backend       | Django, Django REST Framework, JWT       |
| Frontend      | Django Templates (HTML, CSS)             |
| Database      | PostgreSQL                               |
| Media Storage | Cloudinary                               |
| Deployment    | Docker + Gunicorn + Whitenoise (optional)|
| Auth          | JWT (SimpleJWT)                          |

---

##  Setup Instructions

1. **Clone the Repo**
   ```bash
   git clone https://github.com/ashique1213/BlogSpot.git
   cd BlogSpot
````

2. **Create Virtual Environment**

   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**

   Create a `.env` file:

   ```
   SECRET_KEY=your_secret_key
   DEBUG=True
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. **Apply Migrations & Create Superuser**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Run the Server**

   ```bash
   python manage.py runserver
   ```

---

##  API Endpoints

### Authentication

| Endpoint               | Method | Description            |
| ---------------------- | ------ | ---------------------- |
| /api/auth/register/    | POST   | Register new user      |
| /api/auth/login/       | POST   | User login             |
| /api/auth/admin-login/ | POST   | Admin login            |
| /api/auth/logout/      | POST   | Logout (JWT blacklist) |

### Blog API

| Endpoint              | Method | Description        |
| --------------------- | ------ | ------------------ |
| /api/blogs/           | GET    | List blog posts    |
| /api/blogs/<pk>/      | GET    | Get single post    |
| /api/blogs/<pk>/like/ | POST   | Like/Unlike a post |
| /api/comments/        | POST   | Add comment        |

### Admin API

| Endpoint                   | Method     | Description            |
| -------------------------- | ---------- | ---------------------- |
| /api/admin/posts/          | GET/POST   | List/Create posts      |
| /api/admin/posts/<pk>/     | PUT/DELETE | Update/Delete post     |
| /api/comments/<pk>/        | PUT        | Approve/Block comments |
| /api/admin/users/          | GET        | List all users         |
| /api/admin/users/<pk>/     | PUT/DELETE | Manage specific user   |
| /api/admin/dashboard-data/ | GET        | Dashboard stats        |

---

##  Admin Features

* Login using admin credentials
* View and manage users
* Create, edit, and delete blog posts
* Approve or block comments
* Access dashboard data like post count, user count, likes, reads

---

##  User Features

* Register and login
* View list of published blog posts
* Read full blog post
* Like/unlike posts
* Comment on posts (pending approval)

---

##  Media Handling

* Blog post images are stored in **Cloudinary**
* Use `CloudinaryField` for image uploads in `Post` model
* Configure credentials in `.env`

---

##  Project Structure

```
BlogSpot/
├── authentication/
│   ├── urls.py
│   ├── views.py
│   └── models.py
├── blog/
│   ├── urls.py
│   ├── views.py
│   └── models.py
├── templates/
│   ├── blog_list.html
│   ├── blog_detail.html
│   ├── login.html
│   └── dashboard.html
├── manage.py
├── requirements.txt
└── README.md
```

---

##  License

This project is for educational/demo purposes and not licensed for commercial use yet.

---

```

Let me know if you'd like me to turn this into a downloadable file or help with writing deployment instructions.
```
