import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`);
      const data = await response.json();
      setPost(data);
      setComments(data.comments || []);
    };
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3000/api/posts/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}` },
      body: JSON.stringify({ content: newComment }),
    });
    if (response.ok) {
      setNewComment('');
      fetchPost();
    }
  };

  const handleEditComment = (commentId, content) => {
    setEditCommentId(commentId);
    setEditContent(content);
  };

  const handleSaveEdit = async (commentId) => {
    const response = await fetch(`http://localhost:3000/api/posts/${id}/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}` },
      body: JSON.stringify({ content: editContent }),
    });
    if (response.ok) {
      setEditCommentId(null);
      fetchPost();
    }
  };

  const handleDeleteComment = async (commentId) => {
    const response = await fetch(`http://localhost:3000/api/posts/${id}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}` },
    });
    if (response.ok) fetchPost();
  };

  const renderComments = (comments) => {
    return comments.map(comment => (
      <div key={comment._id} className="ml-4 p-2 border-l-2">
        {editCommentId === comment._id ? (
          <div>
            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
            <button onClick={() => handleSaveEdit(comment._id)}>Save</button>
            <button onClick={() => setEditCommentId(null)}>Cancel</button>
          </div>
        ) : (
          <div>
            <p>{comment.content} <small>({comment.isEdited ? 'edited' : 'posted'} at {new Date(comment.updatedAt).toLocaleString()})</small></p>
            <button onClick={() => handleEditComment(comment._id, comment.content)}>Edit</button>
            <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
            {comment.replies && renderComments(comment.replies)}
          </div>
        )}
      </div>
    ));
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <h2 className="text-xl font-semibold mt-6">Comments</h2>
      <form onSubmit={handleCommentSubmit} className="mt-4">
        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-full p-2 border rounded" />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Add Comment</button>
      </form>
      <div className="mt-4">{renderComments(comments)}</div>
    </div>
  );
};

export default PostDetail;