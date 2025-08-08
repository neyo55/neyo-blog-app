// src/pages/SignIn.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      console.error('Error signing in:', err);
      alert('Failed to sign in.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Helmet>
        <title>Sign In | Neyo55 Blog</title>
        <meta name="description" content="Sign in to your Neyo55 Blog account." />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;