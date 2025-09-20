// profile.js
import { ArrowUpRight, Clapperboard, Dot, FileAudio, FileMinus, Image } from 'lucide-react'
import { useAuthStore } from '../../store/authStore.js';
import { useChatStore } from '../../store/chatStore.js';
import { useMemo, useState } from 'react'
import ShowProfileAttachmentList from '../minicomponents/ShowProfileAttachmentList.jsx';
import { useApiStore } from '../../store/apiStore.js';

function Details() {

    const user = useAuthStore((state) => state.user);
    const currentSelectedChatId = useChatStore((state) => state.currentSelectedChatId)
    const contacts = useApiStore((state) => state.contacts)
    const messagesRelatedToChat = useApiStore((state) => state.messagesRelatedToChat)

    if (!user) return <p>loading.......!</p>

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

    // Use an object to track which file types are expanded
    const [expandedFileTypes, setExpandedFileTypes] = useState({});

    if (!contacts || !currentSelectedChatId) {
        return null
    }

    const selectedChatInfo = contacts.find((el) => el._id === currentSelectedChatId)
    const info = selectedChatInfo?.members?.find((el) => el._id != user._id)

    if (!selectedChatInfo) {
        return <p>Chat information not found</p>
    }

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
        <aside className="hidden lg:flex bg-[#242424] flex-col px-6 py-8 min-h-0 overflow-hidden">
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
                            <p className='text-center text-zinc-400 text-sm font-handwriting'>{selectedChatInfo.members.length} members</p>
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

                                    {expandedFileTypes[el.key] && el.files.length > 0 && (
                                        <ShowProfileAttachmentList
                                            files={el.files}
                                            onClose={() => closeAttachmentList(el.key)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* <hr /> */}
            <div className=''>
                <button className='text-sm mb-1'> Delete all messages </button>
                <button className='text-sm text-red-400 hover:text-red-300'>Block this contact <input type="checkbox" defaultChecked className="checkbox checkbox-accent checkbox-xs ml-1" /></button>
            </div>
        </aside>
    )
}

export default Details