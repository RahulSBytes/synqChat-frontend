// profile.js
import { ArrowUpRight, Clapperboard, FileAudio, FileMinus, Image, PencilLine } from 'lucide-react'
import { useAuthStore } from '../../store/authStore.js';
import { useChatStore } from '../../store/chatStore.js';
import { useMemo, useState } from 'react'
import ShowProfileAttachmentList from '../minicomponents/ShowProfileAttachmentList.jsx';
import { useApiStore } from '../../store/apiStore.js';
import ViewMembers from '../ViewMembers.jsx';
import { getSocket } from '../../context/SocketContext.jsx';
import useSocketEvents from '../../hooks/useSocketEvents.js';
import { CHAT_CLEARED, GROUP_MEMBER_UPDATED } from '../../constants/events.js';
import { server } from '../../constants/config.js';
import axios from 'axios';
import toast from 'react-hot-toast';

function Details({ mobileStyle }) {

    const user = useAuthStore((state) => state.user);
    const currentSelectedChatId = useChatStore((state) => state.currentSelectedChatId)
    const contacts = useApiStore((state) => state.contacts)
    const messagesRelatedToChat = useApiStore((state) => state.messagesRelatedToChat)



    const categorized = useMemo(() => {
        const allAttachments = messagesRelatedToChat
            .map((message) => message.attachments)
            .flat()
            .filter(Boolean); // Filter out null/undefined attachments


        const groups = {
            raw: [],
            audio: [],
            video: [],
            image: [],
        };

        for (const att of allAttachments) {
            if (groups[att.fileType]) {
                groups[att.fileType].push(att);
            }
        }

        return groups;
    }, [messagesRelatedToChat]);

    const [isViewMembersClicked, setIsViewMembersClicked] = useState(false)

    // Use an object to track which file types are expanded
    const [expandedFileTypes, setExpandedFileTypes] = useState({});


    // console.log("selectedChatInfo :::", selectedChatInfo)



    const filesObject = [
        {
            label: "Documents",
            count: categorized.raw.length,
            icon: FileMinus,
            files: categorized.raw,
            key: 'documents'
        },
        {
            label: "Videos",
            count: categorized.video.length,
            icon: Clapperboard,
            files: categorized.video,
            key: 'videos'
        },
        {
            label: "Audios",
            count: categorized.audio.length,
            icon: FileAudio,
            files: categorized.audio,
            key: 'audios'
        },
        {
            label: "Images",
            count: categorized.image.length,
            icon: Image,
            files: categorized.image,
            key: 'images'
        },
    ]



    const socket = getSocket()
    const updateChat = useApiStore(state => state.updateChat)
    const fetchMessages = useApiStore(state => state.fetchMessages)


    useSocketEvents(socket, {
        [GROUP_MEMBER_UPDATED]: (data) => {
            updateChat(data)
        },
        [CHAT_CLEARED]: async ({ chatId }) => {
            if (chatId == currentSelectedChatId) {
                await fetchMessages(chatId); // learnnnnnnnnning *_*
            }
        }
    })

    if (!contacts || !currentSelectedChatId) {
        return null
    }

    const selectedChatInfo = contacts.find((el) => el._id === currentSelectedChatId)
    const info = selectedChatInfo?.members?.find((el) => el._id != user._id)


    if (!user) return <p>loading.......!</p>

    if (!selectedChatInfo) {
        return <p>Chat information not found</p>
    }

    async function handleClearMessages(chatId) {
        try {
            const res = confirm("Do you really wanna clear this that?")
            if (res) {
                const { data } = await axios.delete(`${server}/api/v1/chats/${chatId}/clear-chat`, { withCredentials: true })
                data.success ? toast.success("chat cleared successfully") : toast.error("failed clearing chat")
            }
        } catch (error) {
            console.log("erooorr::", error)
        }

    }


    const toggleFileType = (fileKey) => {
        setExpandedFileTypes(prev => ({
            ...prev,
            [fileKey]: !prev[fileKey]
        }));
    };

    const closeAttachmentList = (fileKey) => {
        setExpandedFileTypes(prev => ({
            ...prev,
            [fileKey]: false
        }));
    };


    return (
        <aside className={`lg:flex bg-[#242424] flex-col px-6 py-8 min-h-0 overflow-hidden ${mobileStyle} flex-1 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]`}>
            {isViewMembersClicked && <ViewMembers selectedChatInfo={selectedChatInfo} setIsViewMembersClicked={setIsViewMembersClicked} />}
            <div className="flex flex-col min-h-0 flex-1">

                {/* ---------for group chat------------ */}
                {selectedChatInfo.groupChat ? (
                    <div className=' flex gap-4 flex-col py-4'>
                        {/* Profile Section - Fixed height */}
                        <div className='w-full flex flex-col items-center flex-shrink-0'>
                            <img
                                className="h-16 w-16 rounded-full object-cover border border-[#323232]"
                                src={selectedChatInfo.avatar?.url || '../../../public/image.png'}
                                alt="Group avatar"
                            />
                            <h4 className='font-semibold text-lg mt-2'>{selectedChatInfo.name}</h4>
                            <p className='cursor-pointer text-center text-zinc-400 text-sm font-handwriting flex gap-1 items-center' onClick={() => setIsViewMembersClicked(prev => !prev)}>{selectedChatInfo.members.length} members <PencilLine size={14} /></p>
                            <p className='text-center text-xs text-zinc-300 font-handwriting'>{selectedChatInfo.bio || selectedChatInfo.description}</p>
                        </div>
                    </div>
                ) : (
                    // -------------------- direct conversation ----------------------------
                    info && (
                        <div className=' w-full flex flex-col items-center py-4 gap-1 flex-shrink-0'>
                            <img
                                src={info.avatar?.url || '../../../public/image.png'}
                                className='h-14 w-14 rounded-full object-cover border border-[#323232]'
                                alt={`${info.fullName} avatar`}
                            />
                            <h4 className='font-semibold text-lg'>{info.fullName}</h4>
                            <p className='text-center text-sm font-handwriting text-zinc-400 '>@{info.username}</p>
                            <p className='text-center font-handwriting text-xs text-zinc-300'>{info.bio}</p>
                        </div>
                    )
                )}

                <hr />
                <div className="flex flex-col mt-4 gap-6 flex-shrink-0">
                    <div>
                        <h4 className='pb-2'>Shared files</h4>
                        <div className='flex flex-col gap-1'>
                            {filesObject.map((el) => (
                                <div key={el.key}>
                                    <div
                                        onClick={() => toggleFileType(el.key)}
                                        className='flex justify-between hover:bg-[#313131] cursor-pointer items-center p-1 py-2 pr-3'
                                    >
                                        <div className='flex gap-1 items-center text-sm'>
                                            <el.icon />
                                            <div className='flex flex-col'>
                                                <span className='text-sm text-zinc-100'>{el.label}</span>
                                                <span className='text-[10px] font-handwriting text-zinc-400'>{el.count} files</span>
                                            </div>
                                        </div>
                                        <ArrowUpRight size={16} color='#5dbb63' />
                                    </div>

                                    {expandedFileTypes[el.key] && (
                                        <ShowProfileAttachmentList
                                            files={el.files}
                                            onClose={() => closeAttachmentList(el.key)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className='flex flex-col items-start mt-2'>
                            <button className='text-sm mb-1' onClick={() => handleClearMessages(selectedChatInfo._id)}> clear all messages </button>
                           { 
                          selectedChatInfo.groupChat?  <button className='text-sm text-red-400 hover:text-red-300'> leave this group </button>
                          :  <button className='text-sm text-red-400 hover:text-red-300'>Block this contact </button>
                           }
                        </div>
                    </div>
                </div>
            </div>
            {/* <hr /> */}

        </aside>
    )
}

export default Details