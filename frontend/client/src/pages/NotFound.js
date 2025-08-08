import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const NotFound = () => (
  <div className="text-center">
    <Helmet>
      <title>404 | Neyo55 Blog</title>
      <meta name="description" content="Page not found." />
    </Helmet>
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="mb-4">The page you're looking for doesn't exist.</p>
    <Link to="/" className="text-primary hover:underline">Back to Home</Link>
  </div>
);

export default NotFound;