import { Navigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore.js"

export default function ProtectRoute({ children }) {
    const user = useAuthStore((state) => state.user);
    const loader = useAuthStore((state) => state.loader);
    if (loader) return <p>Loading…</p>;
    return user ? children : <Navigate to={'/auth/login'} replace />
}