# Blog API Project

This is a Node.js Blog API built with Express.js, providing CRUD operations for blog posts stored in memory. It includes all files needed to run and test locally, Docker configuration for containerization, and guidance for deploying to AWS ECS using GitHub Actions.

## Project Structure
- `app.js`: Main application file with Express setup and routes.
- `package.json`: Node.js dependencies and scripts.
- `routes/posts.js`: Defines API routes for blog posts.
- `Dockerfile`: Instructions to build the Docker image.
- `docker-compose.yml`: Orchestrates the app container.
- `.gitignore`: Excludes unnecessary files from Git.

## Application Files

### app.js
```javascript
const express = require('express');
const postsRouter = require('./routes/posts');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/posts', postsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Blog API!');
});

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;
```

### package.json
```json
{
  "name": "blog-api",
  "version": "1.0.0",
  "description": "A simple Blog API with CRUD operations",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "test": "cross-env NODE_ENV=test jest"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "cross-env": "^7.0.3",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  },
  "author": "",
  "license": "ISC"
}
```

### routes/posts.js
```javascript
const express = require('express');
const router = express.Router();

// In-memory storage for blog posts
let posts = [];
let idCounter = 1;

// Get all posts
router.get('/', (req, res) => {
  res.json(posts);
});

// Get a single post by ID
router.get('/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
});

// Create a new post
router.post('/', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  const post = { id: idCounter++, title, content, createdAt: new Date() };
  posts.push(post);
  res.status(201).json(post);
});

// Update a post
router.put('/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: 'Post not found' });
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  post.title = title;
  post.content = content;
  post.updatedAt = new Date();
  res.json(post);
});

// Delete a post
router.delete('/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Post not found' });
  posts.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
```

### .gitignore
```
node_modules/
.env
```

## Instructions to Run and Test Locally

### Prerequisites
- Node.js (v18 or later) installed.
- npm (comes with Node.js).
- Postman or curl for testing API endpoints.

### Setup
1. **Create Project Directory**:
   ```bash
   mkdir blog-api
   cd blog-api
   ```
2. **Save Files**: Copy the above `app.js`, `package.json`, `routes/posts.js`, and `.gitignore` into the `blog-api` directory. Create a `routes` folder for `posts.js`.
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Run the Application**:
   ```bash
   npm start
   ```
   The server will start at `http://localhost:3000`.

### Testing Locally
Use Postman, curl, or a browser to test the API endpoints:
- **GET `/`**: Check if the API is running.
  ```bash
  curl http://localhost:3000
  ```
  Response: `Welcome to the Blog API!`
- **GET `/api/posts`**: List all posts.
  ```bash
  curl http://localhost:3000/api/posts
  ```
  Response: `[]` (initially empty)
- **POST `/api/posts`**: Create a post.
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"title":"My First Post","content":"Hello, world!"}' http://localhost:3000/api/posts
  ```
  Response: `{ "id": 1, "title": "My First Post", "content": "Hello, world!", "createdAt": "2025-06-18T..." }`
- **GET `/api/posts/1`**: Get a specific post.
  ```bash
  curl http://localhost:3000/api/posts/1
  ```
  Response: Same as above.
- **PUT `/api/posts/1`**: Update a post.
  ```bash
  curl -X PUT -H "Content-Type: application/json" -d '{"title":"Updated Post","content":"New content"}' http://localhost:3000/api/posts/1
  ```
  Response: `{ "id": 1, "title": "Updated Post", "content": "New content", "createdAt": "...", "updatedAt": "2025-06-18T..." }`
- **DELETE `/api/posts/1`**: Delete a post.
  ```bash
  curl -X DELETE http://localhost:3000/api/posts/1
  ```
  Response: No content (204 status).

### Optional: Automated Tests
1. Install Jest and Supertest (included in `package.json`).
2. Create a test file `tests/posts.test.js`:
   ```javascript
   const request = require('supertest');
   const app = require('../app');

   describe('Blog API', () => {
     test('GET / should return welcome message', async () => {
       const res = await request(app).get('/');
       expect(res.statusCode).toBe(200);
       expect(res.text).toBe('Welcome to the Blog API!');
     });

     test('POST /api/posts should create a post', async () => {
       const res = await request(app)
         .post('/api/posts')
         .send({ title: 'Test Post', content: 'Test Content' });
       expect(res.statusCode).toBe(201);
       expect(res.body).toHaveProperty('id');
       expect(res.body.title).toBe('Test Post');
     });
   });
   ```
3. Run tests:
   ```bash
   npm test
   ```

## Docker Configuration

### Dockerfile
```dockerfile
# Use official Node.js 18 image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
```

### Docker Setup and Testing
1. **Install Docker**: Ensure Docker Desktop is running.
2. **Save Docker Files**: Place `Dockerfile` and `docker-compose.yml` in the `blog-api` directory.
3. **Build and Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```
4. **Test the API**: Use the same curl/Postman commands as above (e.g., `curl http://localhost:3000`).
5. **Stop Containers**:
   ```bash
   docker-compose down
   ```

## GitHub Actions Workflow for AWS ECS Deployment

### Prerequisites
- AWS account with ECS cluster, task definition, and service set up.
- ECR (Elastic Container Registry) repository for the Docker image.
- AWS IAM user with permissions for ECS, ECR, and GitHub Actions (store credentials in GitHub Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`).
- GitHub repository for the project (e.g., `neyo55/blog-api`).

### Workflow File
Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to AWS ECS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build, tag, and push Docker image to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: blog-api
          IMAGE_TAG: latest
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - name: Update ECS service
        run: |
          aws ecs update-service --cluster blog-api-cluster --service blog-api-service --force-new-deployment
```

### AWS ECS Setup
1. **Create ECR Repository**:
   ```bash
   aws ecr create-repository --repository-name blog-api --region <your-region>
   ```
2. **Create ECS Cluster**:
   ```bash
   aws ecs create-cluster --cluster-name blog-api-cluster --region <your-region>
   ```
3. **Define Task Definition**:
   - Create a JSON file `task-definition.json`:
     ```json
     {
       "family": "blog-api-task",
       "networkMode": "awsvpc",
       "containerDefinitions": [
         {
           "name": "blog-api-container",
           "image": "<your-ecr-repo-uri>:latest",
           "portMappings": [
             {
               "containerPort": 3000,
               "hostPort": 3000
             }
           ],
           "essential": true
         }
       ],
       "requiresCompatibilities": ["FARGATE"],
       "cpu": "256",
       "memory": "512"
     }
     ```
   - Register it:
     ```bash
     aws ecs register-task-definition --cli-input-json file://task-definition.json
     ```
4. **Create ECS Service**:
   - Ensure a VPC, subnets, and security group allow port 3000.
   - Create the service:
     ```bash
     aws ecs create-service --cluster blog-api-cluster --service-name blog-api-service --task-definition blog-api-task --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" --region <your-region>
     ```

### GitHub Actions Setup
1. **Push Code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/<your-username>/blog-api.git
   git push -u origin main
   ```
2. **Add Secrets**:
   - In your GitHub repo, go to Settings > Secrets and variables > Actions.
   - Add `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION` (e.g., `eu-west-1`).
3. **Create Workflow File**:
   - Add `deploy.yml` to `.github/workflows/`.
   - Push changes to trigger the workflow.
4. **Monitor Deployment**:
   - Check the Actions tab in GitHub for build/push logs.
   - Verify in AWS ECS that the service is updated and running.

### Notes
- **Persistence**: This API uses in-memory storage, so posts reset on restart. For production, use a database like MongoDB or MySQL (I can extend the app if needed).
- **Testing**: The test suite is minimal; expand it for production with more edge cases.
- **AWS Costs**: Monitor ECS, ECR, and Fargate usage to stay within the free tier if applicable.
- **Security**: Use least-privilege IAM roles for GitHub Actions and secure your ECS network.