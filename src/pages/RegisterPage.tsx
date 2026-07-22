import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      });

      onNavigate('home');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 flex flex-col items-center justify-center">
      <div onClick={() => onNavigate('home')} className="cursor-pointer mb-6 text-center">
        <span className="text-3xl font-black tracking-tight text-gray-900">
          amazon<span className="text-[#febd69]">.clone</span>
        </span>
      </div>

      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Your name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="First and last name"
              className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-[#febd69]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-[#febd69]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="At least 6 characters"
              className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-[#febd69]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Account Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded outline-none font-semibold cursor-pointer"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin Manager</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold text-xs py-2.5 rounded-full shadow-sm cursor-pointer transition-colors mt-2"
          >
            {loading ? 'Registering with User Service...' : 'Create your Amazon account'}
          </button>
        </form>

        <div className="border-t border-gray-200 pt-4 text-center text-xs">
          <span className="text-gray-600">Already have an account? </span>
          <button
            onClick={() => onNavigate('login')}
            className="font-bold text-[#007185] hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
