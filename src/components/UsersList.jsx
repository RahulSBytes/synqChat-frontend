import { Search } from 'lucide-react'
import { userdata } from './constants/userdata'
import Groupprof from './layout/Groupprof'
import { useUIStore } from '../store/store.js'
import { useNavigate } from 'react-router-dom'
import { server } from '../constants/config.js'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import { useChatStore } from '../store/chatStore.js'


function UsersList() {

  const setContacts = useChatStore(state => state.setContacts)
  const contacts = useChatStore(state => state.contacts)

  useEffect(() => {
    async function fetchData() {
      axios.get(`${server}/api/v1/chats`, { withCredentials: true })
        .then(({ data }) => setContacts(data.chats))
        .catch(err => console.log(err))
    }
    fetchData();
  }, [])





  const isGroupIconClicked = useUIStore((state) => state.isGroupIconClicked)
  const navigate = useNavigate()

  return (
    <aside className="hidden md:flex flex-col bg-[#242424] pt-6">
      <div onClick={() => navigate('/')} className='cursor-pointer flex m-auto mb-6 gap-1'>
        <img src="/logo.png" className='h-8' /><span className='font-semibold'>SynqChat</span>
      </div>
      <div className="flex bg-[#3B3B3B] m-auto rounded-full pl-4 pr-2 py-[3px] items-center">
        <input
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
            ? contacts.map((chat) => (
              chat.groupChat && (<Groupprof key={chat._id} data={chat}
              />
              )
            ))
            : contacts.map((chat) => (
              <Groupprof
                key={chat._id}
                data={chat}
              />
            ))
        }
      </div>
      }
    </aside>
  )
}

export default UsersList
