import { Navigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore.js"

export default function ProtectRoute({ children }) {
    const user = useAuthStore((state) => state.user);
    return user ? children : <Navigate to={'/auth/login'} replace />
}