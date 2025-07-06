import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Save, ArrowLeft, Shield, Bell, Globe } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar_url: user?.avatar_url || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement avatar upload
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          avatar_url: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03045E] via-[#023E8A] to-[#0077B6] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#CAF0F8] hover:text-white transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-[#CAF0F8]">Profile Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#CAF0F8]">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-[#00B4D8] to-[#48CAE4] text-[#03045E] rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#00B4D8] to-[#48CAE4] rounded-full flex items-center justify-center shadow-lg">
                      {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-[#03045E] font-bold text-2xl">{initials}</span>
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#00B4D8] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#48CAE4] transition-colors">
                        <Camera className="w-4 h-4 text-[#03045E]" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#CAF0F8]">{user?.full_name}</h3>
                    <p className="text-gray-300">{user?.email}</p>
                    {user?.role && (
                      <span className="inline-block mt-1 px-3 py-1 bg-gradient-to-r from-[#00B4D8] to-[#48CAE4] text-[#03045E] text-sm rounded-full font-medium">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#CAF0F8] mb-2">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-[#CAF0F8] placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#CAF0F8] mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-[#CAF0F8] placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#CAF0F8] mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-[#CAF0F8] placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#CAF0F8] mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-[#CAF0F8] placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-[#00B4D8] to-[#48CAE4] text-[#03045E] rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-[#CAF0F8] mb-4">Account Settings</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 text-[#CAF0F8] hover:bg-white/10 rounded-lg transition-colors">
                  <Shield className="w-5 h-5 mr-3 text-[#00B4D8]" />
                  <span>Change Password</span>
                </button>
                <button className="w-full flex items-center p-3 text-[#CAF0F8] hover:bg-white/10 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 mr-3 text-[#00B4D8]" />
                  <span>Notification Settings</span>
                </button>
                <button className="w-full flex items-center p-3 text-[#CAF0F8] hover:bg-white/10 rounded-lg transition-colors">
                  <Globe className="w-5 h-5 mr-3 text-[#00B4D8]" />
                  <span>Privacy Settings</span>
                </button>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-[#CAF0F8] mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Orders</span>
                  <span className="text-[#CAF0F8] font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Wishlist Items</span>
                  <span className="text-[#CAF0F8] font-semibold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Member Since</span>
                  <span className="text-[#CAF0F8] font-semibold">2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 