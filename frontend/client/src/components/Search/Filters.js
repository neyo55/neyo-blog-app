import React, { useState } from 'react';
import api from '../../utils/api';

const Filters = ({ setPosts, setTotalPages }) => {
  const [category, setCategory] = useState('');
  const categories = ['Tech', 'Lifestyle', 'Education', 'Other'];

  const handleFilter = async (cat) => {
    setCategory(cat);
    try {
      const res = await api.get(`/posts?category=${cat}`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error filtering posts:', err);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 max-w-md mx-auto mt-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleFilter(cat)}
          className={`px-4 py-2 rounded ${category === cat ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default Filters;