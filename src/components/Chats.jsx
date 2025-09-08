import React, { useEffect, useRef, useState } from 'react'
import AppLayout from './layout/AppLayout'
import { testchats } from './constants/userdata'
import EmojiPicker from 'emoji-picker-react';
import { Ellipsis, FileAudio2, FilePlay, FileText, Image, Menu, Paperclip, Send, SmilePlus, X } from 'lucide-react'
import { useUIStore } from '../store/store';

function Chats() {

 const setIsNewGroupClicked = useUIStore((state)=> state.setIsNewGroupClicked)
  
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);

  const [msg, setMsg] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, []);

  function onEmojiSelect(emoji) {
    setMsg(prev => prev + emoji.emoji)
  }

  function handleSendMsg() {

  }

  function handlemsgchange(e) {
    console.log(msg)
    setMsg(e.target.value)
  }

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 90) + 'px';
  };


  return (
    <div className='flex-1 min-w-0 h-full flex flex-col gap-3 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]'>
      <div className='sticky bg-[#242424] top-0 z-10 flex justify-between items-center p-3 px-8'>
        <div className='flex items-center w-full'>
          <img src="/image.png" className='h-10 rounded-full mr-2 border-2 border-zinc-600' />
          <div className='flex flex-col'>
            <span className='font-semibold'>krishna kumar vishwakarma</span>
            <span className='text-xs font-medium text-[#248f60]'>Online</span>
          </div>
        </div>
        
        <div className="drawer drawer-end  flex justify-end w-6">
              <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content">

                <label htmlFor="my-drawer-4" className="drawer-button">
                  <Menu />
                </label>

              </div>

              {/* side bar code for mobile layout */}
              <div className="drawer-side">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-[#313131] text-base-content min-h-full w-80 p-4 px-8 ">

                  <div className="flex flex-col">

                    <label htmlFor="my-drawer-4" className="drawer-button self-end mb-6 p-2 ">
                      <X strokeWidth={2} />
                    </label>
                    <div className="mb-8">
                      <div className=' w-full flex flex-col items-center gap-1'>
                        <img src="/image.png" className='h-16 rounded-full border-[1px] border-zinc-400' />
                        <h4 className='font-semibold text-lg'>Jhon Doe</h4>
                        <p className='text-center text-sm'>example@gmail.com</p>
                        <p className='px-4 text-center text-zinc-300 text-xs'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, incidunt!</p>
                      </div>
                    </div>
                    <li className="py-2 w-full pl-3 hover:bg-[#414141]" >Profile</li>
                    <li className="py-2 w-full pl-3 hover:bg-[#414141]">Find People</li>
                    <li onClick={setIsNewGroupClicked} className="cursor-pointer py-2 w-full pl-3 hover:bg-[#414141]">Create New Group</li>
                    <li className="py-2 w-full pl-3 hover:bg-[#414141]">Notification</li>
                    <li className="py-2 w-full pl-3 hover:bg-[#414141]">Logout</li>
                    <li className="py-2 w-full pl-3 hover:bg-[#414141]">Setting</li>
                    <li className="py-2 w-full pl-3 hover:bg-[#414141]">Switch To Admin</li>
                  </div>
                </ul>
              </div>
            </div>
      </div>



      {/* chat section */}

      <div className='px-6 min-w-0'>
        {
          testchats && testchats.map(({ user, msg }, index) => {
            return <div key={index} className={`chat ${user === "receiver" ? "chat-start" : "chat-end"}`}>
              {
                user === "receiver" && <div className="chat-image avatar">
                  <div className="w-8 rounded-full">
                    <img src="/image.png" />
                  </div>
                </div>
              }
              <div className={`max-w-[60%] whitespace-pre-wrap break-words  py-2 px-3 rounded-t-lg ${user === "receiver" ? "bg-[#353535] rounded-r-lg" : "bg-[#689969] rounded-l-lg"} `}>
                {msg}
              </div>
            </div>
          })
        }
        <div ref={messagesEndRef} />
      </div>

      {/* the input field */}
      <div className='py-2 px-3 w-full sticky bottom-0 bg-[#242424]'>
        {isEmojiOpen && <EmojiPicker className='absolute z-10' onEmojiClick={onEmojiSelect} height={200} width='100%' theme='dark' previewConfig={{ showPreview: false }} searchDisabled={true} skinTonesDisabled={true} />}
        <div className='flex items-center'>
          <span className='p-2 rounded-full hover:bg-[#313131]  cursor-pointer'>
          {isAttachmentOpen &&  <div className="absolute flex flex-col items-start bottom-12 bg-[#272727] p-2 gap-1">
            <span className='justify-start pl-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-1 items-center w-full'><Image size={14} />Image</span>
              <span className='justify-start pl-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-1 items-center w-full'><FilePlay size={14} />Video</span>
              <span className='justify-start pl-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-1 items-center w-full'><FileAudio2 size={14} />Audio</span>
              <span className='justify-start pl-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-1 items-center w-full'><FileText size={14} />Document</span>
            </div>}
            <Paperclip onClick={()=>setIsAttachmentOpen(prev=>!prev)} size={18} width={18} height={18} />
          </span>
          <span onClick={() => setIsEmojiOpen(prev => !prev)} className='p-2 rounded-full hover:bg-[#313131] mr-2 cursor-pointer'>
            <SmilePlus size={18} width={18} height={18} />
          </span>
          <div className='flex items-center flex-1'>
            <textarea
              onInput={autoResize}
              value={msg}
              onChange={handlemsgchange}
              className="w-full resize-none rounded-3xl  px-4 outline-none  min-h-[35px] max-h-[112px] py-2  overflow-y-auto  scrollbar-thin scrollbar-track-transparent"
              placeholder="Type a message..."
              rows={1}
            />
            <span onClick={handleSendMsg} className='p-2 rounded-full hover:bg-[#313131] ml-1 cursor-pointer'>
              <Send size={20} width={24} height={24} color='#248f60' />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppLayout(Chats)