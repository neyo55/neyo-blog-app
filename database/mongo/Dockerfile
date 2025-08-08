FROM mongo:7.0

# Install mongosh
RUN apt-get update && \
    apt-get install -y wget gnupg && \
    wget -qO - https://pgp.mongodb.com/server-7.0.asc | gpg --dearmor > /usr/share/keyrings/mongodb-server-7.0.gpg && \
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian bullseye/mongodb-org/7.0 main" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list && \
    apt-get update && \
    apt-get install -y mongodb-mongosh

CMD ["mongod", "--config", "/etc/mongo/mongod.conf"]








# FROM mongo:7.0

# # Copy seed files into container's init folder
# COPY init/ /docker-entrypoint-initdb.d/

# # Install MongoDB Shell (mongosh) for MongoDB 7.0
# RUN apt-get update && apt-get install -y gnupg curl && \
#     curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.gpg && \
#     echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list && \
#     apt-get update && apt-get install -y mongodb-mongosh

# CMD ["mongod"]