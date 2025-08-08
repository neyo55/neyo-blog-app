# Deployment Guide: Full Stack Blog App (React + Node.js + MongoDB) on 3-Tier AWS EC2 Infrastructure

This guide walks you through deploying a containerized full stack blog application on 3 separate EC2 instances within the same VPC using a 3-tier architecture:

- **Frontend (React)** hosted in **eu-west-1a**
- **Backend (Node.js)** hosted in **eu-west-1b**
- **Database (MongoDB)** hosted in **eu-west-1b**

Each tier is deployed on its own instance using Docker and systemd for automatic startup and resilience.

---

## 1. Folder Structure Overview

```
blog-api/
├── docker-compose.yml              # Only used for local/dev environments
├── .env.production                 # Production .env file
├── backend/
│   ├── Dockerfile
│   ├── .env
│   └── app.js
├── frontend/client/
│   ├── Dockerfile
│   ├── .env
│   └── src/
└── database/mongo/
    ├── Dockerfile
    ├── init/
    │   ├── init-admin.js
    │   ├── init-user.js
    │   └── seed.js
```

---

## 2. Step-by-Step Deployment (Starting with Database Tier)

### Database Tier (MongoDB)

#### A. Files Required (inside `database/mongo/`):

- `Dockerfile`
- `init/` folder with JS seed scripts

#### B. `Dockerfile`:

```Dockerfile
FROM mongo:7.0
COPY init/ /docker-entrypoint-initdb.d/
CMD ["mongod"]
```

#### C. `install.sh` (Pre-installed on EC2 MongoDB instance):

```bash
#!/bin/bash
set -e

sudo apt update -y
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
```

#### D. `docker-compose.yml` (for DB tier instance only):

```yaml
version: '3.8'
services:
  mongo:
    build: ./database/mongo
    container_name: blog-db
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    restart: unless-stopped
```

#### E. `mongo.service` (Systemd unit on DB EC2 instance):

```ini
[Unit]
Description=MongoDB Container Service
Requires=docker.service
After=docker.service

[Service]
Restart=always
ExecStart=/usr/bin/docker compose -f /home/ubuntu/blog-api/docker-compose.yml up --build
ExecStop=/usr/bin/docker compose -f /home/ubuntu/blog-api/docker-compose.yml down
WorkingDirectory=/home/ubuntu/blog-api
TimeoutStartSec=0
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

#### F. Enable and Start Service

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable mongo.service
sudo systemctl start mongo.service
```

---

### Backend Tier (Node.js)

#### A. Files Required (inside `backend/`):

- `Dockerfile`
- `.env`
- `app.js`

#### B. `Dockerfile`:

```Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### C. `.env.production`:

```env
MONGO_URI=mongodb://admin:password123@<DB_INSTANCE_PUBLIC_IP>:27017/blog-db?authSource=admin
BACKEND_PORT=3000
```

#### D. `docker-compose.yml` (Backend tier only):

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    container_name: blog-backend
    ports:
      - "3000:3000"
    env_file:
      - ./backend/.env
    restart: unless-stopped
```

#### E. `backend.service` (Systemd unit on Backend EC2 instance):

```ini
[Unit]
Description=Backend Container Service
Requires=docker.service
After=docker.service

[Service]
Restart=always
ExecStart=/usr/bin/docker compose -f /home/ubuntu/blog-api/docker-compose.yml up --build
ExecStop=/usr/bin/docker compose -f /home/ubuntu/blog-api/docker-compose.yml down
WorkingDirectory=/home/ubuntu/blog-api
TimeoutStartSec=0
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

#### F. Enable and Start Backend

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable backend.service
sudo systemctl start backend.service
```

---

### Frontend Tier (React)

#### A. Files Required (inside `frontend/client/`):

- `Dockerfile`
- `.env`

#### B. `Dockerfile`:

```Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3001
CMD ["serve", "-s", "build", "-l", "3001"]
```

#### C. `.env.production`:

```env
REACT_APP_API_BASE_URL=http://<BACKEND_INSTANCE_PUBLIC_IP>:3000/api
FRONTEND_PORT=3001
```

#### D. `docker-compose.yml` (Frontend tier only):

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend/client
    container_name: blog-frontend
    ports:
      - "3001:3001"
    env_file:
      - ./frontend/client/.env
    restart: unless-stopped
```

#### E. `frontend.service` (Systemd unit on Frontend EC2 instance):

```ini
[Unit]
Description=Frontend Container Service
Requires=docker.service
After=docker.service

[Service]
Restart=always
ExecStart=/usr/bin/docker compose -f /home/ubuntu/blog-api/docker-compose.yml up --build
ExecStop=/usr/bin/docker compose -f /home/ubuntu/blog-api/docker-compose.yml down
WorkingDirectory=/home/ubuntu/blog-api
TimeoutStartSec=0
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

#### F. Enable and Start Frontend

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable frontend.service
sudo systemctl start frontend.service
```

---

## 3. Final Checklist

- ✅ Make sure each EC2 instance has port 27017, 3000, and 3001 open in the security group
- ✅ Use instance `user_data` to run the `install.sh` on boot
- ✅ Replace `<BACKEND_INSTANCE_PUBLIC_IP>` and `<DB_INSTANCE_PUBLIC_IP>` with the actual public IPs
- ✅ Validate cross-tier communication using curl or logs

---

## 4. Useful Debug Commands

```bash
# View logs
journalctl -u mongo.service
journalctl -u backend.service
journalctl -u frontend.service

# Restart services
sudo systemctl restart mongo.service
sudo systemctl restart backend.service
sudo systemctl restart frontend.service

# Check running containers
docker ps
```



