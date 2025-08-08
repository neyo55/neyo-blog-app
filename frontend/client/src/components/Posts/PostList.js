import React from 'react';
import { Link } from 'react-router-dom';

const PostList = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map(post => (
        <div key={post._id} className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-600">By {post.author.name}</p>
          <Link to={`/post/${post._id}`} className="text-blue-500 mt-2 inline-block">Read more</Link>
        </div>
      ))}
    </div>
  );
};

export default PostList;