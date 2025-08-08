import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editComment, setEditComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${id}`);
        const data = await response.json();
        setPost(data);
        setComments(data.comments || []);
      } catch (err) {
        console.error('Failed to fetch post:', err);
      }
    };
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`,
        },
        body: JSON.stringify({ content: newComment, parentId: null }),
      });
      const data = await response.json();
      setComments([...comments, data]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await fetch(`http://localhost:3000/api/posts/${id}/comments/${commentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`,
          },
        });
        setComments(comments.filter(c => c._id !== commentId));
      } catch (err) {
        console.error('Failed to delete comment:', err);
      }
    }
  };

  const handleEditComment = (comment) => {
    setEditComment(comment._id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`,
        },
        body: JSON.stringify({ content: editContent }),
      });
      const updatedComment = await response.json();
      setComments(comments.map(c => c._id === commentId ? updatedComment : c));
      setEditComment(null);
      setEditContent('');
    } catch (err) {
      console.error('Failed to edit comment:', err);
    }
  };

  const renderComments = (commentsList) => {
    return commentsList.map(comment => (
      <div key={comment._id} className="ml-4 p-2 border-l-2 border-gray-300 dark:border-gray-700">
        {editComment === comment._id ? (
          <div>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
            <button
              onClick={() => handleSaveEdit(comment._id)}
              className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Save
            </button>
            <button
              onClick={() => setEditComment(null)}
              className="ml-2 mt-2 px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-900 dark:text-gray-100">{comment.content}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">By {comment.author.name}</p>
            {user && user._id === comment.author._id && (
              <div className="mt-1">
                <button onClick={() => handleEditComment(comment)} className="text-blue-500 hover:underline mr-2">Edit</button>
                <button onClick={() => handleDeleteComment(comment._id)} className="text-red-500 hover:underline">Delete</button>
              </div>
            )}
          </>
        )}
        {comment.replies && renderComments(comment.replies)}
      </div>
    ));
  };

  if (!post) return <p className="text-center text-gray-900 dark:text-gray-100">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">{post.title}</h1>
      <p className="text-gray-700 dark:text-gray-300">By {post.author.name}</p>
      <p className="mt-4 text-gray-900 dark:text-gray-100">{post.content}</p>
      {user && (
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          />
          <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
            Submit
          </button>
        </form>
      )}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Comments</h2>
        {renderComments(comments)}
      </div>
    </div>
  );
};

export default PostDetail;