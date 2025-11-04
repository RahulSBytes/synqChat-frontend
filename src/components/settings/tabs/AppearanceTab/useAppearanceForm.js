// settings/tabs/AppearanceTab/useAppearanceForm.js
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import usePreferencesStore from '../../../../store/usePreferencesStore.js';

export default function useAppearanceForm() {
  const { preferences, fetchPreferences, updateAppearance } = usePreferencesStore();

  const form = useForm({
    defaultValues: {
      theme: 'dark',
      fontSize: 'medium',
      chatWallpaper: null,
      messageBubbleStyle: 'rounded',
      accentColor: '#0084ff',
      timeFormat: '12h',
    }
  });

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);
  

  useEffect(() => {
    if (preferences) {
      form.reset({
        theme: preferences.appearance?.theme || 'dark',
        fontSize: preferences.appearance?.fontSize || 'medium',
        chatWallpaper: preferences.appearance?.chatWallpaper || null,
        messageBubbleStyle: preferences.messageBubbleStyle || 'rounded',
        accentColor: preferences.accentColor || '#0084ff',
        timeFormat: preferences.timeFormat || '12h',
      });
    }
  }, [preferences, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    const success = await updateAppearance(data);
    if (success) {
      alert('Appearance settings saved successfully!');
    } else {
      alert('Failed to save appearance settings');
    }
  });

  return { form, onSubmit };
}