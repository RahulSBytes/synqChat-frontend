import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

const server = import.meta.env.VITE_SERVER || "http://localhost:8080";

const SocketContext = createContext();

//it has the currently loggedin user's soket detail
const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(server, { withCredentials: true }), []);
  // socket contains the currently loggedin usser's socket's details
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, getSocket };
