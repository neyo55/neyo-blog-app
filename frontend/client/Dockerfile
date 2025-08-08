# Use official Node.js 18 Alpine image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Accept build-time environment variable
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Install curl for healthcheck
RUN apk add --no-cache curl

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build app
COPY . .
RUN npm run build

# Serve the app with 'serve'
RUN npm install -g serve

# Final stage: clean and deploy lightweight container
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/build ./build
RUN npm install -g serve

# Healthcheck: ping local container web port
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --spider -q http://localhost:3001 || exit 1

EXPOSE 3001

CMD ["serve", "-s", "build", "-l", "3001"]








# # Use official Node.js 18 image
# FROM node:18-alpine

# # Set working directory
# WORKDIR /app

# # Accept build-time env var
# ARG REACT_APP_API_BASE_URL
# ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}

# # Install curl for health checks
# RUN apk add --no-cache curl

# # Copy package.json and install dependencies
# COPY package*.json ./
# RUN npm install && ls -la node_modules/react-scripts
# # RUN npm install && ls -la node_modules/react-scripts

# # Install serve globally
# RUN npm install -g serve
# # RUN npm install --omit=dev


# # Copy application code
# COPY . .

# # Build the application
# RUN npm run build

# # Expose port
# EXPOSE 3001

# # Start the app
# CMD ["npx", "serve", "-s", "build", "-l", "3001"]



