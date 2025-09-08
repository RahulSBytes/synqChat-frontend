import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Home from "./components/Home";
import ProtectRoute from "./components/auth/protectRoute";
import Chats from "./components/Chats";
import { server } from './constants/config.js'
import axios from "axios";
import { useAuthStore } from "./store/authStore.js";

// Lazy-loaded pages
// const Group = lazy(() => import("./components/Group"));
const Login = lazy(() => import("./components/Login"));
const NotFound = lazy(() => import("./components/NotFound"));
const AdminLogin = lazy(() => import("./components/AdminLogin"));
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const UserManagement = lazy(() => import("./components/admin/UserManagement"));
const ChatManagement = lazy(() => import("./components/admin/ChatManagement"));
const MessagesManagement = lazy(() => import("./components/admin/MessagesManagement"));



// Helper component to wrap lazy components with Suspense
const LazyWrapper = ({ children }) => (
  <Suspense fallback={<div>Loading component...</div>}>
    {children}
  </Suspense>
);



function App() {

  const { user, loader, userNotExists, userExists } = useAuthStore()

  

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">

        <Route index element={<Home />} />
        <Route path="login" element={
          <LazyWrapper>
            <Login />
          </LazyWrapper>
        }
        />

        <Route path="chat/:chatid" element={
          <LazyWrapper>
            <Chats />
          </LazyWrapper>
        }
        />

        <Route path="admin">
          <Route index element={
            <ProtectRoute user={user}>
              <LazyWrapper>
                <AdminLogin />
              </LazyWrapper>
            </ProtectRoute>
          }
          />
          <Route path="dashboard" element={
            <ProtectRoute user={user}>
              <LazyWrapper>
                <Dashboard />
              </LazyWrapper>
            </ProtectRoute>
          }
          />
          <Route path="users" element={
            <ProtectRoute user={user}>
              <LazyWrapper>
                <UserManagement />
              </LazyWrapper>
            </ProtectRoute>
          }
          />
          <Route path="chats" element={
            <ProtectRoute user={user}>
              <LazyWrapper>
                <ChatManagement />
              </LazyWrapper>
            </ProtectRoute>
          }
          />
          <Route path="messages" element={<ProtectRoute user={user}>
            <LazyWrapper>
              <MessagesManagement />
            </LazyWrapper>
          </ProtectRoute>
          }
          />
        </Route>
        <Route path="*" element={
          <LazyWrapper>
            <NotFound />
          </LazyWrapper>
        }
        />
      </Route>
    )
  );


  useEffect(() => {
    axios
      .get(`${server}/api/v1/users/getmyprofile`, {
        withCredentials: true
      })
      .then(({ data }) => {
        userExists({ user: data.data })
      }).catch((err) => userNotExists())
  }, [])

  return loader ? <p>loading......</p> : <RouterProvider router={router} />;
}

export default App;