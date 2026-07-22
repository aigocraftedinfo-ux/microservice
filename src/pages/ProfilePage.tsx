import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, ShieldCheck, LogOut, Trash2, Edit3, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, updateProfile, deleteProfile, logout, isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'USA',
  });
  const [msg, setMsg] = useState('');

  if (!user) {
    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-800">Please Sign In to View Profile</h2>
        <button
          onClick={() => onNavigate('login')}
          className="mt-4 bg-[#ffd814] text-gray-900 px-6 py-2 rounded-full text-xs font-bold"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      });
      setIsEditing(false);
      setMsg('Profile updated successfully.');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      try {
        await deleteProfile();
        onNavigate('home');
      } catch (err) {
        alert('Failed to delete account');
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-[#febd69]" />
            <h1 className="text-2xl font-bold text-gray-900">Your Account & Profile</h1>
          </div>
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-md flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" /> Go to Admin Dashboard
            </button>
          )}
        </div>

        {msg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold">
            {msg}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <span className="text-xs text-gray-500 font-mono">{user.email}</span>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                user.role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-gray-100 text-gray-800'
              }`}
            >
              Role: {user.role}
            </span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-gray-700">Default Shipping Address</label>
                <input
                  type="text"
                  placeholder="Street"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="text-xs p-2.5 border border-gray-300 rounded outline-none"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="text-xs p-2.5 border border-gray-300 rounded outline-none"
                  />
                  <input
                    type="text"
                    placeholder="ZIP"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="text-xs p-2.5 border border-gray-300 rounded outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold text-xs px-5 py-2 rounded-full flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-gray-800 font-bold text-xs px-4 py-2 rounded-full cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100 space-y-1">
                  <span className="text-gray-500 font-bold block">Contact Phone</span>
                  <span className="font-semibold text-gray-900">{user.phone || 'Not provided'}</span>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100 space-y-1">
                  <span className="text-gray-500 font-bold block">User ID</span>
                  <span className="font-mono text-gray-700">{user.id}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100 space-y-1">
                <span className="text-gray-500 font-bold block">Default Shipping Address</span>
                <p className="font-semibold text-gray-900">
                  {user.address?.street ? (
                    `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zipCode}`
                  ) : (
                    'No default address set'
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile Information
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={logout}
                    className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="border border-red-300 hover:bg-red-50 text-red-700 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
