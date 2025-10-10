import { Check, X, Camera, Trash2 } from "lucide-react";
import { useState } from "react";
import { useUIStore } from "../store/store.js";
import { useAuthStore } from "../store/authStore.js";
import { eligibleUserForGroupCreation } from "../helpers/helpers.js";
import { useApiStore } from "../store/apiStore.js";
import toast from "react-hot-toast";

const CreateGroupForm = () => {
  const setIsNewGroupClicked = useUIStore((state) => state.setIsNewGroupClicked);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setname] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const contacts = useApiStore((state) => state.contacts)
  const createGroup = useApiStore((state) => state.createGroup)
  const user = useAuthStore((state) => state.user)


  const userdata = eligibleUserForGroupCreation(contacts, user);

  async function onSubmitHandler(e) {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      alert("Please enter a group name");
      return;
    }

    if (selectedMembers.length < 3) {
      alert("Please select at least three member");
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', description.trim());
    formData.append('members', JSON.stringify(selectedMembers));

    if (selectedAvatar) {
      formData.append('avatar', selectedAvatar);
    }

    const success = await createGroup(formData)
    console.log("hellow new group ::", success)
    if (!success) return toast.error("error creating group")
      toast.success("group created successfully")

    setIsNewGroupClicked();
  }

  function handleMemberToggle(memberId) {
    setSelectedMembers(prev => prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId])
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setSelectedAvatar(null);
    setPreviewUrl(null);
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ">
      <div className="bg-[#3B3B3B] w-full md:max-w-md max-w-sm rounded-lg shadow-lg px-6 md:px-12 pt-8 pb-4 relative max-h-[90vh] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">
        <X
          onClick={setIsNewGroupClicked}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 cursor-pointer"
          size={20}
          strokeWidth={3}
          color="#c1c1c1"
        />

        <h2 className="text-xl font-semibold mb-6 text-center text-white"> Create New Group </h2>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <label className="cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Group avatar preview"
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-[#248F60] hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={20} color="white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-600 border-2 border-dashed border-[#248F60] flex items-center justify-center hover:bg-gray-500 transition-colors">
                    <Camera size={24} color="#248F60" />
                  </div>
                )}
              </label>

              {previewUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAvatar();
                  }}
                  className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition transform translate-x-1/4 translate-y-1/4"
                >
                  <Trash2 size={12} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Group Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter group name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-1 outline-none"
            />
          </div>

          {/* Description Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              placeholder="Enter group description..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none resize-none"
            />
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-300 mb-2"> Members </label>
            <div className="flex flex-col gap-3 pl-2 h-48 md:h-60 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">
              {userdata.map(({ avatar,fullName, username, _id }) => (
                <div key={_id} className="items-center flex justify-between pr-4">
                  <div className="flex gap-2 items-center min-w-0 flex-1">
                    <img src={avatar.url || '/image.png'}
                      className="h-8 w-8 rounded-full border-[2px] border-[#248F60] flex-shrink-0" />
                    <div>

                      <span className="line-clamp-1 font-semibold text-zinc-50 text-[14px] md:text-base truncate">{fullName}</span>
                      <span className="line-clamp-1 font-semibold text-[10px] text-zinc-300">{username}</span>
                    </div>
                  </div>
                  <label onChange={() => handleMemberToggle(_id)} className="toggle text-base-content flex-shrink-0">
                    <input type="checkbox" />
                    <X size={16} strokeWidth={3} />
                    <Check size={16} strokeWidth={3} color="#248F60" />
                  </label>
                </div>
              ))}
            </div>
            <button type="submit" className="btn btn-block mt-4 h-8 px-4 rounded-md text-sm bg-[#248F60] text-white font-medium hover:bg-[#1f744e] transition">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupForm;