#!/bin/bash

# Define absolute or relative path to this script's directory
BASE_DIR=$(dirname "$0")

echo "Seeding MongoDB..."

# Connect and run each initialization script
mongosh < "$BASE_DIR/init/init-admin.js"
mongosh < "$BASE_DIR/init/init-user.js"
mongosh < "$BASE_DIR/init/seed.js"

echo "✅ MongoDB seeding complete."
