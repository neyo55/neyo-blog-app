import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const PostCard = ({ post, onEdit, onDelete }) => {
  const { user } = useContext(AuthContext);
  const isAuthor = user && user._id === post.author?._id;

  return (
    <div className="bg-card-bg p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">{post.title}</h2>
      <div className="text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 100) + '...' }} />
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        By {post.author?.name || 'Anonymous'} | {post.category} | {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="mt-4 flex space-x-2">
        <Link to={`/post/${post._id}`} className="text-primary hover:underline">Read More</Link>
        {isAuthor && (
          <>
            <button onClick={() => onEdit(post)} className="text-blue-500 hover:underline">Edit</button>
            <button onClick={() => onDelete(post._id)} className="text-red-500 hover:underline">Delete</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;