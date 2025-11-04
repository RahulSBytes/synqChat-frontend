// settings/tabs/ProfileTab/index.jsx
import { Camera, Mail } from 'lucide-react';
import FormField from '../../components/shared/FormField';
import AvatarUpload from './AvatarUpload';
import useProfileForm from './useProfileForm';

export default function ProfileTab() {
  const { form, onSubmit } = useProfileForm();
  const { register, watch, setValue, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold">Profile Settings</h2>

      <AvatarUpload 
        currentAvatar={watch('avatar')}
        onChange={(file) => setValue('avatar', file)}
      />

      <div className="grid gap-4 md:gap-5">
        <FormField
          label="Full Name"
          name="fullName"
          register={register}
          errors={errors}
          rules={{ required: 'Full name is required' }}
        />

        <FormField
          label="Username"
          name="username"
          register={register}
          errors={errors}
          rules={{ required: 'Username is required' }}
        />

        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-300">Bio</label>
          <textarea
            {...register('bio', { maxLength: 150 })}
            rows={3}
            className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-[#248f60] resize-none transition-colors"
          />
          <p className="text-xs text-zinc-500 mt-1">
            {watch('bio')?.length || 0}/150 characters
          </p>
        </div>

        <FormField
          label="Email Address"
          name="email"
          type="email"
          icon={Mail}
          register={register}
          errors={errors}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          }}
        />
      </div>

      <button
        onClick={onSubmit}
        className="w-full sm:w-auto bg-[#248f60] text-white px-6 py-2.5 md:py-3 rounded-lg hover:bg-[#1e7a52] transition-colors font-medium"
      >
        Save Profile Changes
      </button>
    </div>
  );
}