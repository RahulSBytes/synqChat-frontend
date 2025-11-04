// settings/tabs/ProfileTab/useProfileForm.js
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import usePreferencesStore from '../../../../store/usePreferencesStore.js';

export default function useProfileForm() {
  const { preferences, fetchPreferences } = usePreferencesStore();

  const form = useForm({
    defaultValues: {
      fullName: 'John Doe',
      username: 'johndoe',
      bio: 'Hey there! I am using this chat app.',
      email: 'john.doe@gmail.com',
      avatar: null,
    }
  });

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  useEffect(() => {
    if (preferences) {
      form.reset({
        fullName: preferences.fullName || 'John Doe',
        username: preferences.username || 'johndoe',
        bio: preferences.bio || 'Hey there! I am using this chat app.',
        email: preferences.email || 'john.doe@gmail.com',
        avatar: null,
      });
    }
  }, [preferences, form]);

  const onSubmit = form.handleSubmit((data) => {
    console.log('Profile saved:', data);
    alert('Profile saved successfully!');
  });

  return { form, onSubmit };
}