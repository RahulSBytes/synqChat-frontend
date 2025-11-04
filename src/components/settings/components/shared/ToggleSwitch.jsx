// settings/components/shared/ToggleSwitch.jsx
export default function ToggleSwitch({ label, description, icon: Icon, checked, onChange }) {
  return (
    <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
            {Icon && <Icon size={16} className="md:w-[18px] md:h-[18px]" />}
            {label}
          </h3>
          {description && (
            <p className="text-xs md:text-sm text-zinc-400 mt-1">{description}</p>
          )}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#404040] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#248f60]"></div>
        </label>
      </div>
    </div>
  );
}