import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import PostForm from '../components/Posts/PostForm';

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  if (!user) {
    return <p className="text-center text-red-500 mt-4">Please sign in to create a post.</p>;
  }

  const handleSave = async (postData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`,
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) throw new Error('Failed to save post');
      const data = await response.json();
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Create New Post</h1>
      {error && <p className="text-red-500">{error}</p>}
      <PostForm onSave={handleSave} />
    </div>
  );
};

export default CreatePost;