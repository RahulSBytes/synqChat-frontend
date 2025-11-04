// settings/tabs/PrivacyTab/usePrivacyForm.js
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import usePreferencesStore from '../../../../store/usePreferencesStore.js';

export default function usePrivacyForm() {
  const { preferences, fetchPreferences, updatePrivacy } = usePreferencesStore();

  const form = useForm({
    defaultValues: {
      profilePhotoVisibility: 'everyone',
      onlineStatusVisibility: 'everyone',
      typingIndicator: true,
      lastSeenVisible: true,
    }
  });

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  useEffect(() => {
    if (preferences) {
      form.reset({
        profilePhotoVisibility: preferences.privacy?.profilePhoto || 'everyone',
        onlineStatusVisibility: preferences.privacy?.onlineStatus || 'everyone',
        typingIndicator: preferences.privacy?.typingIndicator ?? true,
        lastSeenVisible: true,
      });
    }
  }, [preferences, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    const privacyData = {
      profilePhoto: data.profilePhotoVisibility,
      onlineStatus: data.onlineStatusVisibility,
      typingIndicator: data.typingIndicator,
    };

    const success = await updatePrivacy(privacyData);
    if (success) {
      alert('Privacy settings saved successfully!');
    } else {
      alert('Failed to save privacy settings');
    }
  });

  return { form, onSubmit };
}