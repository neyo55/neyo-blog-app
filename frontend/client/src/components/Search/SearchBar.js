import React, { useState } from 'react';
import api from '../../utils/api';

const SearchBar = ({ setPosts, setTotalPages }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    try {
      const res = await api.get(`/posts?search=${query}`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error searching posts:', err);
    }
  };

  return (
    <div className="flex max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        className="w-full p-3 border rounded-l dark:bg-gray-700 dark:text-white"
      />
      <button
        onClick={handleSearch}
        className="bg-primary text-white px-4 py-2 rounded-r hover:bg-blue-600"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;