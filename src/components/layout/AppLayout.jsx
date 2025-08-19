import { Bell, Group, LogOut, Users } from "lucide-react";
import UsersList from "../UsersList";

export default function AppLayout(WrappedComponent) {
  return function WithLayout(props) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex h-64 flex-1">
          <nav className="flex flex-col items-center justify-center gap-10 bg-[#3B3B3B] w-16">
            <Users size={18} />
            <LogOut size={18} />
            <div className="indicator">
              <Bell />
              <span className="badge badge-xs badge-primary bg-[#248F60] indicator-item">10</span>
            </div>
          </nav>
          <UsersList />

          <div className=" bg-[#212121] flex-1">
            <WrappedComponent {...props} />
          </div>

          <div className=" hidden lg:block w-80 bg-[#242424]"></div>
        </div>
      </div>

    );
  };
}

