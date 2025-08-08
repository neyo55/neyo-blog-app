
---

# ✅ Full CI/CD Deployment Workflow for `blog-database`

### 🚀 Goal:

Deploy the contents of your private GitHub repo (`https://github.com/neyo55/blog-database`) to a Dockerized EC2 instance using **GitHub Actions + SSH Deploy Key**.

---

## 🔐 Step 1: Generate a General SSH Key (Local → EC2)

This key will allow **GitHub Actions** to SSH into your EC2 instance.

### On your **local machine**:

```bash
ssh-keygen -t rsa -b 4096 -C "ec2-access" -f ~/.ssh/ec2-github-actions
```

This creates:

* **Private key**: `~/.ssh/ec2-github-actions`
* **Public key**: `~/.ssh/ec2-github-actions.pub`
* **Use this command to view the public key**: `cat ~/.ssh/ec2-github-actions.pub`
* **Use this command to view the private key**: `cat ~/.ssh/ec2-github-actions`

---

## 🔐 Step 2: Add Public Key to EC2 (for GitHub Actions to connect)

SSH into your EC2 instance:

```bash
ssh ubuntu@<EC2_PUBLIC_IP>
```

Append the **public key** to the authorized keys:

```bash
mkdir -p ~/.ssh
echo "<PASTE ec2-github-actions.pub CONTENT HERE>" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

✅ GitHub Actions can now SSH into your EC2 instance.

---

## 🔐 Step 3: Add EC2 Access Credentials to GitHub Repo Secrets

In your **GitHub repo** (`blog-database`):

Go to:
**Settings → Secrets and variables → Actions**

Click **“New repository secret”** and add the following:

| Name          | Value                                         |
| ------------- | --------------------------------------------- |
| `EC2_HOST`    | `176.34.146.211` (your EC2 public IP)         |
| `EC2_USER`    | `ubuntu` (or your EC2 username)               |
| `EC2_PRIVATE_SSH_KEY` | Paste contents of `~/.ssh/ec2-github-actions` |

✅ Now GitHub Actions can connect to EC2 during workflow.

---

## 🔑 Step 4: Create a Deploy Key on your local system for GitHub Repo Access (Used by EC2)

This key allows **your EC2 instance** to pull the GitHub repository during deployment.

### On your **local machine**:

```bash
ssh-keygen -t rsa -b 4096 -C "backend-deploy-key" -f ~/.ssh/backend-github-actions
```

* **Private key**: `~/.ssh/backend-github-actions`
* **Public key**: `~/.ssh/backend-github-actions.pub`
* **Use this command to view the public key**: `cat ~/.ssh/backend-github-actions.pub`
* **Use this command to view the private key**: `cat ~/.ssh/backend-github-actions`

---

## 🔐 Step 5: Add Deploy Public Key to GitHub

Go to your GitHub repo:
**Settings → Deploy Keys → Add deploy key**

* **Title**: `GITHUB_SSH_KEY`
* **Key**: Paste contents of `~/.ssh/backend-github-actions.pub`
* ✅ Check `Allow write access`

---

## 📥 Step 6: Copy Deploy Private Key to EC2

SSH into your EC2 instance again:

```bash
ssh ubuntu@176.34.146.211
```

Create the file:

```bash
mkdir -p ~/.ssh
nano ~/.ssh/backend-github-actions
```

Paste the **private key** contents from `~/.ssh/backend-github-actions` (local machine).

Set permissions:

```bash
chmod 600 ~/.ssh/backend-github-actions
```

---

## ⚙️ Step 7: Configure SSH on EC2 to Use Deploy Key

Still on EC2:

```bash
nano ~/.ssh/config
```

Add:

```ssh
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/backend-github-actions
  StrictHostKeyChecking no
```

Test the connection:

```bash
ssh -T git@github.com
```

✅ Expected output:

> `Hi neyo55/blog-database! You've successfully authenticated, but GitHub does not provide shell access.`

---

## 📄 Step 8: Create GitHub Actions Workflow (`.github/workflows/deploy.yml`)

In your repo, create the file:

```yaml
name: Deploy to EC2 (Database Tier)
on:
  push:
    branches:
      - main
jobs:
  deploy:
    name: Deploy on EC2 Instance
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: SSH & Deploy on EC2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            if [ ! -d "blog-database" ]; then
              git clone git@github.com:neyo55/blog-database.git
            fi
            cd blog-database
            git pull origin main
            docker-compose down || docker compose down
            docker-compose build || docker compose build
            docker-compose up -d || docker compose up -d
            echo "Deployment completed successfully!"

```
##### Note: This deploy.yml file works for both `docker-compose` and `docker compose` #####
---

## 🧪 Step 9: Test the Pipeline

1. Push to `main` branch on your GitHub repo:

   ```bash
   git add .
   git commit -m "trigger deployment"
   git push origin main
   ```

2. Go to **Actions** tab in GitHub.

3. Confirm the workflow runs and connects to your EC2 instance.

4. Confirm on EC2:

   ```bash
   docker ps
   ```

✅ Your containers should be running successfully.

---

## 🗃 Summary of All Keys

| Purpose                             | Location Generated | Public Key Destination                | Private Key Used By                  |
| ----------------------------------- | ------------------ | ------------------------------------- | ------------------------------------ |
| **EC2 Access (GitHub → EC2)**       | Local machine      | `~/.ssh/authorized_keys` on EC2       | GitHub Secret: `EC2_SSH_KEY`         |
| **GitHub Repo Pull (EC2 → GitHub)** | Local machine      | GitHub Repo Deploy Key (write access) | Copied to EC2 as `~/.ssh/github-ec2` |

---

