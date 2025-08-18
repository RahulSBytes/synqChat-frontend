import { Navigate } from "react-router-dom"

export default function ProtectRoute({ user, children }) {
    return user ? children : <Navigate to={'/login'} replace />
}