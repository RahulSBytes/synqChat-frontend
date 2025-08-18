import React from 'react'
import AppLayout from './layout/AppLayout'
import { testchats } from './constants/userdata'
import { Ellipsis } from 'lucide-react'

function Chats() {
  return (
    <div className='px-6 py-3 flex flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-track-transparent'>
      <div className='flex justify-between items-center px-3 border-b border-b-gray-400 pb-2'>
        <div className='flex items-center'>
        <img src="/image.png"  className='h-8 rounded-full mr-2 border border-2 border-zinc-300' />
        <div className='flex flex-col'>
          <span className=''>krishna kumar vishwakarma</span>
          <span className='text-xs text-[#248f60]'>Online</span>
        </div>
        </div>
        <Ellipsis className='rounded-lg w-7 h-5 bg-[#2a2a2a] cursor-pointer' /> 
      </div>
      {
        testchats && testchats.map(({ user, msg }) => {
          return <div className={`chat ${user === "receiver" ? "chat-start" : "chat-end"}`}>
            {user === "receiver" && <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                />
              </div>
            </div>}
            <div className={`max-w-[60%] whitespace-pre-wrap break-words  py-2 px-3 rounded-t-md ${user === "receiver" ? "bg-[#343338] rounded-r-md" : "bg-[#40a368] rounded-l-md"} `}>
              {msg}
            </div>
          </div>
        })
      }
    </div>
  )
}

export default AppLayout(Chats)