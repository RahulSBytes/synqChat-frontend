import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "./components/Home";
import ProtectRoute from "./components/auth/protectRoute";
import Chats from "./components/Chats";

// Lazy-loaded pages
const Group = lazy(() => import("./components/Group"));
const Login = lazy(() => import("./components/Login"));
const NotFound = lazy(() => import("./components/NotFound"));
const AdminLogin = lazy(() => import("./components/AdminLogin"));
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const UserManagement = lazy(() => import("./components/admin/UserManagement"));
const ChatManagement = lazy(() => import("./components/admin/ChatManagement"));
const MessagesManagement = lazy(() => import("./components/admin/MessagesManagement"));


const user = true;


// Helper component to wrap lazy components with Suspense
const LazyWrapper = ({ children }) => (
  <Suspense fallback={<div>Loading component...</div>}>
    {children}
  </Suspense>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">

      <Route index element={<Home />} />
      <Route path="group" element={
        <ProtectRoute user={user}>
          <LazyWrapper>
            <Group />
          </LazyWrapper>
        </ProtectRoute>
      }
      />
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

function App() {
  return <RouterProvider router={router} />;
}

export default App;