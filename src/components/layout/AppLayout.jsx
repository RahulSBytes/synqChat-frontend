import UsersList from "../UsersList";
import Footer from "./Footer";
import Header from "./Header";

export default function AppLayout(WrappedComponent) {
  return function WithLayout(props) {
    return (
      <div className="h-screen flex flex-col ">
        <Header />
        <div className="flex h-64 flex-1">

          <UsersList/>

          <div className=" bg-[#1B1B1B] flex-1 overflow-y-scroll scrollbar-thin">
            <WrappedComponent {...props} />
          </div>

          <div className=" hidden lg:block w-80 bg-[#242424]">media menu</div>
        </div>
      </div>

    );
  };
}

