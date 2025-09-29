import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import Home from "./components/Home";
import ProtectRoute from "./components/auth/protectRoute.jsx";
import Chats from "./components/Chats";
import { server } from './constants/config.js'
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "./store/authStore.js";
import AppLayout from "./components/layout/AppLayout.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import UsersList from "./components/UsersList.jsx";
import MobileAppLayout from "./components/layout/MobileAppLayout.jsx";
import ResponsiveLayout from "./components/layout/ResponsiveLayout.jsx";

// Lazy-loaded pages
// const Group = lazy(() => import("./components/Group"));
const Signup = lazy(() => import("./components/Signup.jsx"));
const Login = lazy(() => import("./components/layout/Login.jsx"));
const NotFound = lazy(() => import("./components/NotFound"));
const AdminLogin = lazy(() => import("./components/AdminLogin"));
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const UserManagement = lazy(() => import("./components/admin/UserManagement"));
const ChatManagement = lazy(() => import("./components/admin/ChatManagement"));
const MessagesManagement = lazy(() => import("./components/admin/MessagesManagement"));
const Settings = lazy(() => import("./components/layout/Settings.jsx"));
const Profile = lazy(() => import("./components/layout/Profile.jsx"));




// Helper component to wrap lazy components with Suspense
const LazyWrapper = ({ children }) => (
  <Suspense fallback={<div>Loading component...</div>}>
    {children}
  </Suspense>
);


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* Main app routes with responsive layout */}
      <Route element={<ProtectRoute><ResponsiveLayout /></ProtectRoute>}>
        <Route index element={<Home />} />
        <Route path="chats/:id" element={<Chats />} />
      </Route>
      
      {/* Auth routes */}
      <Route path="/auth">
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
      
      {/* Settings route */}
      <Route path="/settings" element={<ProtectRoute><Settings /></ProtectRoute>} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="chats" element={<ChatManagement />} />
        <Route path="messages" element={<MessagesManagement />} />
        <Route path="users" element={<UserManagement />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);



function App() {
  const { userNotExists, userExists } = useAuthStore();
// const {isMobile} = useResponsive();
// console.log("screen width ::",isMobile);


  useEffect(() => {
    axios.get(`${server}/api/v1/users/getmyprofile`, { withCredentials: true })
      .then(({ data }) => userExists(data.data))
      .catch(() => userNotExists());
  }, [userExists, userNotExists]);



  return (
    <SocketProvider>
      <RouterProvider router={router} />
      <Toaster position="bottom-center" />
    </SocketProvider>
  );
}

export default App;