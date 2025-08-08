import React from 'react';

const SearchBar = ({ search, setSearch }) => {
  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search posts..."
      className="p-2 border rounded w-full md:w-1/3"
    />
  );
};

export default SearchBar;