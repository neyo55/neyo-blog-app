import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="bg-gray-800 text-gray-100 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Neyo Blog</Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/create-post" className="hover:underline">Create Post</Link>
              <Link to="/profile" className="hover:underline">Profile</Link>
              <button onClick={logout} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin" className="hover:underline">Sign In</Link>
              <Link to="/signup" className="hover:underline">Sign Up</Link>
            </>
          )}
          <button onClick={toggleTheme} className="ml-4">
            {isDarkMode ? '☀' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;