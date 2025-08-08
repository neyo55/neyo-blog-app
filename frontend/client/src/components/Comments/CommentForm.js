import React, { useState, useContext } from 'react';
import api from '../../utils/api';
import { AuthContext } from '../../contexts/AuthContext';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to comment.');
      return;
    }
    try {
      await api.post(`/posts/${postId}/comments`, { content });
      setContent('');
      onCommentAdded();
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
        required
      />
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600">
        Post Comment
      </button>
    </form>
  );
};

export default CommentForm;