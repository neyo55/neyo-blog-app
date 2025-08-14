import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`,
          },
        });
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, [user, navigate]);

  if (!user) return <p className="text-center text-red-500 mt-4">Please sign in to view your profile.</p>;
  if (!profile) return <p className="text-center text-gray-900 dark:text-gray-100">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">My Profile</h1>
      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
        <p className="text-gray-900 dark:text-gray-100"><strong>Name:</strong> {profile.name}</p>
        <p className="text-gray-900 dark:text-gray-100"><strong>Email:</strong> {profile.email}</p>
      </div>
    </div>
  );
};

export default Profile;