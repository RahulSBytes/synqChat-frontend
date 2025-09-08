import { create } from "zustand";
import { server } from "../constants/config.js";
import axios from "axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  isAdmin: false,
  loader: true,

  userExists: (user) => set({ user, loader: false }),
  userNotExists: () => set({ user: null, loader: false }),

  adminLogin: async (secretKey) => {
    try {
      const config = {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.post(
        `${server}/api/v1/admin/verify`,
        { secretKey },
        config
      );

      set({ isAdmin: true });
      toast.success(data.message);
    } catch (error) {
      set({ isAdmin: false });
      toast.error(error.response?.data?.message || "Login failed");
    }
  },

  getAdmin: async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/admin/`, {
        withCredentials: true,
      });
      set({ isAdmin: !!data.admin });
    } catch (error) {
      set({ isAdmin: false });
    }
  },

  adminLogout: async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/admin/logout`, {
        withCredentials: true,
      });

      set({ isAdmin: false });
      toast.success(data.message);
    } catch (error) {
      set({ isAdmin: true });
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },
}));
