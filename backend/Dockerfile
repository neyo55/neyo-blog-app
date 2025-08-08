# Use official Node.js 18 image
FROM node:18-alpine

# Set working directory
WORKDIR /app
# WORKDIR /usr/src/app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]



