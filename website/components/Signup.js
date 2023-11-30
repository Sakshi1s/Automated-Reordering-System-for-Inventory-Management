"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';

const Signup = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    const router = useRouter();

    e.preventDefault();

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Signup was successful
        // Redirect the user to the dashboard or login page
        router.push('/');
      } else {
        // Handle signup error, e.g., display an error message
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred during signup.');
    }
  };

  return (
    <div>       <Header />
    
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label htmlFor="username" className="block text-gray-700">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full border rounded-md py-2 px-3 text-gray-700"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border rounded-md py-2 px-3 text-gray-700"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border rounded-md py-2 px-3 text-gray-700"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Signup
          </button>
        </form>
      </div>
    </div></div>
  );
};

export default Signup;
