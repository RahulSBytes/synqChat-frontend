// settings/components/shared/FormField.jsx
export default function FormField({ 
  label, 
  name, 
  type = 'text', 
  register, 
  errors, 
  rules,
  icon: Icon 
}) {

  const error = errors?.[name];
  
  return (
    <div>
      <label className="text-sm font-medium mb-2 text-zinc-300 flex items-center gap-2">
        {Icon && <Icon size={16} />}
        {label}
      </label>
      <input
        type={type}
        {...register(name, rules)}
        className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
}