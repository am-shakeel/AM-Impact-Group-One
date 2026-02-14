import React, { useState } from 'react';
import { createAdmin } from '../services/mockDb';
import { Shield, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminSetup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await createAdmin(formData.username, formData.password, formData.name);
      setMessage({ type: 'success', text: 'Admin account created successfully!' });
      setFormData({ username: '', password: '', name: '' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to create admin' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-am-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-am-900 p-6 text-center">
          <div className="mx-auto h-16 w-16 bg-am-600 rounded-full flex items-center justify-center text-white mb-4 shadow-lg">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Setup</h1>
          <p className="text-am-100 mt-2 text-sm">Register a new administrator</p>
        </div>

        <div className="p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-am-500 focus:outline-none"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                type="text"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-am-500 focus:outline-none"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-am-500 focus:outline-none"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-am-600 hover:bg-am-700 text-white py-3 rounded-lg font-bold transition flex items-center justify-center disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
              Create Admin Account
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/admin" className="text-sm text-am-600 hover:text-am-800 font-medium flex items-center justify-center">
              <ArrowLeft size={14} className="mr-1" /> Back to Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;