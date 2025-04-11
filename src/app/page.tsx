'use client';
import React, { useState } from 'react';
import { FaUserTie, FaStore } from 'react-icons/fa';

const IntroPage = () => {
  const [role, setRole] = useState<'owner' | 'shopkeeper'>('shopkeeper');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Logging in as ${role}`, { username, password });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/cubes.png)' }}
    >
      <div className="backdrop-blur-lg bg-white/80 rounded-xl shadow-xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden border border-yellow-200">

        {/* Left Info */}
        <div className="bg-gradient-to-br from-yellow-400 to-red-400 md:w-1/2 p-10 text-white flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-sm">Welcome to SmartPOS</h2>
          <p className="mb-6 text-lg font-light">Simplify your sales. Empower your store.</p>
          <ul className="space-y-2 text-md font-medium">
            <li>🛒 Sell products quickly & efficiently</li>
            <li>📦 Manage and verify stock in real-time</li>
            <li>📊 Owner reports and cash settlements</li>
            <li>🔐 Role-based access & secure flow</li>
          </ul>
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 p-10 bg-white">
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setRole('shopkeeper')}
              className={`px-6 py-2 flex items-center gap-2 rounded-l-lg font-semibold transition duration-300
                ${role === 'shopkeeper'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'}`}
            >
              <FaStore /> Shopkeeper
            </button>
            <button
              onClick={() => setRole('owner')}
              className={`px-6 py-2 flex items-center gap-2 rounded-r-lg font-semibold transition duration-300
                ${role === 'owner'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-100'}`}
            >
              <FaUserTie /> Owner
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 rounded-md text-white font-bold shadow-md transition duration-300
                ${role === 'owner'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-yellow-500 hover:bg-yellow-600'}`}
            >
              Login as {role === 'owner' ? 'Owner' : 'Shopkeeper'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
