import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      onNavigate('home');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    try {
      setError('');
      setLoading(true);
      await login(demoEmail, demoPass);
      onNavigate('home');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 flex flex-col items-center justify-center">
      {/* Logo */}
      <div onClick={() => onNavigate('home')} className="cursor-pointer mb-6 text-center">
        <span className="text-3xl font-black tracking-tight text-gray-900">
          amazon<span className="text-[#febd69]">.clone</span>
        </span>
        <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
          MICROSERVICES AUTH
        </span>
      </div>

      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none focus:border-[#febd69]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none focus:border-[#febd69]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold text-xs py-2.5 rounded-full shadow-sm cursor-pointer transition-colors"
          >
            {loading ? 'Authenticating with User Service...' : 'Continue'}
          </button>
        </form>

        {/* Quick Demo Login Preset Buttons */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Quick Demo Credentials</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('john@example.com', 'user123')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold py-2 px-2 rounded border border-gray-300 flex items-center justify-center gap-1 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-blue-600" /> Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@amazon.com', 'admin123')}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold py-2 px-2 rounded border border-amber-300 flex items-center justify-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> Demo Admin
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 text-center text-xs">
          <span className="text-gray-600">New to Amazon Clone? </span>
          <button
            onClick={() => onNavigate('register')}
            className="font-bold text-[#007185] hover:underline cursor-pointer"
          >
            Create your Amazon account
          </button>
        </div>
      </div>
    </div>
  );
};
