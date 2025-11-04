// settings/tabs/ProfileTab/AvatarUpload.jsx
import { Camera } from 'lucide-react';

export default function AvatarUpload({ currentAvatar, onChange }) {
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      <div className="relative">
        <img
          src="../../../image.png"
          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-[#323232]"
          alt="Profile"
        />
        <label className="absolute bottom-0 right-0 bg-[#248f60] p-1.5 md:p-2 rounded-full cursor-pointer hover:bg-[#1e7a52] transition-colors">
          <Camera size={14} className="md:w-4 md:h-4" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </label>
      </div>
      <div className="text-center sm:text-left">
        <p className="font-medium text-base md:text-lg">Profile Picture</p>
        <p className="text-xs md:text-sm text-zinc-400">Click camera icon to change</p>
      </div>
    </div>
  );
}