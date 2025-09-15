import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Home from "./components/Home";
import ProtectRoute from "./components/auth/protectRoute.jsx";
import Chats from "./components/Chats";
import { server } from './constants/config.js'
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "./store/authStore.js";
import AppLayout from "./components/layout/AppLayout.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";

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



// Helper component to wrap lazy components with Suspense
const LazyWrapper = ({ children }) => (
  <Suspense fallback={<div>Loading component...</div>}>
    {children}
  </Suspense>
);



function App() {

  const { user, loader, userNotExists, userExists } = useAuthStore()

  useEffect(() => {
    axios
      .get(`${server}/api/v1/users/getmyprofile`, {
        withCredentials: true
      })
      .then(({ data }) => {
        userExists(data.data)
      }).catch((err) => userNotExists())
  }, [])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route element={<ProtectRoute><AppLayout /></ProtectRoute>}>
          <Route index element={<Home />} />
          <Route path="chats/:id" element={<Chats />} />
        </Route>
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route path="/settings" element={<ProtectRoute><Settings /></ProtectRoute>} />
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



  return loader ?
    <p>loading......</p> :
    <><RouterProvider router={router} />
      <Toaster position="bottom-center" />
    </>;
}

export default App;