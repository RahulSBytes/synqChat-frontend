import { Dot } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from "../../store/authStore.js";
import moment from "moment";
import { useChatStore } from "../../store/chatStore.js";
import axios from "axios";
import { server } from "../../constants/config.js";

function Groupprof({ data }) {

    const {user} = useAuthStore((state) => state.user);
    const noOfUnseenMsg = 9;
    const navigate = useNavigate();

    // Fix: Use setCurrentSelectedChatId instead of setMessages for chat selection
    const setCurrentSelectedChatId = useChatStore(state => state.setCurrentSelectedChatId)
    const contacts = useChatStore((state) => state.contacts)

    function contactClickHandler(chatId) {
        // Fix: Set the selected chat ID, not messages
        setCurrentSelectedChatId(chatId);
        navigate(`/chats/${chatId}`)
    }

    const otherUser = data?.members?.find((el) => el._id !== user?._id)

    if (!data) {
        return <div>Loading chat...</div>
    }

    return (
        <div onClick={() => contactClickHandler(data._id)} className="flex gap-2 items-center p-2 pl-2 justify-between hover:bg-[#323232] cursor-pointer">
            <div className="flex gap-2 flex-1 items-center ">

                {!data.groupChat ?
                    <div className='relative'>
                        {/* Fix: Use actual otherUser data instead of string literal */}
                        <img src={otherUser?.avatar?.url || '/image.png'}
                            className="h-8 w-8 rounded-full object-cover"
                            alt={`${otherUser?.fullName || 'User'} avatar`} />
                        <Dot className='absolute right-4 bottom-3' size={30} strokeWidth={3} color='#5dbb63' />
                    </div>
                    :
                    <div className="flex-col p-2 w-8 h-8 gap-1 flex bg-zinc-500 rounded-full justify-center items-center">
                        <div className="flex gap-1">
                            <div className="h-[6px] w-[6px] bg-zinc-800 rounded-sm"></div>
                            <div className="h-[6px] w-[6px] bg-zinc-800 rounded-sm"></div>
                        </div>
                        <div className="flex gap-1">
                            <div className="h-[6px] w-[6px] bg-zinc-800 rounded-sm"></div>
                            <div className="h-[6px] w-[6px] bg-zinc-800 rounded-sm"></div>
                        </div>
                    </div>
                }

                <div className="flex-1 items-center">
                    {/* Fix: Use actual dynamic values instead of string literals */}
                    <span className="line-clamp-1">
                        {data.groupChat ? data.name : (otherUser?.fullName || 'Unknown User')}
                    </span>
                    <span className="text-xs text-zinc-300 line-clamp-1">
                        {data.lastMessage?.text || 'No messages yet'}
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-end gap-2 mr-3 py-1 h-full">
                <span className="text-xs text-zinc-300">
                    {data.lastMessage?.timestamp ? moment(data.lastMessage.timestamp).fromNow() : ''}
                </span>

                {noOfUnseenMsg > 0 && (
                    <span className="w-4 h-4 text-xs flex justify-center items-center bg-[#248f60] rounded-full font-medium">
                        {noOfUnseenMsg <= 20 ? noOfUnseenMsg : '20+'}
                    </span>
                )}
            </div>
        </div>
    )
}

export default Groupprof