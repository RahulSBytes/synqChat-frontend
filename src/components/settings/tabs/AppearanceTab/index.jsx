// settings/tabs/AppearanceTab/index.jsx
import { Type, MessageSquare, Sparkles, Image as ImageIcon, Clock } from 'lucide-react';
import SettingItem from '../../components/shared/SettingItem';
import useAppearanceForm from './useAppearanceForm';

export default function AppearanceTab() {
  const { form, onSubmit } = useAppearanceForm();
  const { register, watch, setValue } = form;

  const handleWallpaperChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('chatWallpaper', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold">Appearance</h2>

      <div className="space-y-4 md:space-y-6">
        <SettingItem
          title="Theme"
          description="Choose your preferred theme"
        >
          <select
            {...register('theme')}
            className="bg-[#323232] border border-[#404040] rounded-lg px-3 md:px-4 py-2 text-white focus:outline-none focus:border-[#248f60]"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </SettingItem>

        <SettingItem
          title="Font Size"
          description="Adjust text size in chats"
          icon={Type}
        >
          <select
            {...register('fontSize')}
            className="bg-[#323232] border border-[#404040] rounded-lg px-3 md:px-4 py-2 text-white focus:outline-none focus:border-[#248f60]"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </SettingItem>

        <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                <MessageSquare size={16} className="md:w-[18px] md:h-[18px]" />
                Message Bubble Style
              </h3>
              <p className="text-xs md:text-sm text-zinc-400 mt-1">Choose message bubble appearance</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['rounded', 'sharp', 'minimal'].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setValue('messageBubbleStyle', style)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors capitalize ${
                    watch('messageBubbleStyle') === style
                      ? 'bg-[#248f60] text-white'
                      : 'bg-[#323232] text-zinc-300 hover:text-white hover:bg-[#404040]'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        <SettingItem
          title="Accent Color"
          description="Customize app accent color"
          icon={Sparkles}
        >
          <div className="flex items-center gap-3">
            <input
              type="color"
              {...register('accentColor')}
              className="w-12 h-10 bg-transparent border-2 border-[#404040] rounded-lg cursor-pointer"
            />
            <span className="text-sm text-zinc-400">{watch('accentColor')}</span>
          </div>
        </SettingItem>

        <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                <ImageIcon size={16} className="md:w-[18px] md:h-[18px]" />
                Chat Wallpaper
              </h3>
              <p className="text-xs md:text-sm text-zinc-400 mt-1">Set a custom background for chats</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="bg-[#323232] hover:bg-[#404040] text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleWallpaperChange}
                />
              </label>
              {watch('chatWallpaper') && (
                <button
                  type="button"
                  onClick={() => setValue('chatWallpaper', null)}
                  className="bg-red-600/10 hover:bg-red-600/20 text-red-500 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            {watch('chatWallpaper') && (
              <div className="mt-2">
                <img
                  src={watch('chatWallpaper')}
                  alt="Wallpaper preview"
                  className="h-20 w-32 object-cover rounded-lg border border-[#404040]"
                />
              </div>
            )}
          </div>
        </div>

        <SettingItem
          title="Time Format"
          description="Choose 12-hour or 24-hour format"
          icon={Clock}
        >
          <div className="flex bg-[#323232] rounded-lg p-1">
            <button
              type="button"
              onClick={() => setValue('timeFormat', '12h')}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded text-sm transition-colors ${
                watch('timeFormat') === '12h'
                  ? 'bg-[#248f60] text-white'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              12h
            </button>
            <button
              type="button"
              onClick={() => setValue('timeFormat', '24h')}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded text-sm transition-colors ${
                watch('timeFormat') === '24h'
                  ? 'bg-[#248f60] text-white'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              24h
            </button>
          </div>
        </SettingItem>
      </div>

      <button
        onClick={onSubmit}
        className="w-full sm:w-auto bg-[#248f60] text-white px-6 py-2.5 md:py-3 rounded-lg hover:bg-[#1e7a52] transition-colors font-medium"
      >
        Save Appearance Changes
      </button>
    </div>
  );
}