import { Dot } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from "../../store/authStore.js";
import moment from "moment";
import { useChatStore } from "../../store/chatStore.js";

function Groupprof({ data, onlineUsers = [] }) {

    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    const setCurrentSelectedChatId = useChatStore(state => state.setCurrentSelectedChatId)
    const currentSelectedChatId = useChatStore(state => state.currentSelectedChatId)

    if (!data) {
        return <div>Loading chat...</div>
    }

    const { groupChat, _id, avatar, name, lastMessage, unreadCount, members } = data;

    let otherUser;
    if (!groupChat) otherUser = members.find((el) => el._id != user._id);

    function contactClickHandler(chatId) {
        setCurrentSelectedChatId(chatId);
        navigate(`/chats/${chatId}`)
    }


    return (
        <div onClick={() => contactClickHandler(_id)} className={`flex gap-2 items-center p-2 pl-2 justify-between hover:bg-[#323232] cursor-pointer ${currentSelectedChatId === _id ? 'bg-[#323232]' : ''}`}>
            <div className="flex gap-2 flex-1 items-center ">
                <div className='relative'>
                    <img src={groupChat ? avatar?.url || '../../../image.png' : otherUser?.avatar?.url}
                        className="border border-[#414141] w-8 h-8  rounded-full object-cover" />
                    {!groupChat && onlineUsers.includes(otherUser._id) && <Dot className='absolute right-4 bottom-3' size={30} strokeWidth={3} color='#5dbb63' />}
                </div>

                <div className="flex-1 items-center">
                    <span className="line-clamp-1">
                        {groupChat ? name : (otherUser?.fullName || 'Unknown User')}
                    </span>
                    <span className="text-xs text-zinc-300 line-clamp-1">
                        {lastMessage?.message || 'errorr'}
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-end gap-2 mr-3 py-1 h-full">
                <span className="text-xs text-zinc-300">
                    {lastMessage?.timestamp ? moment(lastMessage?.timestamp).fromNow() : ''}
                </span>

                {unreadCount >= 0 && (
                    <span className="w-4 h-4 text-xs flex justify-center items-center bg-[#248f60] rounded-full font-medium">
                        {unreadCount <= 20 ? unreadCount : '20+'}
                    </span>
                )}
            </div>
        </div>
    )
}

export default Groupprof