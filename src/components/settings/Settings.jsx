// settings/Settings.jsx
import { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import useMeta from '../../hooks/useMeta.js';
import usePreferencesStore from '../../store/usePreferencesStore.js';
import SettingsSidebar from './components/SettingsSidebar';
import MobileHeader from './components/MobileHeader';
import PasswordModal from './modals/PasswordModal';

// Lazy load tabs for better performance
const ProfileTab = lazy(() => import('./tabs/ProfileTab'));
const AppearanceTab = lazy(() => import('./tabs/AppearanceTab'));
const PrivacyTab = lazy(() => import('./tabs/PrivacyTab'));
const GeneralTab = lazy(() => import('./tabs/GeneralTab'));

const TABS = {
  profile: ProfileTab,
  appearance: AppearanceTab,
  privacy: PrivacyTab,
  general: GeneralTab,
};

export default function Settings() {
  useMeta({ title: "setting", description: "this is setting page" });

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { isLoading } = usePreferencesStore();

  const TabComponent = TABS[activeTab];

  if (isLoading) return <div>Loading.....</div>

  return (
    <div className="h-screen bg-[#1a1a1a] text-white flex flex-col lg:flex-row">
      <MobileHeader
        onBack={() => navigate(-1)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <SettingsSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onBack={() => navigate(-1)}
      />

      <div className="flex-1 overflow-y-auto border border-red-600">
        <div className="border border-green-600 max-w-3xl mx-auto p-6 md:p-8">
          <Suspense fallback={<div>Loading...</div>}>
            <TabComponent onPasswordModal={() => setShowPasswordModal(true)} />
          </Suspense>
        </div>
      </div>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}