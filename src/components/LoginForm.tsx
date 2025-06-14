import React, { useState } from 'react';
import { LogIn, Factory, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ConnectionTest from './ConnectionTest';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading, error: authError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Factory className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Factory Management</h1>
          <p className="text-gray-600">Intercommunication & Escalation System</p>
        </div>

        <ConnectionTest />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Quick Login (Demo):</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => quickLogin('tailor@factory.com')}
              className="text-xs bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded border border-green-200 transition-colors"
            >
              Tailor
            </button>
            <button
              onClick={() => quickLogin('mechanic@factory.com')}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded border border-blue-200 transition-colors"
            >
              Mechanic
            </button>
            <button
              onClick={() => quickLogin('manager@factory.com')}
              className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded border border-purple-200 transition-colors"
            >
              Manager
            </button>
            <button
              onClick={() => quickLogin('head@factory.com')}
              className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-2 rounded border border-orange-200 transition-colors"
            >
              Head
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}