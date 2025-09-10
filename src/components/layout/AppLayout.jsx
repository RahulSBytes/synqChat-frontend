import UsersList from "../UsersList";
import Profile from './Profile'
import Navbar from "./Navbar";
import { useUIStore } from "../../store/store.js";
import CreateGroupForm from "../CreateGroupForm.jsx";
import FindDialog from "../FindDialog.jsx";
import Notification from "../Notification.jsx";
import { Outlet } from "react-router-dom";

export default function AppLayout() {

    const { isNewGroupClicked, isSearchPeopleClicked, isNotificationClicked } = useUIStore();

    return (
      <div className="h-screen flex overflow-hidden">
        {
          isNewGroupClicked && <CreateGroupForm />
        }
        {
          isSearchPeopleClicked && <FindDialog />
        }
        {
          isNotificationClicked && <Notification />
        }
        <Navbar />
        {/* User List */}
        <div className="hidden md:flex w-[250px] bg-[#353535] h-full">
          <UsersList />
        </div>

        {/* Chat Section */}
        <div className="flex-1 min-w-0 bg-[#212121] h-full">
          <Outlet/>
        </div>

        {/* Profile Details */}
        <div className="hidden lg:flex flex-[0_0_250px] max-w-[300px] h-full">
          <Profile />
        </div>
      </div>
    );
  };