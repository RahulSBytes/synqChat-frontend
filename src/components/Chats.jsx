import { useEffect, useRef, useState } from 'react'
import EmojiPicker from 'emoji-picker-react';
import { Clapperboard, FileAudio, FileAudio2, FilePlay, FileText, Image, Menu, Paperclip, Send, SmilePlus, Video, X } from 'lucide-react'
import { useUIStore } from '../store/store';
import { useChatStore } from '../store/chatStore.js';
import { useAuthStore } from '../store/authStore.js';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { server } from '../constants/config.js';
import AttachmentGrid from './minicomponents/AttachmentGrid.jsx';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Chats() {

  const setIsNewGroupClicked = useUIStore((state) => state.setIsNewGroupClicked)

  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);

  const [msg, setMsg] = useState('');
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([])

  const user = useAuthStore((state) => state.user)
  const userExists = useAuthStore((state) => state.userExists)
  const currentSelectedChatId = useChatStore((state) => state.currentSelectedChatId)

  console.log("currentSelectedChatId ::", currentSelectedChatId);

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


  // -------------------------------------

  const [selectedFiles, setSelectedFiles] = useState([]);


  const handleFileSelect = (acceptedTypes) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptedTypes;
    input.multiple = true;

    input.onchange = (e) => {
      const newFiles = Array.from(e.target.files);

      if (newFiles.length > 0) {
        setSelectedFiles(currentFiles => {
          const emptySpace = 6 - currentFiles.length;

          let filesToAdd = [];

          if (emptySpace <= 0 || newFiles.length > emptySpace) {
            toast.error("only 6 files can be sent at a time.")
            return currentFiles;
          } else {
            filesToAdd = newFiles.slice(0, emptySpace);
          }

          const updatedFiles = [...currentFiles, ...filesToAdd];
          return updatedFiles;
        });
      }

    };

    input.onclick = setIsAttachmentOpen((prev) => !prev);

    input.click();
  };


  async function handleSendMsg() {
    const { text, attachment } = { text: msg, attachment: selectedFiles };

    if (!text.trim() && (!attachment || attachment.length === 0)) {
      toast.error("Something is missing");
      return
    };

    const formData = new FormData();
    formData.append('text', text);

    if (attachment && attachment.length > 0) {
      attachment.forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      const res = await axios.post(
        `${server}/api/v1/chats/sendMessage/${currentSelectedChatId}`,
        formData,
        { withCredentials: true }
      );

      setMsg('');
      setSelectedFiles([]);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Remove single file
  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all files
  const clearAllFiles = () => setSelectedFiles([]);

  // ---------------------------------

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
  let avatar = '';
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
          <div className="drawer-content ml-auto md:hidden">
            <label htmlFor="my-drawer-4" className="drawer-button">
              <Menu />
            </label>
          </div>
        </div>

        <div className="drawer drawer-end flex justify-end w-6 md:hidden">
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
                  <div key={_id} className={`chat ${sender === user._id ? "chat-end" : "chat-start"}`}>
                    {sender !== user._id && (
                      <div className="chat-image avatar">
                        <div className="w-8 rounded-full">
                          <img src="/image.png" alt="User avatar" />
                        </div>
                      </div>
                    )}
                    <div className={` w-full rounded-t-lg flex gap-1 flex-col ${sender === user._id ? "items-end" : "items-start"}`}>
                      {attachments.length > 0 && (
                        <label htmlFor='attachment' className={`p-1 flex justify-end w-[40%]`}>
                          <AttachmentGrid attachments={attachments} />
                          <input type="text" id='attachment' className='hidden' />
                        </label>
                      )}
                      {text.length > 0 && <div className={`max-w-[70%] py-2 px-3 rounded-t-md ${sender === user._id ? " bg-[#353535] rounded-l-lg " : "bg-[#689969] rounded-r-lg"}`}>
                        <span className="whitespace-pre-wrap break-words">{text}</span>
                      </div>}
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
              <div className="absolute flex flex-col items-start bottom-12 left-0 bg-[#272727] p-2 gap-1 rounded-lg shadow-lg z-10 w-max">
                <span
                  onClick={() => handleFileSelect('image/*')}
                  className='justify-start px-3 py-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-2 items-center w-full rounded cursor-pointer whitespace-nowrap'
                >
                  <Image size={14} />Images
                </span>
                <span
                  onClick={() => handleFileSelect('video/*')}
                  className='justify-start px-3 py-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-2 items-center w-full rounded cursor-pointer whitespace-nowrap'
                >
                  <FilePlay size={14} />Videos
                </span>
                <span
                  onClick={() => handleFileSelect('audio/*')}
                  className='justify-start px-3 py-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-2 items-center w-full rounded cursor-pointer whitespace-nowrap'
                >
                  <FileAudio2 size={14} />Audio
                </span>
                <span
                  onClick={() => handleFileSelect('*/*')}
                  className='justify-start px-3 py-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-2 items-center w-full rounded cursor-pointer whitespace-nowrap'
                >
                  <FileText size={14} />Documents
                </span>
              </div>
            )}
            <Paperclip onClick={() => setIsAttachmentOpen(prev => !prev)} size={18} width={18} height={18} />
          </div>

          <span onClick={() => setIsEmojiOpen(prev => !prev)} className='p-2 rounded-full hover:bg-[#313131] mr-2 cursor-pointer'>
            <SmilePlus size={18} width={18} height={18} />
          </span>

          <div className='flex items-center flex-1 flex-col'>
            {selectedFiles.length > 0 && (
              <div className='w-full mb-2 p-2 bg-[#343434] rounded-lg'>
                <div className='flex items-center justify-between mb-2'>
                  {selectedFiles.length < 6 && (
                    <div className=''>
                      <span className='text-sm text-gray-200'>
                        You can add {6 - selectedFiles.length} more
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={clearAllFiles}
                    className='text-xs text-red-400 hover:text-red-300 px-1 py-[2px] rounded hover:bg-[#505050] transition-colors'
                  >
                    Clear all
                  </button>
                </div>
                <div className='flex flex-col gap-1 max-h-32 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]'>
                  {selectedFiles.map((file, index) => (
                    <div key={`${file.name}-${index}`} className='flex items-center justify-between bg-[#484848] px-2 py-1 rounded'>
                      <div className='flex items-center flex-1 min-w-0'>
                        <span className='mr-2'>
                          {file.type.startsWith('image/') ? <Image/> :
                            file.type.startsWith('video/') ? <Clapperboard /> :
                              file.type.startsWith('audio/') ? <FileAudio /> : <FileText/>}
                        </span>
                        <div className='flex flex-col flex-1 min-w-0'>
                          <span className='text-xs text-white truncate'>{file.name}</span>
                          <span className='text-[10px] text-gray-400'>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(index)}
                        className='ml-2 p-1 hover:bg-[#606060] rounded-full text-red-400 text-sm leading-none'
                        title="Remove file"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

            <div className='flex items-center w-full'>
              <textarea
                onInput={autoResize}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full resize-none rounded-3xl px-4 outline-none min-h-[35px] max-h-[112px] py-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent bg-[#353535] text-white"
                placeholder={selectedFiles.length > 0 ? `Send ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} with message...` : "Type a message..."}
                rows={1}
              />
              <button
                type="button"
                onClick={handleSendMsg}
                className='p-2 rounded-full hover:bg-[#313131] ml-1 cursor-pointer'
                disabled={!msg.trim() && selectedFiles.length === 0}
              >
                <Send size={20} width={24} height={24} color={(!msg.trim() && selectedFiles.length === 0) ? '#666' : '#248f60'} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chats