'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FaLock, FaUser } from 'react-icons/fa';
import axios from 'axios';

const IntroPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: true, // We'll handle redirect manually
        username,
        password,
      });

      

     
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-yellow-100 to-red-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row w-full max-w-5xl overflow-hidden border border-yellow-300">
        {/* Left Panel */}
        <div className="bg-gradient-to-br from-yellow-400 to-red-400 md:w-1/2 p-10 text-white flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow">SmartPOS</h2>
          <p className="mb-6 text-lg font-light">Streamline your sales, manage stock, and make your store smarter.</p>
          <ul className="space-y-2 text-md font-medium">
            <li>🛒 Fast product sales & QR scanning</li>
            <li>📦 Stock verification and purchase receipts</li>
            <li>📊 Owner dashboards & cash settlements</li>
            <li>🔐 Secure access with role-based login</li>
          </ul>
        </div>

        {/* Login Form */}
        <div className="md:w-1/2 p-10 bg-white">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to Your Account</h3>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Username</label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <FaUser className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full outline-none"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md text-white font-bold shadow-md transition duration-300 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
