import { Check, X } from "lucide-react";
import { useUIStore } from "../store/store";
import { userdata } from "./constants/userdata.js";



const CreateGroupForm = () => {
  const setIsNewGroupClicked = useUIStore((state) => state.setIsNewGroupClicked)
  function onSubmitHandler(){

  }

  return (
    <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#3B3B3B] w-full md:max-w-md max-w-sm rounded-lg shadow-lg px-12 pt-8 pb-4 relative">

        <X onClick={setIsNewGroupClicked} className="absolute top-6 right-6 text-gray-500 hover:text-gray-700" size={20} strokeWidth={3} color="#c1c1c1" />
        <h2 className="text-xl font-semibold mb-6 text-center"> Create New Group </h2>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Group Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter group name"
              className="w-full rounded border border-gray-300 px-3 py-1 outline-none "
            />
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-300 mb-2"> Members </label>
            <div className="flex flex-col gap-3 pl-2 h-60 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">
              {userdata.map(({ dp, name, id, isGroupChat = false }) => (
                <div key={id} className="items-center flex justify-between pr-4">
                  <div className="flex gap-2">
                    <img src={dp || '/image.png'}
                      className="h-8 w-8 rounded-full border-[2px] border-[#248F60]" />
                    <span className="line-clamp-1 font-semibold">{name}</span>
                  </div>
                  <label className="toggle text-base-content">
                    <input type="checkbox" />
                    <X size={16} strokeWidth={3} />
                    <Check size={16} strokeWidth={3} color="#248F60"/>
                  </label>
                </div>
              ))}
            </div>
            <button className="btn btn-block mt-4 h-8 px-4 rounded-md text-sm bg-[#248F60] text-white font-medium hover:bg-[#1f744e] transition">Create</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateGroupForm;