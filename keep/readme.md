# Blog App (Frontend + Backend + Seeded MongoDB)

This project is a full-stack blog application composed of:

- A React frontend
- An Express + MongoDB backend API
- A MongoDB database pre-seeded with initial data
- Mongo Express for web-based DB management
- Dockerized for local development and production

---

## 📁 Project Structure

```
blog-api/
├── client/               # React frontend
├── server/               # Express backend
├── mongo/                # Seeded MongoDB image
├── docker-compose.yml    # Multi-container setup
├── README.md             # This file
```

---

## 🚀 Quick Start (Local Docker Compose)

### 🔧 1. Build and Run All Containers

```bash
docker compose up --build
```

- React App: [http://localhost:3001](http://localhost:3001)
- Blog API: [http://localhost:3000](http://localhost:3000)
- Mongo Express: [http://localhost:8081](http://localhost:8081)
  - **Username**: `admin`
  - **Password**: `password123`

### 🛑 2. Stop All Containers

```bash
docker compose down -v
```

---

## 🐳 Docker Images

| Component      | Docker Hub Image                  |
| -------------- | --------------------------------- |
| Frontend       | `neyo55/blog-api-frontend:latest` |
| Backend        | `neyo55/blog-api-backend:latest`  |
| MongoDB Seeded | `neyo55/mongo-seeded:latest`      |

---

## 🧪 CRUD Verification

You can verify the end-to-end flow by:

- Visiting the frontend (create/view posts)
- Backend receives request and stores data
- MongoDB reflects data changes
- Mongo Express lets you view/edit DB entries

---

## 🔐 Mongo Express Login Tips

- Accessing `http://localhost:8081` prompts for login
- If you're not prompted:
  - Try incognito mode
  - Visit `http://logout:logout@localhost:8081` to reset cached credentials

---

## 🔁 CI/CD (Coming Soon)

This section will cover:

- GitHub Actions or GitLab CI for build/test/lint
- Automated Docker image push on commit/tag
- Environment variable handling for staging/production

---

## ☁️ Cloud Deployment: AWS ECS with Fargate

**Coming in next phase:**

- Terraform files for ECS cluster + Fargate services
- Pushing images to AWS ECR
- Creating a load-balanced service for frontend/backend
- MongoDB will use `mongo-seeded` image or Amazon DocumentDB (optional upgrade)

---

## 🧾 Default Credentials Summary

| Purpose           | Username | Password      |
| ----------------- | -------- | ------------- |
| MongoDB Root User | `admin`  | `password123` |
| Mongo Express Web | `admin`  | `password123` |

---

## ✨ Contributions

This project was containerized, tested, and deployed by **Rufai Kabiru Adeniyi** as part of a full-stack Docker infrastructure workflow.

---

## 🧼 Cleaning Seed Data (Optional)

To clean up initial posts from the database, use:

```bash
# Open Mongo Express
# Select "blog-db" → "posts" → delete entries manually
```

---

For support or further questions, please contact: **adeniyirufai.dev[at]gmail.com**

