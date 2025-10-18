// // components/GlobalSocketHandler.jsx

// import { useEffect } from "react";
// import { getSocket } from "../../context/SocketContext";
// import { useSocketEvents } from "../../hooks/useSocketEvents";
// import { useChatStore } from "../../store/chatStore";
// import { useMessageStore } from "../../store/apiStore";
// import { useAuthStore } from "../../store/authStore";  // ✅ Zustand
// import axios from "axios";
// import { server } from "../../constants/config";
// import {
//     NEW_MESSAGE,
//     MESSAGE_DELIVERED,
//     MESSAGE_READ,
//     UNREAD_COUNT_UPDATED,
//     REFETCH_CHATS,
//     MESSAGE_DELETED,
//     UPDATE_LAST_MESSAGE,
//     UPDATE_CHAT,
// } from "../../constants/events";







// components/GlobalSocketHandler.jsx

import { getSocket } from "../../context/SocketContext";
import  useSocketEvents  from "../../hooks/useSocketEvents";
import { useChatStore } from "../../store/chatStore";
import { useApiStore } from "../../store/apiStore";
import { useAuthStore } from "../../store/authStore";
import axios from "axios";
import { server } from "../../constants/config";
import {
  NEW_MESSAGE,
  MESSAGE_DELIVERED,
  MESSAGE_READ,
  UNREAD_COUNT_UPDATED,
  REFETCH_CHATS,
  MESSAGE_DELETED,
  UPDATE_LAST_MESSAGE,
  UPDATE_CHAT,
} from "../../constants/events";

function GlobalSocketHandler() {
  const socket = getSocket();
  const user = useAuthStore((state) => state.user);
  const currentSelectedChatId = useChatStore((state) => state.currentSelectedChatId);
  
  // ✅ Get methods from your API store
  const { 
    addMessageFromSocket, 
    updateMessageStatuses, 
    updateContactUnreadCount,
    updateMessageDeletionFromSocket,
    updateContactsList,
    fetchContact,
    updateChat,
  } = useApiStore();

  useSocketEvents(socket, {
    [NEW_MESSAGE]: async (data) => {
      
      const isMyMessage = data.sender._id === user?._id;
      const isCurrentChat = data.chat === currentSelectedChatId;
      
      // ✅ ALWAYS mark as delivered (even if chat not open)
      if (!isMyMessage) {
        try {
          const res = await axios.put(
            `${server}/api/v1/chats/delivered/${data.chat}`,
            {},
            { withCredentials: true }
          );
        } catch (err) {
          console.error("❌ Mark delivered error:", err);
        }
      }
      
      // ✅ Handle UI updates
      if (isCurrentChat) {
        addMessageFromSocket(data);
        
        if (!isMyMessage) {
          setTimeout(() => {
            axios.put(
              `${server}/api/v1/chats/read/${data.chat}`,
              {},
              { withCredentials: true }
            ).catch(err => console.error("Mark read error:", err));
          }, 1000);
        }
      } else {
        // Message for different chat
        // You can add incrementUnreadCount here if you have it in your store
      }
    },

    [MESSAGE_DELIVERED]: ({ chatId, messageIds, deliveredBy }) => {
      updateMessageStatuses(messageIds, "delivered");
    },

    [MESSAGE_READ]: ({ chatId, messageIds, readBy }) => {
      updateMessageStatuses(messageIds, "read");
    },

    [UNREAD_COUNT_UPDATED]: ({ chatId, unreadCount }) => {
      updateContactUnreadCount(chatId, unreadCount);
    },

    [REFETCH_CHATS]: () => {
      fetchContact();
    },

    [MESSAGE_DELETED]: (data) => {
      updateMessageDeletionFromSocket(data[0]);
    },

    [UPDATE_LAST_MESSAGE]: (data) => {
      updateContactsList(data);
    },

    [UPDATE_CHAT]: (data) => {
      updateChat(data);
    },
  });

  return null;
}

export default GlobalSocketHandler;