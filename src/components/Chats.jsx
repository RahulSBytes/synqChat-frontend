import { useEffect, useRef, useState } from 'react'
import EmojiPicker from 'emoji-picker-react';
import { FileAudio2, FilePlay, FileText, Image, Menu, Paperclip, Send, SmilePlus, X } from 'lucide-react'
import { useUIStore } from '../store/store';
import { useChatStore } from '../store/chatStore.js';
import { useAuthStore } from '../store/authStore.js';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { server } from '../constants/config.js';
import AttachmentGrid from './minicomponents/AttachmentGrid.jsx';

function Chats() {

  const setIsNewGroupClicked = useUIStore((state) => state.setIsNewGroupClicked)

  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);

  const [msg, setMsg] = useState('');
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([])

  const user = useAuthStore((state) => state.user)
  const currentSelectedChatId = useChatStore((state) => state.currentSelectedChatId)

  useEffect(() => {
    axios.get(`${server}/api/v1/chats/getmsgs/${currentSelectedChatId}`, { withCredentials: true })
      .then(({ data }) => setMessages(data.chat))
      .catch(err => console.log(err))
  }, [currentSelectedChatId])


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [messages]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, []);


  function onEmojiSelect({ emoji }) {
    setMsg(prev => prev + emoji)
  }

  const handleSendMsg = async (param) => {
    const { text, attachment } = param;
    const formData = new useForm();
    formData.append('text', text)
    formData.append('attachment', attachment[0])

    console.log("forData",formData);

    const { data } = await axios.post(`${server}/api/v1/auth/register`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    userExists(data)
    navigate('/')
  }

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 90) + 'px';
  };

  const contacts = useChatStore((state) => state.contacts)
  const chatInfo = contacts?.find((el) => el._id == currentSelectedChatId)

  if (!chatInfo || !user) {
    return <div>Loading...</div>
  }

  const name = chatInfo.groupChat ? chatInfo.name : chatInfo.members.find((el) => el._id != user._id)?.fullName;
  let avatar;
  if (!chatInfo.groupChat) avatar = chatInfo.members.find((el) => el._id != user._id).avatar.url;



  return (
    <div className='flex-1 min-w-0 h-full flex flex-col relative'>
      {/* STICKY HEADER */}
      <div className='sticky bg-[#242424] top-0 z-10 flex justify-between items-center p-3 px-8 border-b border-gray-700'>
        <div className='flex items-center w-full'>
          {chatInfo.groupChat ?
            <div className="mr-2 flex-col p-2 w-8 h-8 gap-1 flex bg-zinc-500 rounded-full justify-center items-center">
              <div className="flex gap-1">
                <div className="h-[6px] w-[6px] bg-zinc-800 rounded-sm"></div>
                <div className="h-[6px] w-[6px] bg-zinc-800 rounded-sm"></div>
              </div>
              <div className="flex gap-1">
                <div className="h-[6px] w-[6px] bg-zinc-800 rounded-sm"></div>
                <div className="h-[6px] w-[6px] bg-zinc-800 rounded-sm"></div>
              </div>
            </div> :
            <img src={avatar} className='h-10 w-10 rounded-full mr-2 border-2 border-zinc-600' />
          }

          <div className='flex flex-col'>
            <span className='font-semibold'>{name}</span>
            <span className='text-xs font-medium text-[#248f60]'>Online</span>
          </div>
          <div className="drawer-content ml-auto">
            <label htmlFor="my-drawer-4" className="drawer-button">
              <Menu />
            </label>
          </div>
        </div>

        <div className="drawer drawer-end flex justify-end w-6">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          {/* side bar code for mobile layout */}
          <div className="drawer-side">
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-[#313131] text-base-content min-h-full w-80 p-4 px-8">
              <div className="flex flex-col">
                <label htmlFor="my-drawer-4" className="drawer-button self-end mb-6 p-2">
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

      {/* MESSAGES SECTION - SCROLLABLE WITH BOTTOM-TO-TOP FLOW */}
      <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444] px-6 py-4 flex flex-col'>
        {(messages.length > 0) ? (
          <>
            {/* Spacer to push messages to bottom when few messages */}
            <div className="flex-1 min-h-0"></div>
            <div className="flex flex-col gap-2">
              {messages.map(({ text, _id, sender, attachments }) => {
                return (
                  <div key={_id} className={`chat ${sender === user._id ? "chat-start" : "chat-end"}`}>
                    {sender === user._id && (
                      <div className="chat-image avatar">
                        <div className="w-8 rounded-full">
                          <img src="/image.png" alt="User avatar" />
                        </div>
                      </div>
                    )}
                    <div className={` max-w-[65%] rounded-t-lg flex gap-1 flex-col ${sender === user._id ? "items-start" : "items-end"}`}>
                      {attachments.length > 0 && (
                        <label htmlFor='attachment' className={`p-1 max-w-[50%] `}>
                          <AttachmentGrid attachments={attachments} />
                          <input type="text" id='attachment' className='hidden'  />
                        </label>
                      )}
                      <div className={` py-2 px-3 w-fit rounded-t-md ${sender === user._id ? " bg-[#353535] rounded-r-lg " : "bg-[#689969] rounded-l-lg"}`}>
                        <span className="whitespace-pre-wrap break-words">{text}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-500">No messages yet</p>
          </div>
        )}
      </div>

      {/* STICKY INPUT SECTION */}
      <div className='sticky bottom-0 bg-[#242424] pt-2 pb-4 px-3 w-full border-t border-gray-700 relative'>
        {isEmojiOpen && (
          <div className="absolute bottom-full left-0 w-full z-20">
            <EmojiPicker
              onEmojiClick={onEmojiSelect}
              height={200}
              width='100%'
              theme='dark'
              previewConfig={{ showPreview: false }}
              searchDisabled={true}
              skinTonesDisabled={true}
            />
          </div>
        )}

        <form className='flex items-center relative'>
          <div className='p-2 rounded-full hover:bg-[#313131] cursor-pointer relative'>
            {isAttachmentOpen && (
              <div className="absolute flex flex-col items-start bottom-12 left-0 bg-[#272727] p-2 gap-1 rounded-lg shadow-lg z-10 w-min">
                <span className='justify-start px-2 py-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-1 items-center w-full rounded cursor-pointer'>
                  <Image size={14} />Image
                </span>
                <span className='justify-start px-2 py-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-1 items-center w-full rounded cursor-pointer'>
                  <FilePlay size={14} />Video
                </span>
                <span className='justify-start px-2 py-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-1 items-center w-full rounded cursor-pointer'>
                  <FileAudio2 size={14} />Audio
                </span>
                <span className='justify-start px-2 py-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-1 items-center w-full rounded cursor-pointer'>
                  <FileText size={14} />Document
                </span>
              </div>
            )}
            <Paperclip onClick={() => setIsAttachmentOpen(prev => !prev)} size={18} width={18} height={18} />
          </div>

          <span onClick={() => setIsEmojiOpen(prev => !prev)} className='p-2 rounded-full hover:bg-[#313131] mr-2 cursor-pointer'>
            <SmilePlus size={18} width={18} height={18} />
          </span>

          <div className='flex items-center flex-1'>
            <textarea
              onInput={autoResize}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="w-full resize-none rounded-3xl px-4 outline-none min-h-[35px] max-h-[112px] py-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent bg-[#353535] text-white"
              placeholder="Type a message..."
              rows={1}
            />
            <button onClick={handleSendMsg} className='p-2 rounded-full hover:bg-[#313131] ml-1 cursor-pointer'>
              <Send size={20} width={24} height={24} color='#248f60' />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chats