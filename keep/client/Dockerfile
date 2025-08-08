# Use official Node.js 18 image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install && ls -la node_modules/react-scripts

# Install serve globally
RUN npm install -g serve

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3001

# Start the app
CMD ["npx", "serve", "-s", "build", "-l", "3001"]



