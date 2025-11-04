// settings/modals/PasswordModal.jsx
import { useForm } from 'react-hook-form';

export default function PasswordModal({ isOpen, onClose }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = handleSubmit((data) => {
    if (data.newPassword !== data.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Password changed');
    alert('Password changed successfully!');
    onClose();
    reset();
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#242424] rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Change Password</h3>
          <button
            onClick={() => {
              onClose();
              reset();
            }}
            className="text-zinc-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-300">Current Password</label>
            <input
              type="password"
              {...register('oldPassword', { required: 'Current password is required' })}
              className="w-full bg-[#323232] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
              placeholder="Enter current password"
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-300">New Password</label>
            <input
              type="password"
              {...register('newPassword', { 
                required: 'New password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className="w-full bg-[#323232] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-300">Confirm New Password</label>
            <input
              type="password"
              {...register('confirmPassword', { required: 'Please confirm your password' })}
              className="w-full bg-[#323232] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                reset();
              }}
              className="flex-1 bg-[#404040] hover:bg-[#4a4a4a] text-white py-3 px-4 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#248f60] hover:bg-[#1e7a52] text-white py-3 px-4 rounded-lg transition-colors font-medium"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}