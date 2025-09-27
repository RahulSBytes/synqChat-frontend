import UsersList from "../UsersList";
import Profile from './Profile'
import Navbar from "./Navbar";
import { useUIStore } from "../../store/store.js";
import CreateGroupForm from "../CreateGroupForm.jsx";
import FindDialog from "../FindDialog.jsx";
import Notification from "../Notification.jsx";
import { Outlet } from "react-router-dom";
import { useChatStore } from "../../store/chatStore.js";
import { useState } from "react";
import useSocketEvents from "../../hooks/useSocketEvents.js";
import { getSocket } from "../../context/SocketContext.jsx";
import { ONLINE_USERS } from "../../constants/events.js";
import { useAuthStore } from "../../store/authStore.js";
import MobileNavbar from "./MobileNavbar.jsx";
// import { set } from "mongoose";

export default function MobileAppLayout() {

  const user = useAuthStore((state) => state.user)
  const { isNewGroupClicked, isSearchPeopleClicked, isNotificationClicked } = useUIStore();
  const currentSelectedChatId = useChatStore((state) => state.currentSelectedChatId)
  const socket = getSocket()

  console.log("currently loggedin user ::", user.username, user._id)


  const [onlineUsers, setOnlineUsers] = useState([]);

  useSocketEvents(socket, {
    [ONLINE_USERS]: (userIds) => {
      setOnlineUsers(userIds)
    }
  })


  return (<div>
    <div className="h-screen flex overflow-hidden border border-violet-600">
      {
        isNewGroupClicked && <CreateGroupForm />
      }
      {
        isSearchPeopleClicked && <FindDialog />
      }
      {
        isNotificationClicked && <Notification />
      }

      <MobileNavbar />
      <div className="flex-1 min-w-0 bg-[#212121] h-full">
        <Outlet context={{ onlineUsers }} />
      </div>
    </div>
  </div>
  );
};