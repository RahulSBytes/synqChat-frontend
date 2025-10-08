import { useEffect, useRef, useState } from 'react'
import EmojiPicker from 'emoji-picker-react';
import { ArrowLeft, Clapperboard, Ellipsis, FileAudio, FileAudio2, FilePlay, FileText, Image, Paperclip, Send, SmilePlus, X } from 'lucide-react'
import { useChatStore } from '../store/chatStore.js';
import moment from 'moment'
import { useAuthStore } from '../store/authStore.js';
import AttachmentGrid from './minicomponents/AttachmentGrid.jsx';
import toast from 'react-hot-toast';
import TypingIndicator from './minicomponents/TypingIndicator.jsx'
import { useApiStore } from '../store/apiStore.js';
import { getSocket } from '../context/SocketContext.jsx';
import { MESSAGE_DELETED, NEW_MESSAGE, START_TYPING, STOP_TYPING, UPDATE_LAST_MESSAGE } from '../constants/events.js';
import useSocketEvents from '../hooks/useSocketEvents.js';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useTypingIndicator } from '../hooks/useTypingIndicator.js';
import Profile from "./layout/Profile.jsx"
import axios from 'axios';
import { server } from '../constants/config.js';

function Chats() {
  const { onlineUsers } = useOutletContext()
  const [sending, setSending] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);

  const emojiRef = useRef(null);
  const attachmentRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (isEmojiOpen && emojiRef.current && !emojiRef.current.contains(e.target)) {
        setIsEmojiOpen(false);
      }
      if (isAttachmentOpen && attachmentRef.current && !attachmentRef.current.contains(e.target)) {
        setIsAttachmentOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEmojiOpen, isAttachmentOpen]);

  const [msg, setMsg] = useState('');
  const messagesEndRef = useRef(null);

  const user = useAuthStore((state) => state.user)
  const { fetchMessages, addMessageFromSocket, sendMessage, messagesRelatedToChat, updateMessageDeletionFromSocket,updateContactsList } = useApiStore()
  const currentSelectedChatId = useChatStore((state) => state.currentSelectedChatId)

  useEffect(() => {
    (async function () {
      const success = await fetchMessages(currentSelectedChatId)
      if (!success) toast.error("failed fetching messages")
    })()
  }, [currentSelectedChatId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [messagesRelatedToChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, []);

  function onEmojiSelect({ emoji }) {
    setMsg(prev => prev + emoji)
  }

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    messageId: null,
    x: 0,
    y: 0,
    data: null
  });

  const chatContainerRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, messageId: null, x: 0, y: 0, data: null });
      }
    };
    const el = chatContainerRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    return () => el && el.removeEventListener("scroll", handleScroll);
  }, [contextMenu.visible]);

  const handleContextMenu = (messageId, data, e) => {
    e.preventDefault();
    const menuWidth = 200;
    const menuHeight = 150;

    let x = e.clientX;
    let y = e.clientY;

    const { innerWidth, innerHeight } = window;
    if (x + menuWidth > innerWidth) x = innerWidth - menuWidth - 10;
    if (y + menuHeight > innerHeight) y = innerHeight - menuHeight - 10;

    setContextMenu({ visible: true, messageId, x, y, data });
  };

  useEffect(() => {
    const closeMenu = () => setContextMenu({ visible: false, messageId: null, x: 0, y: 0, data: null });
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

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
          if (emptySpace <= 0 || newFiles.length > emptySpace) {
            toast.error("only 6 files can be sent at a time.")
            return currentFiles;
          }
          const updatedFiles = [...currentFiles, ...newFiles.slice(0, emptySpace)];
          return updatedFiles;
        });
      }
    };
    input.onclick = setIsAttachmentOpen((prev) => !prev);
    input.click();
  };

  const socket = getSocket()

  async function handleSendMsg() {
    const { text, attachment } = { text: msg, attachment: selectedFiles };
    if (!text.trim() && (!attachment || attachment.length === 0)) {
      toast.error("Something is missing");
      return;
    }
    setSending(true);
    setSelectedFiles([]);
    const formData = new FormData();
    formData.append('text', text);
    if (attachment && attachment.length > 0) {
      attachment.forEach((file) => formData.append("files", file));
    }
    const success = await sendMessage(formData, currentSelectedChatId);
    if (!success) {
      toast.error("error sending message");
      setSelectedFiles(attachment);
    } else setMsg('');
    setSending(false);
  }

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  const clearAllFiles = () => setSelectedFiles([]);

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 90) + 'px';
  };

  const contacts = useApiStore((state) => state.contacts)
  const chatInfo = contacts?.find((el) => el._id == currentSelectedChatId)
  if (!chatInfo || !user) return <div>Loading...</div>;

  let { _id: otherUserId, fullName, avatar } = chatInfo.members.find((el) => el._id != user._id)
  if (chatInfo.groupChat) fullName = chatInfo.name

  let isDeleteForEveryone = false;
  async function handleDeleteMessage(messageId, messageInfo, isDeleteForEveryone) {
    const endpoint = isDeleteForEveryone
      ? `${server}/api/v1/chats/${messageId}/delete-for-everyone`
      : `${server}/api/v1/chats/${messageId}/delete-for-me`;
    const { data } = await axios.delete(endpoint, { data: { messageInfo, members: chatInfo.members, chatId : currentSelectedChatId }, withCredentials: true })
    data.success ? toast.success("message deleted successfully") : toast.error("error deleting message");
  }

  const [typingUsers, setTypingUsers] = useState(new Map());
  const { startTyping, stopTyping } = useTypingIndicator(chatInfo._id, chatInfo.members);


  useSocketEvents(socket, {
    [NEW_MESSAGE]: (data) => {
      if (data.chat === currentSelectedChatId) addMessageFromSocket(data);
    },

    [MESSAGE_DELETED]: (data) => {
      console.log("message deleted for everyone ::",data)
      updateMessageDeletionFromSocket(data[0]);
    },

    [UPDATE_LAST_MESSAGE]: (data) => updateContactsList(data),

    [START_TYPING]: ({ chatId: typingChatId, userId, username }) => {
      if (typingChatId === currentSelectedChatId && userId !== user._id) {
        setTypingUsers(prev => new Map(prev).set(userId, username));
      }
    },
    [STOP_TYPING]: ({ chatId: typingChatId, userId }) => {
      if (typingChatId === currentSelectedChatId) {
        setTypingUsers(prev => {
          const m = new Map(prev);
          m.delete(userId);
          return m;
        });
      }
    },
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMsg(value);
    value.length > 0 ? startTyping() : stopTyping();
  }

  const navigate = useNavigate();

  return (
    <div className="flex-1 min-w-0 h-full flex flex-col relative">
      {/* HEADER */}
      <div className='sticky bg-[#242424] top-0 z-10 flex justify-between items-center p-3 border-b border-gray-700'>
        <div className='flex items-center w-full '>
          <button onClick={() => navigate('/')} className="mr-2 text-white hover:bg-gray-700 rounded md:hidden">
            <ArrowLeft className="w-5 h-5" />
          </button>
          {chatInfo.groupChat ? (
            <div className="mr-2 flex-col p-2 w-8 h-8 gap-1 flex bg-zinc-500 rounded-full justify-center items-center">
              <div className="flex gap-1">
                <div className="h-[6px] w-[6px] bg-zinc-800 rounded-sm"></div>
                <div className="h-[6px] w-[6px] bg-zinc-800 rounded-sm"></div>
              </div>
              <div className="flex gap-1">
                <div className="h-[6px] w-[6px] bg-zinc-800 rounded-sm"></div>
                <div className="h-[6px] w-[6px] bg-zinc-800 rounded-sm"></div>
              </div>
            </div>
          ) : (
            <img src={avatar.url} className='h-10 w-10 rounded-full mr-2 border-2 border-zinc-600' />
          )}
          <div className='flex flex-col'>
            <span className='font-semibold'>{fullName}</span>
            {!chatInfo.groupChat && (
              <span className='text-xs font-medium text-[#248f60]'>
                {onlineUsers.includes(otherUserId) ? "Online" : "Offline"}
              </span>
            )}
          </div>
        </div>

        <div className='md:hidden'>
          <label htmlFor="my-drawer-4" className="drawer-button md:hidden">
            <Ellipsis />
          </label>
          <div className="drawer drawer-end flex justify-end w-6">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-side">
              <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu bg-[#313131] text-base-content h-full py-4 w-full">
                <label htmlFor="my-drawer-4" className="drawer-button self-end mt-6 mx-4">
                  <X strokeWidth={2} />
                </label>
                <Profile mobileStyle={'h-full w-full'} />
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGES SECTION */}
      <div ref={chatContainerRef} className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#444] px-6 py-4 flex flex-col'>
      
        {messagesRelatedToChat.length > 0 ? (
          <>
            <div className="flex flex-col gap-2">
              {messagesRelatedToChat.map((msg, index) => {
                const { _id, sender, attachments, text, textDeletedFor = [], textDeletedForEveryone = false, createdAt } = msg;

                if (textDeletedFor.includes(user._id) && attachments.every((el)=> el.deletedFor.includes(user._id))) return null;

                const msgDate = moment(createdAt).format('DD-MM-YYYY');
                const prevMsgDate = index > 0 ? moment(messagesRelatedToChat[index - 1].createdAt).format('DD-MM-YYYY') : null;
                const isDateTransition = msgDate !== prevMsgDate;

                return (
                  <div key={_id}>
                    {isDateTransition && (
                      <div className="text-center text-xs my-2 text-gray-500">
                        {moment(createdAt).calendar(null, {
                          sameDay: '[Today]',
                          lastDay: '[Yesterday]',
                          lastWeek: 'dddd, MMM D',
                          sameElse: 'MMMM D, YYYY'
                        })}
                      </div>
                    )}

                    <div className={`chat ${sender._id === user._id ? 'chat-end' : 'chat-start'}`}>
                      {sender._id !== user._id && (
                        <div className="chat-image avatar">
                          <div className="w-8 rounded-full">
                            <img src="/image.png" alt="User avatar" />
                          </div>
                        </div>
                      )}
                      <div className={`w-full rounded-t-lg flex gap-1 flex-col ${sender._id === user._id ? 'items-end' : 'items-start'}`}>

                        {attachments.length > 0 && (
                          <label htmlFor="attachment" className="p-1 flex justify-end w-[40%]">
                            <AttachmentGrid attachments={attachments} handleContextMenu={handleContextMenu} userId={user._id} _id={_id} />
                            <input type="text" id="attachment" className="hidden" />
                          </label>
                        )}
                        { (text.length > 0 || textDeletedForEveryone) && (
                          <div
                            
                          >
                            { textDeletedForEveryone ? (
                              <span className="text-xs italic text-gray-400 bg-[#2d2d2d] py-1 px-2 rounded">this message was deleted</span>
                            ) : (
                              <span className={`whitespace-pre-wrap break-words max-w-[70%] py-2 px-3 rounded-t-md ${sender._id === user._id
                              ? ' bg-[#353535] rounded-l-lg '
                              : 'bg-[#689969] rounded-r-lg'
                              }`}
                            onContextMenu={(e) => handleContextMenu(_id, { type: 'text', text }, e)} >{text}</span>
                            )}
                          </div>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {moment(createdAt).format('hh:mm a')}
                        </span>

                        {contextMenu.visible && contextMenu.messageId === _id && (
                          <div id="custom-context-menu" className="fixed z-50 bg-[#2a2a2a] text-white rounded-md shadow-lg"
                            style={{ top: contextMenu.y, left: contextMenu.x }}>
                            <div className="flex overflow-x-auto gap-1 p-2 border-b border-gray-700 max-w-[250px] scrollbar-thin scrollbar-thumb-[#444]">
                              {["👍", "❤️", "😂", "😮", "😢", "🔥", "👏", "🙏"].map(emoji => (
                                <span key={emoji} className="cursor-pointer text-xl hover:scale-110"
                                  onClick={() => {
                                    console.log("Reacted with", emoji);
                                    setContextMenu({ visible: false, messageId: null, x: 0, y: 0, data: null });
                                  }}>
                                  {emoji}
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-col text-sm">
                              <button className="px-4 py-2 hover:bg-[#689969] text-left"
                                onClick={() => {
                                  handleDeleteMessage(contextMenu.messageId, contextMenu.data, isDeleteForEveryone = false);
                                  setContextMenu({ visible: false, messageId: null, x: 0, y: 0, data: null });
                                }}>
                                Delete for me
                              </button>
                              {sender._id === user._id && (
                                <button className="px-4 py-2 hover:bg-[#689969] text-left"
                                  onClick={() => {
                                    handleDeleteMessage(contextMenu.messageId, contextMenu.data, isDeleteForEveryone = true);
                                    setContextMenu({ visible: false, messageId: null, x: 0, y: 0, data: null });
                                  }}>
                                  Delete for everyone
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-500">No messages yet</p>
          </div>
        )}

        {typingUsers.has(otherUserId) && (
          <div className="relative left-4 bottom-3 flex items-center w-full text-[#919191]">
            <span className='m-0 p-0'>Typing</span>
            <TypingIndicator />
          </div>
        )}
      </div>

      {/* INPUT SECTION */}
      <div className='sticky bottom-0 bg-[#242424] pt-2 pb-4 px-3 w-full border-t border-gray-700'>
        {isEmojiOpen && (
          <div ref={emojiRef} className="absolute bottom-full left-0 w-full z-20">
            <EmojiPicker onEmojiClick={onEmojiSelect} height={200} width='100%' theme='dark'
              previewConfig={{ showPreview: false }} searchDisabled={true} skinTonesDisabled={true} />
          </div>
        )}
        <form className='flex items-center relative'>
          <div className='p-2 rounded-full hover:bg-[#313131] cursor-pointer relative'>
            {isAttachmentOpen && (
              <div ref={attachmentRef} className="absolute flex flex-col items-start bottom-12 left-0 bg-[#272727] p-2 gap-1 rounded-lg shadow-lg z-10 w-max">
                <span onClick={() => handleFileSelect('image/*')}
                  className='justify-start px-3 py-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-2 items-center w-full rounded cursor-pointer'>
                  <Image size={14} />Images
                </span>
                <span onClick={() => handleFileSelect('video/*')}
                  className='justify-start px-3 py-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-2 items-center w-full rounded cursor-pointer'>
                  <FilePlay size={14} />Videos
                </span>
                <span onClick={() => handleFileSelect('audio/*')}
                  className='justify-start px-3 py-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-2 items-center w-full rounded cursor-pointer'>
                  <FileAudio2 size={14} />Audio
                </span>
                <span onClick={() => handleFileSelect('*/*')}
                  className='justify-start px-3 py-2 flex text-sm bg-[#414141] hover:bg-[#353535] gap-2 items-center w-full rounded cursor-pointer'>
                  <FileText size={14} />Documents
                </span>
              </div>
            )}
            <Paperclip onClick={() => setIsAttachmentOpen(prev => !prev)} size={18} />
          </div>
          <span onClick={() => setIsEmojiOpen(prev => !prev)} className='p-2 rounded-full hover:bg-[#313131] mr-2 cursor-pointer'>
            <SmilePlus size={18} />
          </span>
          <div className='flex items-center flex-1 flex-col'>
            {selectedFiles.length > 0 && (
              <div className='w-full mb-2 p-2 bg-[#343434] rounded-lg'>
                <div className='flex items-center justify-between mb-2'>
                  {selectedFiles.length < 6 && (
                    <div><span className='text-sm text-gray-200'>You can add {6 - selectedFiles.length} more</span></div>
                  )}
                  <button type="button" onClick={clearAllFiles}
                    className='text-xs text-red-400 hover:text-red-300 px-1 py-[2px] rounded hover:bg-[#505050]'>
                    Clear all
                  </button>
                </div>
                <div className='flex flex-col gap-1 max-h-32 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#444]'>
                  {selectedFiles.map((file, index) => (
                    <div key={`${file.name}-${index}`} className='flex items-center justify-between bg-[#484848] px-2 py-1 rounded'>
                      <div className='flex items-center flex-1 min-w-0'>
                        <span className='mr-2'>
                          {file.type.startsWith('image/') ? <Image /> :
                            file.type.startsWith('video/') ? <Clapperboard /> :
                              file.type.startsWith('audio/') ? <FileAudio /> : <FileText />}
                        </span>
                        <div className='flex flex-col flex-1 min-w-0'>
                          <span className='text-xs text-white truncate'>{file.name}</span>
                          <span className='text-[10px] text-gray-400'>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeSelectedFile(index)}
                        className='ml-2 p-1 hover:bg-[#606060] rounded-full text-red-400'>
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className='flex items-center w-full'>
              <textarea onInput={autoResize} value={msg} onChange={handleInputChange}
                className="w-full resize-none rounded-3xl px-4 outline-none min-h-[35px] max-h-[112px] py-2 overflow-y-auto bg-[#353535] text-white"
                placeholder={selectedFiles.length > 0 ? `Send ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} with message...` : "Type a message..."} rows={1} />
              <button type="button" onClick={handleSendMsg}
                className='p-2 rounded-full hover:bg-[#313131] ml-1 cursor-pointer'
                disabled={!msg.trim() && selectedFiles.length === 0}>
                {sending ?
                  <span className="loading loading-spinner text-[#909090]"></span> :
                  <Send size={20} color={(!msg.trim() && selectedFiles.length === 0) ? '#666' : '#248f60'} />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chats