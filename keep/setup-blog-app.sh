#!/bin/bash

# === CONFIGURATION ===
REPO_URL="https://github.com/yourusername/blog-api.git"  # Change this to your repo if needed
APP_DIR="$HOME/blog-api"
FRONTEND_ENV_FILE="$APP_DIR/frontend/client/.env"
BACKEND_ENV_FILE="$APP_DIR/backend/.env"
SERVER_IP=$(curl -s http://checkip.amazonaws.com)
MONGO_URI="mongodb://localhost:27017/blog"
API_BASE_URL="http://$SERVER_IP:3000/api"

# === UPDATE & INSTALL DEPENDENCIES ===
sudo apt update && sudo apt install -y nodejs npm mongodb git

# === CLONE OR USE EXISTING REPO ===
if [ ! -d "$APP_DIR" ]; then
  git clone "$REPO_URL" "$APP_DIR"
fi

# === BACKEND SETUP ===
cd "$APP_DIR/backend" || exit
cp .env.example .env 2>/dev/null || true
cat > "$BACKEND_ENV_FILE" <<EOF
PORT=3000
MONGODB_URI=$MONGO_URI
EOF

npm install

# === FRONTEND SETUP ===
cd "$APP_DIR/frontend/client" || exit
cp .env.example .env 2>/dev/null || true
cat > "$FRONTEND_ENV_FILE" <<EOF
REACT_APP_API_BASE_URL=$API_BASE_URL
EOF

npm install
npm run build

# === START MONGODB ===
sudo systemctl enable mongodb
sudo systemctl start mongodb

# === START BACKEND ===
cd "$APP_DIR/backend"
nohup npm start > backend.log 2>&1 &

# === SERVE FRONTEND (Static Build) ===
cd "$APP_DIR/frontend/client"
npm install -g serve
nohup serve -s build -l 3001 > frontend.log 2>&1 &

# === DONE ===
echo "✅ Setup complete."
echo "🌐 Frontend: http://$SERVER_IP:3001"
echo "🔌 Backend:  http://$SERVER_IP:3000/api"
