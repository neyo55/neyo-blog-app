// src/pages/SignUp.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signup } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ email, password, name });
    } catch (err) {
      console.error('Error signing up:', err);
      alert('Failed to sign up.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Helmet>
        <title>Sign Up | Neyo55 Blog</title>
        <meta name="description" content="Create an account on Neyo55 Blog." />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
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
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;