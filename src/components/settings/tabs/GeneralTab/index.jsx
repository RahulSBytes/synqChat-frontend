// settings/tabs/GeneralTab/index.jsx
import { Bell, Volume2, Keyboard } from 'lucide-react';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import useGeneralForm from './useGeneralForm';

export default function GeneralTab() {
  const { form, onSubmit } = useGeneralForm();
  const { watch, setValue } = form;

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold">General Settings</h2>

      <div className="space-y-4 md:space-y-6">
        <ToggleSwitch
          label="Enable Notifications"
          description="Receive notifications for new messages"
          icon={Bell}
          checked={watch('notificationsEnabled')}
          onChange={(checked) => setValue('notificationsEnabled', checked)}
        />

        <ToggleSwitch
          label="Message Tick Sound"
          description="Play sound when sending messages"
          icon={Volume2}
          checked={watch('tickSound')}
          onChange={(checked) => setValue('tickSound', checked)}
        />

        <ToggleSwitch
          label="Enter to Send"
          description={
            watch('enterToSend')
              ? 'Press Enter to send, Shift+Enter for new line'
              : 'Press Ctrl+Enter to send, Enter for new line'
          }
          icon={Keyboard}
          checked={watch('enterToSend')}
          onChange={(checked) => setValue('enterToSend', checked)}
        />
      </div>

      <button
        onClick={onSubmit}
        className="w-full sm:w-auto bg-[#248f60] text-white px-6 py-2.5 md:py-3 rounded-lg hover:bg-[#1e7a52] transition-colors font-medium"
      >
        Save General Settings
      </button>
    </div>
  );
}