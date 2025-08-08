To test your Dockerized full-stack blog app on a completely new system (e.g. a colleague’s machine or server), follow this step-by-step process:

---

## ✅ **1. Prerequisites**

Make sure the new system has:

* ✅ [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
* ✅ [Docker Compose](https://docs.docker.com/compose/install/) (included in Docker Desktop)

You can verify with:

```bash
docker --version
docker compose version
```

---

## 📦 **2. Pull the Required Docker Images**

From any location, run:

```bash
docker pull neyo55/blog-api-frontend:latest
docker pull neyo55/blog-api-backend:latest
docker pull neyo55/mongo-seeded:latest
```

Alternatively, if the full project (with the `docker-compose.yml`) is cloned:

```bash
git clone <your-repo-url>
cd blog-api
docker compose up --build
```

---

## 🔁 **3. Run the App via Docker Compose**

Ensure you're in the project root (where `docker-compose.yml` is located), then run:

```bash
docker compose up --build
```

This will:

* Start the MongoDB (with seeded post)
* Connect backend to MongoDB via `MONGO_URI`
* Serve frontend and backend
* Expose ports:

  * Frontend: [http://localhost:3001](http://localhost:3001)
  * Backend: [http://localhost:3000](http://localhost:3000)
  * Mongo Express: [http://localhost:8081](http://localhost:8081)

> Login credentials for Mongo Express:
>
> * **Username:** `admin`
> * **Password:** `password123`

---

## ✅ **4. Verify Everything Works**

* Open the **frontend** and create a blog post.
* Open **Mongo Express** to confirm the data was saved in the DB.
* Use `docker ps` to check running containers.
* Use `docker compose down -v` to stop and clean volumes.

---

Would you like me to integrate these steps into your `README.md` under a section like **"🖥 Running on a New Machine"**?
