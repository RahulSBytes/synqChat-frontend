import UsersList from "../UsersList";
import Profile from './Profile'
import Navbar from "./Navbar";
import { useUIStore } from "../../store/store.js";
import CreateGroupForm from "../CreateGroupForm.jsx";
import FindDialog from "../FindDialog.jsx";

export default function AppLayout(WrappedComponent) {

  return function WithLayout(props) {
    const isNewGroupClicked = useUIStore((state) => state.isNewGroupClicked)
    const isSearchPeopleClicked = useUIStore((state) => state.isSearchPeopleClicked)
    return (

      <div className="h-screen flex">
        {
          isNewGroupClicked && <CreateGroupForm />
        }
        {
          isSearchPeopleClicked && <FindDialog />
        }
        <Navbar />

        {/* User List */}
        <div className="hidden md:flex w-[250px] bg-[#353535]">
          <UsersList />
        </div>

        {/* Chat Section */}
        <div className="flex-1 min-w-0 bg-[#212121]">
          <WrappedComponent {...props} />
        </div>

        {/* Profile Details */}
        <div className="hidden lg:flex flex-[0_0_250px] max-w-[300px]">
          <Profile />
        </div>
      </div>




    );
  };
}

