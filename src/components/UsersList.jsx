import { Dot, Search } from 'lucide-react'
import { userdata } from './constants/userdata'
import Groupprof from './layout/Groupprof'
import { useState } from 'react'

function UsersList() {

  const [isGroupClicked, setIsGroupClicked] = useState(false);


  return (
    <aside className="w-80 hidden md:flex flex-col bg-[#242424] pt-6">
      <div className='flex m-auto mb-6 gap-1'>
        <img src="/logo.png" className='h-8' /><span className='font-semibold'>SyncChat</span>
      </div>
      <div className="flex w-3/4 bg-[#3B3B3B] m-auto rounded-full px-3 py-[3px]">
        <input
          type="text"
          placeholder="search user"
          className="w-full bg-transparent outline-none text-sm pb-[2px]"
        />
        <Search size={18} strokeWidth={2} />
      </div>


      <div className="flex-1 flex flex-col gap-2 my-4 px-2 pl-6 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">
        {
          isGroupClicked
            ? userdata.map(({ dp, name, lastMessage, time, id, isGroupChat = false }) => (
              isGroupChat && ( <Groupprof key={id} name={name}
                  lastMessage={lastMessage}
                  time={time}
                  dp={dp}
                  isGroupChat={isGroupChat}
                />
              )
            ))
            : userdata.map(({ dp, name, lastMessage, time, id, isGroupChat = false }) => (
              <Groupprof
                key={id}
                name={name}
                lastMessage={lastMessage}
                time={time}
                dp={dp}
                isGroupChat={isGroupChat}
              />
            ))
        }
      </div>
    </aside>
  )
}

export default UsersList
