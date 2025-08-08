# Blog App Front-End Setup

This artifact provides the React front-end files and instructions to run and connect it to the Blog API backend and MongoDB database.

## Project Structure
- `client/src/App.js`: Main React component for the Blog App UI.
- `client/src/App.css`: Styles for the UI.
- `client/package.json`: Dependencies including Axios.

## Front-End Files

### client/src/App.js
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:3000/api/posts/${editId}`, { title, content });
        setEditId(null);
      } else {
        await axios.post('http://localhost:3000/api/posts', { title, content });
      }
      setTitle('');
      setContent('');
      fetchPosts();
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditId(post._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div className="App">
      <h1>Blog App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <button type="submit">{editId ? 'Update Post' : 'Create Post'}</button>
      </form>
      <div className="posts">
        {posts.map((post) => (
          <div key={post._id} className="post">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
```

### client/src/App.css
```css
.App {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

input, textarea {
  padding: 10px;
  font-size: 16px;
}

textarea {
  height: 100px;
  resize: vertical;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
}

.post h2 {
  margin: 0 0 10px;
}

.post p {
  margin: 0 0 10px;
}
```

## Instructions to Run and Connect Front-End

### Prerequisites
- MongoDB container running:
  ```bash
  docker run -d --name mongo -p 27017:27017 -v mongo-data:/data/db mongo:latest
  ```
- Backend running at `http://localhost:3000`:
  ```bash
  cd blog-api
  npm start
  ```

### Setup
1. **Create React App**:
   ```bash
   npx create-react-app client
   ```
2. **Install Axios**:
   ```bash
   cd client
   npm install axios
   cd ..
   ```
3. **Save Files**:
   - Replace `client/src/App.js` and `client/src/App.css` with the provided code.
4. **Run Front-End**:
   ```bash
   cd client
   npm start
   ```
   - Opens `http://localhost:3001` in your browser.

### Testing
- **Create Posts**:
  - Enter a title and content, click “Create Post”.
  - Post should appear in the list.
- **Edit Posts**:
  - Click “Edit”, update fields, click “Update Post”.
- **Delete Posts**:
  - Click “Delete”, post should disappear.
- **Verify in MongoDB**:
  - Check posts via API:
    ```bash
    curl http://localhost:3000/api/posts
    ```
  - Or use `mongosh`:
    ```bash
    docker exec -it mongo mongosh
    use blog-api
    db.posts.find()
    ```

## Troubleshooting
- **CORS Errors**:
  - Ensure `cors` is in `app.js` and installed:
    ```bash
    npm install cors
    ```
- **Connection Errors**:
  - Verify backend is running (`curl http://localhost:3000`).
  - Check MongoDB container (`docker ps`).
- **Port Conflicts**:
  ```bash
  netstat -aon | findstr :3001
  taskkill /PID <pid> /F
  ```