// profile.js
import { ArrowUpRight, Clapperboard, Dot, FileAudio, FileMinus, Image } from 'lucide-react'
import { useAuthStore } from '../../store/authStore.js';
import { useChatStore } from '../../store/chatStore.js';
import moment from "moment";
import { useNavigate } from 'react-router-dom';

function Details() {
    const navigate = useNavigate()
    // Fix: Access user directly without creating new object
    const user = useAuthStore((state) => state.user);
    const contacts = useChatStore((state) => state.contacts)
    // Fix: Use the correct field name
    const currentSelectedChatId = useChatStore((state) => state.currentSelectedChatId)

    // console.log("currentSelectedChatId ::", currentSelectedChatId)

    // Add null checks to prevent runtime errors
    if (!contacts || !currentSelectedChatId) {
        return <p>No chat selected or contacts not loaded</p>
    }

    const chatInfo = contacts.find((el) => el._id === currentSelectedChatId)
    const info = chatInfo.members.find((el) => el._id != user._id)

    // console.log('chatInfo :: ', chatInfo);
    // Add additional safety check
    if (!chatInfo) {
        return <p>Chat information not found</p>
    }

    if (!user) return <p>loading.......!</p>

    return (
        <aside className="hidden lg:flex bg-[#242424] flex-col px-6 py-8 min-h-0 overflow-hidden">
            <div className="flex flex-col min-h-0 flex-1">
                {chatInfo.groupChat ? (
                    <div className='flex gap-4 flex-col min-h-0 flex-1'>
                        {/* Profile Section - Fixed height */}
                        <div className='w-full flex flex-col items-center flex-shrink-0'>
                            <div className="flex-col p-6 w-14 h-14 gap-1 flex bg-zinc-500 rounded-full justify-center items-center">
                                <div className="flex gap-1">
                                    <div className="h-[12px] w-[12px] bg-zinc-800 rounded-sm"></div>
                                    <div className="h-[12px] w-[12px] bg-zinc-800 rounded-sm"></div>
                                </div>
                                <div className="flex gap-1">
                                    <div className="h-[12px] w-[12px] bg-zinc-800 rounded-sm"></div>
                                    <div className="h-[12px] w-[12px] bg-zinc-800 rounded-sm"></div>
                                </div>
                            </div>
                            <h4 className='font-semibold text-lg mt-2'>{chatInfo.name}</h4>
                            <p className='text-center text-sm'>{moment(chatInfo.createdAt).fromNow()}</p>
                            <p className='text-center text-sm'>{chatInfo.creator.fullName}</p>
                        </div>

                        {/* Members Section - Scrollable */}
                        <div className='flex-1 min-h-0 flex flex-col overflow-hidden'>
                            <h4 className='py-2 flex-shrink-0'>Members [{chatInfo.members?.length || 0}]</h4>
                            <div className='flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444] pr-2'>
                                {chatInfo.members?.map((el) => (
                                    <div key={el._id} className="flex py-2 hover:bg-[#292929] flex-shrink-0">
                                        <div className='relative'>
                                            <img
                                                src={el.avatar?.url || el.avatar}
                                                className="h-7 w-7 rounded-full mx-2 object-cover"
                                                alt={`${el.fullName} avatar`}
                                            />
                                            <Dot className='absolute right-5 bottom-3' size={30} strokeWidth={3} color='#5dbb63' />
                                        </div>
                                        <div className="flex">
                                            <span className='flex items-center text-sm font-semibold'>{el.fullName}</span>
                                        </div>
                                    </div>
                                )) || <p>No members found</p>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='w-full flex flex-col items-center gap-1 flex-shrink-0'>
                        <img src={info.avatar.url} className='h-14 w-14 rounded-full object-cover' />
                        <h4 className='font-semibold text-lg'>{info.fullName}</h4>
                        <p className='text-center text-sm'>@{info.username}</p>
                        <p className='text-center text-sm'>{info.email}</p>
                        <p className='text-center text-zinc-300 text-xs'>{info.bio}</p>
                    </div>
                )}

                {/* Files Section*/}
                <div className="flex flex-col mt-4 gap-6 flex-shrink-0">
                    <div>
                        <h4 className='pb-1'>Files</h4>
                        <div className='flex flex-col gap-1'>
                            <span className='flex justify-between hover:bg-[#313131] cursor-pointer items-center p-1 py-2 pr-3'>
                                <span className='flex gap-1 text-sm'><FileMinus /> Document</span>
                                <ArrowUpRight size={16} color='#5dbb63' />
                            </span>
                            <span className='flex justify-between cursor-pointer hover:bg-[#313131] items-center p-1 py-2 pr-3'>
                                <span className='flex gap-1 text-sm'><Image /> Images</span>
                                <ArrowUpRight size={16} color='#5dbb63' />
                            </span>
                            <span className='flex justify-between cursor-pointer hover:bg-[#313131] items-center p-1 py-2 pr-3'>
                                <span className='flex gap-1 text-sm'><Clapperboard /> Videos</span>
                                <ArrowUpRight size={16} color='#5dbb63' />
                            </span>
                            <span className='flex justify-between cursor-pointer hover:bg-[#313131] items-center p-1 py-2 pr-3'>
                                <span className='flex gap-1 text-sm'><FileAudio /> Audios</span>
                                <ArrowUpRight size={16} color='#5dbb63' />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Details