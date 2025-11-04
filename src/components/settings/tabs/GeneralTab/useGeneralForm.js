import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import usePreferencesStore from '../../../../store/usePreferencesStore.js';

export default function useGeneralForm() {
  const { preferences, fetchPreferences, updateNotifications, updateGeneralSettings } = usePreferencesStore();

  const form = useForm({
    defaultValues: {
      notificationsEnabled: true,
      tickSound: true,
      enterToSend: true,
    }
  });

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  useEffect(() => {
    if (preferences) {
      form.reset({
        notificationsEnabled: preferences.notifications ?? true,
        tickSound: preferences.tickSound ?? true,
        enterToSend: preferences.enterToSend ?? true,
      });
    }
  }, [preferences, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    const notificationSuccess = await updateNotifications({
      notifications: data.notificationsEnabled,
      tickSound: data.tickSound,
    });

    const generalSuccess = await updateGeneralSettings({
      enterToSend: data.enterToSend,
    });

    if (notificationSuccess && generalSuccess) {
      alert('General settings saved successfully!');
    } else {
      alert('Failed to save general settings');
    }
  });

  return { form, onSubmit };
}