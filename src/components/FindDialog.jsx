import { X } from "lucide-react";
import { useUIStore } from "../store/store.js";
import { userdata } from "./constants/userdata.js";
const FindDialog = () => {

  const setIsSearchPeopleClicked = useUIStore((state) => state.setIsSearchPeopleClicked)

  return (
    <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#3B3B3B] w-full max-w-md rounded-lg shadow-lg px-12 py-8 pb-10 relative">

        <X onClick={setIsSearchPeopleClicked} className="absolute top-6 right-6 text-gray-500 hover:text-gray-700" size={20} strokeWidth={3} color="#c1c1c1" />
        <h2 className="text-xl font-semibold mb-6 text-center"> Find People On <span className="font-bold text-[#248F60]">SynqChat</span> </h2>

        <form className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Enter user email"
              className="w-full rounded border border-gray-300 px-3 py-1 outline-none "
            />
          </div>
          <div className="flex flex-col gap-3 pl-2 h-60 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">
            {userdata.map(({ dp, name, id, isGroupChat = false }) => (
              <div className="flex justify-between pr-4">
                <div className="flex gap-2">
                  <img src={dp || '/image.png'} className="h-8 w-8 rounded-full border-[2px] border-[#248F60]" />
                  <span className="line-clamp-1 font-semibold">{name}</span>
                </div>
                <button className="px-4 rounded-md text-xs bg-[#248F60] text-white font-medium hover:bg-[#1f744e] transition">
                  invite
                </button> 
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FindDialog;