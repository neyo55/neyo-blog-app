# Full Stack Blog Application Deployment Guide (3-Tier, Dockerized)

This guide walks you through deploying a Full Stack Blog App using a 3-tier containerized architecture:

* **Frontend (React)** - EC2 instance in `eu-west-1a`
* **Backend (Node.js)** - EC2 instance in `eu-west-1b`
* **Database (MongoDB)** - EC2 instance in `eu-west-1b`

All instances reside in the same **VPC** and **public subnets**, with inter-service communication via **private IP addresses**.

---

## ✅ Prerequisites

* AWS VPC with public subnets in `eu-west-1a` and `eu-west-1b`
* EC2 key pair for SSH
* Security groups allowing:

  * React: TCP 80/443
  * Node.js: TCP 3000 (from React instance)
  * MongoDB: TCP 27017 (from Node.js instance)

---

## 🧱 Directory Structure Per Tier

### MongoDB Tier (database instance)

```
database/
├── mongo/
│    ├── Dockerfile
│    ├── .dockerignore
│    └── init/
│        ├── init-admin.js
│        ├── init-user.js
│        └── seed.js
├── .env
└── docker-compose.yml
```

### Backend Tier (Node.js instance)

```
backend/
├── app.js
├── package.json
├── Dockerfile
├── .env
├── .dockerignore
├── docker-compose.yml
├── jest.config.js
├── routes/
└── tests/
```

### Frontend Tier (React instance)

```
frontend/
└── client/
    ├── package.json
    ├── Dockerfile
    ├── .env
    ├── .dockerignore
    ├── docker-compose.yml
    └── public/, src/, etc.
```

---

## 🛠️ Step-by-Step Deployment Instructions

### 1. MongoDB Instance

#### `install.sh`

Place the robust `install.sh` (based on your template) inside the instance or via EC2 user\_data. It must:

* Install Docker and Compose
* Clone the database repo
* Start the `docker-compose` file

#### `.env` Example

```
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=securepass
MONGO_INITDB_DATABASE=blogdb
```

#### `docker-compose.yml`

```yaml
version: '3.8'
services:
  mongo:
    build: ./mongo
    ports:
      - "27017:27017"
    env_file:
      - .env
    volumes:
      - mongo-data:/data/db
      - ./mongo/init:/docker-entrypoint-initdb.d
volumes:
  mongo-data:
```

#### `systemd` service

Save as `/etc/systemd/system/mongodb.service`:

```ini
[Unit]
Description=MongoDB Docker Compose Service
After=docker.service
Requires=docker.service

[Service]
Restart=always
User=ubuntu
WorkingDirectory=/home/ubuntu/database
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down

[Install]
WantedBy=multi-user.target
```

Enable:

```bash
sudo systemctl daemon-reexec
sudo systemctl enable mongodb.service
sudo systemctl start mongodb.service
```

---

### 2. Backend (Node.js)

#### `.env` Example

```
PORT=3000
MONGO_URI=mongodb://<MongoDB-PRIVATE-IP>:27017/blogdb
```

#### `docker-compose.yml`

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
```

#### `systemd` Service

`/etc/systemd/system/nodeapi.service`

```ini
[Unit]
Description=Node.js Backend Docker Compose Service
After=docker.service
Requires=docker.service

[Service]
Restart=always
User=ubuntu
WorkingDirectory=/home/ubuntu/backend
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down

[Install]
WantedBy=multi-user.target
```

Enable:

```bash
sudo systemctl enable nodeapi.service
sudo systemctl start nodeapi.service
```

---

### 3. Frontend (React)

#### `.env` Example

```
REACT_APP_API_URL=http://<NodeJS-PRIVATE-IP>:3000
```

#### `docker-compose.yml`

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    env_file:
      - .env
```

#### `systemd` Service

`/etc/systemd/system/frontend.service`

```ini
[Unit]
Description=React Frontend Docker Compose Service
After=docker.service
Requires=docker.service

[Service]
Restart=always
User=ubuntu
WorkingDirectory=/home/ubuntu/frontend/client
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down

[Install]
WantedBy=multi-user.target
```

Enable:

```bash
sudo systemctl enable frontend.service
sudo systemctl start frontend.service
```

---

## ✅ Validation Steps

1. **MongoDB**: SSH into DB instance and run:

```bash
sudo docker ps
mongo --username admin --password securepass --authenticationDatabase admin
```

2. **Node.js**: Check backend API:

```bash
curl http://localhost:3000/posts
```

3. **React**: Visit Public IP of frontend EC2 in browser

---

## 📘 Next Steps

* SSL with Certbot on Frontend
* Use Nginx reverse proxy if needed
* Store sensitive secrets in AWS Parameter Store or Secrets Manager

---

Let me know when you're ready to generate the final `install.sh` for each tier.
