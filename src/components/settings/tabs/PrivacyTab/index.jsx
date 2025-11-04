// settings/tabs/PrivacyTab/index.jsx
import { User, Eye, EyeOff, MessageSquare, Lock, ChevronLeft } from 'lucide-react';
import SettingItem from '../../components/shared/SettingItem';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import usePrivacyForm from './usePrivacyForm';

export default function PrivacyTab({ onPasswordModal }) {
  const { form, onSubmit } = usePrivacyForm();
  const { register, watch, setValue } = form;

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold">Privacy & Security</h2>

      <div className="space-y-4 md:space-y-6">
        <SettingItem
          title="Profile Photo"
          description="Who can see your profile photo"
          icon={User}
        >
          <select
            {...register('profilePhotoVisibility')}
            className="bg-[#323232] border border-[#404040] rounded-lg px-3 md:px-4 py-2 text-white focus:outline-none focus:border-[#248f60]"
          >
            <option value="everyone">Everyone</option>
            <option value="contacts">Contacts</option>
            <option value="nobody">Nobody</option>
          </select>
        </SettingItem>

        <SettingItem
          title="Online Status"
          description="Who can see when you're online"
          icon={Eye}
        >
          <select
            {...register('onlineStatusVisibility')}
            className="bg-[#323232] border border-[#404040] rounded-lg px-3 md:px-4 py-2 text-white focus:outline-none focus:border-[#248f60]"
          >
            <option value="everyone">Everyone</option>
            <option value="contacts">Contacts</option>
            <option value="nobody">Nobody</option>
          </select>
        </SettingItem>

        <ToggleSwitch
          label="Last Seen"
          description="Control who can see your last seen status"
          icon={watch('lastSeenVisible') ? Eye : EyeOff}
          checked={watch('lastSeenVisible')}
          onChange={(checked) => setValue('lastSeenVisible', checked)}
        />

        <ToggleSwitch
          label="Typing Indicator"
          description="Show when you're typing to others"
          icon={MessageSquare}
          checked={watch('typingIndicator')}
          onChange={(checked) => setValue('typingIndicator', checked)}
        />

        <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
          <button
            type="button"
            onClick={onPasswordModal}
            className="w-full flex items-center justify-between hover:bg-[#323232] p-3 -m-3 rounded-lg transition-colors"
          >
            <div className="text-left">
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

      <button
        onClick={onSubmit}
        className="w-full sm:w-auto bg-[#248f60] text-white px-6 py-2.5 md:py-3 rounded-lg hover:bg-[#1e7a52] transition-colors font-medium"
      >
        Save Privacy Changes
      </button>
    </div>
  );
}