import React, { useEffect, useRef, useState } from 'react'
import AppLayout from './layout/AppLayout'
import { testchats } from './constants/userdata'
import EmojiPicker from 'emoji-picker-react';
import { Ellipsis, Paperclip, Send, SmilePlus } from 'lucide-react'

function Chats() {

  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const [msg, setMsg] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, []);

  function onEmojiSelect(emoji) {
    setMsg(prev => prev + emoji.emoji)
  }

  function handleMsgSubmit() {

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
        <div className='flex items-center'>
          <img src="/image.png" className='h-10 rounded-full mr-2 border-2 border-zinc-600' />
          <div className='flex flex-col'>
            <span className='font-semibold'>krishna kumar vishwakarma</span>
            <span className='text-xs font-medium text-[#248f60]'>Online</span>
          </div>
        </div>
        <Ellipsis size={24} className='rounded-lg cursor-pointer' />
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
          <span className='p-2 rounded-full hover:bg-[#313131] cursor-pointer'>
            <Paperclip size={18} width={18} height={18} />
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
            <span onClick={handleMsgSubmit} className='p-2 rounded-full hover:bg-[#313131] ml-1 cursor-pointer'>
              <Send size={20} width={24} height={24} color='#248f60' />
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AppLayout(Chats)