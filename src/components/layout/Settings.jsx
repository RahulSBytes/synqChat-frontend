import { useState } from 'react';
import { Camera, Eye, EyeOff, User, Mail, Clock, Palette, LogOut, Lock, Shield, Bell, ChevronLeft, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useMeta from '../../hooks/useMeta.js';

export default function Settings() {
  useMeta({ title: "setting", description: "this is setting page" })

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for form inputs
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    username: 'johndoe',
    bio: 'Hey there! I am using this chat app.',
    gmail: 'john.doe@gmail.com'
  });

  const [theme, setTheme] = useState('dark');
  const [lastSeenVisible, setLastSeenVisible] = useState(true);
  const [timeFormat, setTimeFormat] = useState('12');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    console.log('Profile saved:', formData);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Password changed');
    setShowPasswordModal(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      console.log('Logging out...');
      navigate('/login');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Avatar selected:', file);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold">Profile Settings</h2>

            {/* Avatar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="relative">
                <img
                  src="../../../image.png"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-[#323232]"
                  alt="Profile"
                />
                <label className="absolute bottom-0 right-0 bg-[#248f60] p-1.5 md:p-2 rounded-full cursor-pointer hover:bg-[#1e7a52] transition-colors">
                  <Camera size={14} className="md:w-4 md:h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-medium text-base md:text-lg">Profile Picture</p>
                <p className="text-xs md:text-sm text-zinc-400">Click camera icon to change</p>
              </div>
            </div>

            <div className="grid gap-4 md:gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows="3"
                  maxLength="150"
                  className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-[#248f60] resize-none transition-colors"
                />
                <p className="text-xs text-zinc-500 mt-1">{formData.bio.length}/150 characters</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300 flex items-center gap-2">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.gmail}
                  onChange={(e) => handleInputChange('gmail', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              className="w-full sm:w-auto bg-[#248f60] text-white px-6 py-2.5 md:py-3 rounded-lg hover:bg-[#1e7a52] transition-colors font-medium"
            >
              Save Profile Changes
            </button>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold">Appearance</h2>

            <div className="space-y-4 md:space-y-6">
              {/* Theme */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-base md:text-lg">Theme</h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Choose your preferred theme</p>
                  </div>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="bg-[#323232] border border-[#404040] rounded-lg px-3 md:px-4 py-2 text-white focus:outline-none focus:border-[#248f60]"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>

              {/* Time Format */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      <Clock size={16} className="md:w-[18px] md:h-[18px]" />
                      Time Format
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Choose 12-hour or 24-hour format</p>
                  </div>
                  <div className="flex bg-[#323232] rounded-lg p-1">
                    <button
                      onClick={() => setTimeFormat('12')}
                      className={`px-3 md:px-4 py-1.5 md:py-2 rounded text-sm transition-colors ${timeFormat === '12' ? 'bg-[#248f60] text-white' : 'text-zinc-300 hover:text-white'
                        }`}
                    >
                      12h
                    </button>
                    <button
                      onClick={() => setTimeFormat('24')}
                      className={`px-3 md:px-4 py-1.5 md:py-2 rounded text-sm transition-colors ${timeFormat === '24' ? 'bg-[#248f60] text-white' : 'text-zinc-300 hover:text-white'
                        }`}
                    >
                      24h
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold">Privacy & Security</h2>

            <div className="space-y-4 md:space-y-6">
              {/* Last Seen Visibility */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      {lastSeenVisible ? <Eye size={16} className="md:w-[18px] md:h-[18px]" /> : <EyeOff size={16} className="md:w-[18px] md:h-[18px]" />}
                      Last Seen
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Control who can see your last seen status</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lastSeenVisible}
                      onChange={(e) => setLastSeenVisible(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#404040] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#248f60]"></div>
                  </label>
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-between hover:bg-[#323232] p-3 -m-3 rounded-lg transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      <Lock size={16} className="md:w-[18px] md:h-[18px]" />
                      Password
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Change your account password</p>
                  </div>
                  <ChevronLeft size={20} className="rotate-180 text-zinc-400" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold">Notifications</h2>
            <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
              <p className="text-zinc-400 text-sm md:text-base">Notification settings coming soon...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-[#1a1a1a] text-white flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#323232] bg-[#242424]">
        <div className="flex items-center gap-3">
          <button
            className="text-white hover:bg-[#323232] p-2 rounded-full transition-colors"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white hover:bg-[#323232] p-2 rounded-full transition-colors"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar - Desktop always visible, Mobile slide-in */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-[#242424] border-r border-[#323232] transform transition-transform duration-300 
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar header */}
        <div className="hidden lg:flex items-center gap-4 p-6 border-b border-[#323232]">
          <button
            className="text-white hover:bg-[#323232] p-2 rounded-full transition-colors"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                      ? 'bg-[#323232] text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-[#2a2a2a]'
                    }`}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#323232]">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 p-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 md:p-8">
          {renderContent()}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#242424] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                  className="w-full bg-[#323232] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full bg-[#323232] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="w-full bg-[#323232] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-[#404040] hover:bg-[#4a4a4a] text-white py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 bg-[#248f60] hover:bg-[#1e7a52] text-white py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}