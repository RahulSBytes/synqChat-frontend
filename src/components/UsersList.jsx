import { Search } from 'lucide-react'
import Groupprof from './layout/Groupprof'
import { useUIStore } from '../store/store.js'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore.js'
import { useApiStore } from '../store/apiStore.js';


function UsersList({onlineUsers}) {

  const [search, setSearch] = useState('')

  const user = useAuthStore(state => state.user)
  const contacts = useApiStore((state)=>state.contacts)
  const fetchContact = useApiStore((state)=>state.fetchContact)

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
    <aside className="hidden md:flex flex-col bg-[#242424] pt-6">
      <div onClick={() => navigate('/')} className='cursor-pointer flex m-auto mb-6 gap-1'>
        <img src="/logo.png" className='h-8' /><span className='font-semibold'>SynqChat</span>
      </div>
      <div className="flex bg-[#3B3B3B] m-auto rounded-full pl-4 pr-2 py-[3px] items-center">
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          type="text"
          placeholder="seach contact"
          className="w-full bg-transparent outline-none text-sm pb-[2px]"
        />
        <span className='flex justify-center items-center cursor-pointer p-1 rounded-full hover:bg-[#4b4b4b]'>
          <Search size={16} strokeWidth={2.2} />
        </span>
      </div>


      {contacts && <div className="flex-1 flex flex-col gap-1 my-4 px-2 pl-4 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">
        {
          isGroupIconClicked
            ? filteredContacts.map((chat) => (
              chat.groupChat && (<Groupprof key={chat._id} data={chat}
              />
              )
            ))
            : filteredContacts.map((chat) => (
              <Groupprof
                key={chat._id}
                data={chat}
                onlineUsers={onlineUsers}
              />
            ))
        }
      </div>
      }
    </aside>
  )
}

export default UsersList