import { Menu, Search, X } from 'lucide-react'
import Groupprof from './layout/Groupprof'
import { useUIStore } from '../store/store.js'
import { useNavigate} from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore.js'
import { useApiStore } from '../store/apiStore.js';


function UsersList({ onlineUsers }) {

  const setIsNewGroupClicked = useUIStore((state) => state.setIsNewGroupClicked)

  const [search, setSearch] = useState('')

  const user = useAuthStore(state => state.user)
  const contacts = useApiStore((state) => state.contacts)
  const fetchContact = useApiStore((state) => state.fetchContact)

  useEffect(() => {
    (
      async function () {
        const success = await fetchContact();
        if (!success) toast.error("error fetching contact")
      }
    )()
 
  }, [])

  function handleSearch(string) {
    setSearch(string);
  }

  const filteredContacts = contacts.filter((el) => {
    if (search.trim() === '') return true;
    if (el.groupChat) {
      return el.name?.toLowerCase().includes(search.toLowerCase());
    } else {
      const otherMember = el.members.find((member) => member._id !== user._id);
      return otherMember?.fullName?.toLowerCase().includes(search.toLowerCase());
    }
  });

  const isGroupIconClicked = useUIStore((state) => state.isGroupIconClicked)
  const navigate = useNavigate()


  return (
    <aside className="flex flex-col bg-[#242424] h-screen w-full pt-6">
      {/* Header */}
      <div onClick={() => navigate('/')} className="cursor-pointer flex mb-6 gap-1">
        <div className="flex justify-between w-full ml-5">
          <span className="font-semibold flex">
            <img src="/logo.png" className="h-8 mr-1" />
            SynqChat
          </span>
          {/* Mobile drawer toggle */}
          <label htmlFor="my-drawer-4" className="drawer-button md:hidden">
            <Menu />
          </label>
        </div>

        {/* Mobile drawer content */}
        <div className="drawer-content ml-auto md:hidden">
          <div className="drawer drawer-end flex justify-end w-6">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-side">
              <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu bg-[#313131] text-base-content min-h-full w-80 p-4 px-8 max-w-full">
                <div className="flex flex-col">
                  <label htmlFor="my-drawer-4" className="drawer-button self-end mb-6 p-2">
                    <X strokeWidth={2} />
                  </label>
                  <div className="mb-8 flex flex-col items-center gap-1">
                    <img src="/image.png" className="h-16 rounded-full border-[1px] border-zinc-400" />
                    <h4 className="font-semibold text-lg">John Doe</h4>
                    <p className="text-center text-sm">example@gmail.com</p>
                    <p className="px-4 text-center text-zinc-300 text-xs">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, incidunt!
                    </p>
                  </div>
                  <li className="py-2 w-full pl-3 hover:bg-[#414141]">Profile</li>
                  <li className="py-2 w-full pl-3 hover:bg-[#414141]">Find People</li>
                  <li onClick={setIsNewGroupClicked} className="cursor-pointer py-2 w-full pl-3 hover:bg-[#414141]">
                    Create New Group
                  </li>
                  <li className="py-2 w-full pl-3 hover:bg-[#414141]">Notification</li>
                  <li className="py-2 w-full pl-3 hover:bg-[#414141]">Logout</li>
                  <li className="py-2 w-full pl-3 hover:bg-[#414141]">Setting</li>
                  <li className="py-2 w-full pl-3 hover:bg-[#414141]">Switch To Admin</li>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex justify-center">
        <div className="w-[70%] flex bg-[#3B3B3B] rounded-full pl-4 pr-2 py-[3px] items-center">
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            type="text"
            placeholder="search contact"
            className="w-full bg-transparent outline-none text-sm pb-[2px]"
          />
          <span className="flex justify-center items-center cursor-pointer p-1 rounded-full hover:bg-[#4b4b4b]">
            <Search size={16} strokeWidth={2.2} />
          </span>
        </div>
      </div>

      {contacts && (
        <div className="flex-1 overflow-y-auto px-[2%] my-4 flex flex-col gap-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">
          {isGroupIconClicked
            ? filteredContacts.map(
              (chat) => chat.groupChat && <Groupprof key={chat._id} data={chat} />
            )
            : filteredContacts.map((chat) => (
              <Groupprof key={chat._id} data={chat} onlineUsers={onlineUsers} />
            ))}
        </div>
      )}
    </aside>
  )
}

export default UsersList