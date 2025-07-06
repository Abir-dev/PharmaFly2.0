import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Shield, Globe, Palette, Smartphone, CreditCard, User, ToggleLeft, ToggleRight } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    orderUpdates: true,
    promotionalEmails: false,
    twoFactorAuth: true,
    locationSharing: false,
    dataAnalytics: true,
    darkMode: true,
    autoSave: true,
    soundEffects: false
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive order updates and account notifications via email',
          type: 'toggle'
        },
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Get instant notifications on your device',
          type: 'toggle'
        },
        {
          key: 'orderUpdates',
          label: 'Order Updates',
          description: 'Notifications about your order status and delivery',
          type: 'toggle'
        },
        {
          key: 'promotionalEmails',
          label: 'Promotional Emails',
          description: 'Receive offers, discounts, and product updates',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      settings: [
        {
          key: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          type: 'toggle'
        },
        {
          key: 'locationSharing',
          label: 'Location Sharing',
          description: 'Allow location access for better delivery tracking',
          type: 'toggle'
        },
        {
          key: 'dataAnalytics',
          label: 'Data Analytics',
          description: 'Help us improve by sharing anonymous usage data',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Preferences',
      icon: Palette,
      settings: [
        {
          key: 'darkMode',
          label: 'Dark Mode',
          description: 'Use dark theme throughout the application',
          type: 'toggle'
        },
        {
          key: 'autoSave',
          label: 'Auto Save',
          description: 'Automatically save your preferences and form data',
          type: 'toggle'
        },
        {
          key: 'soundEffects',
          label: 'Sound Effects',
          description: 'Play sounds for notifications and interactions',
          type: 'toggle'
        }
      ]
    }
  ];

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
          <h1 className="text-3xl font-bold text-[#CAF0F8]">Settings</h1>
        </div>

        <div className="space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
              {/* Section Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00B4D8] to-[#48CAE4] rounded-lg flex items-center justify-center mr-4">
                    <section.icon className="w-5 h-5 text-[#03045E]" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#CAF0F8]">{section.title}</h2>
                </div>
              </div>

              {/* Settings List */}
              <div className="divide-y divide-white/10">
                {section.settings.map((setting) => (
                  <div key={setting.key} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-[#CAF0F8] mb-1">
                          {setting.label}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {setting.description}
                        </p>
                      </div>
                      <div className="ml-4">
                        {setting.type === 'toggle' && (
                          <button
                            onClick={() => toggleSetting(setting.key as keyof typeof settings)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:ring-offset-2 focus:ring-offset-transparent ${
                              settings[setting.key as keyof typeof settings]
                                ? 'bg-gradient-to-r from-[#00B4D8] to-[#48CAE4]'
                                : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings[setting.key as keyof typeof settings]
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Account Actions */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00B4D8] to-[#48CAE4] rounded-lg flex items-center justify-center mr-4">
                  <User className="w-5 h-5 text-[#03045E]" />
                </div>
                <h2 className="text-xl font-semibold text-[#CAF0F8]">Account Actions</h2>
              </div>
            </div>

            <div className="divide-y divide-white/10">
              <button className="w-full p-6 text-left hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-[#00B4D8] mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-[#CAF0F8]">Change Password</h3>
                      <p className="text-gray-300 text-sm">Update your account password</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                </div>
              </button>

              <button className="w-full p-6 text-left hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-[#00B4D8] mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-[#CAF0F8]">Payment Methods</h3>
                      <p className="text-gray-300 text-sm">Manage your payment options</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                </div>
              </button>

              <button className="w-full p-6 text-left hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 text-[#00B4D8] mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-[#CAF0F8]">Connected Devices</h3>
                      <p className="text-gray-300 text-sm">View and manage your devices</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                </div>
              </button>

              <button className="w-full p-6 text-left hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-[#00B4D8] mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-[#CAF0F8]">Privacy Policy</h3>
                      <p className="text-gray-300 text-sm">Read our privacy policy</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                </div>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/10 backdrop-blur-md rounded-xl border border-red-500/20 overflow-hidden">
            <div className="p-6 border-b border-red-500/20">
              <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-red-400 mb-1">Delete Account</h3>
                  <p className="text-red-300 text-sm">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 