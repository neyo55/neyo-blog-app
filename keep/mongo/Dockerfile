FROM mongo:7.0

# Set default env for MongoDB root user
ENV MONGO_INITDB_ROOT_USERNAME=admin
ENV MONGO_INITDB_ROOT_PASSWORD=password123
ENV MONGO_INITDB_DATABASE=blog-db

# Copy seed script into container's init folder
COPY init/ /docker-entrypoint-initdb.d/
