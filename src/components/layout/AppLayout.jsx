import UsersList from "../UsersList";
import Profile from './Profile'
import Navbar from "./Navbar";

export default function AppLayout(WrappedComponent) {
  return function WithLayout(props) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex h-64 flex-1">
         <Navbar/>
          <UsersList />

          <div className=" bg-[#212121] flex-1">
            <WrappedComponent {...props} />
          </div>

          <Profile/>
        </div>
      </div>

    );
  };
}

