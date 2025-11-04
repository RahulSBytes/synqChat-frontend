// settings/components/SettingsSidebar.jsx
import { User, Palette, Shield, Settings as SettingsIcon, LogOut, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'general', label: 'General', icon: SettingsIcon },
];

export default function SettingsSidebar({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, onBack }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      navigate('/login');
    }
  };

  return (
    <div
      className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-[#242424] border-r border-[#323232] transform transition-transform duration-300 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div className="hidden lg:flex items-center gap-4 p-6 border-b border-[#323232]">
        <button
          className="text-white hover:bg-[#323232] p-2 rounded-full transition-colors"
          onClick={onBack}
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
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

      {/* <div className="p-4 border-t border-[#323232]"> */}
      <hr className='mb-4 w-11/12 m-auto bg-muted dark:bg-muted-dark' />
        <button
          onClick={handleLogout}
          className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 p-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      {/* </div> */}
    </div>
  );
}