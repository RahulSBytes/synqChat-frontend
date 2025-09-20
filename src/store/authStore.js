import { create } from "zustand";
import { server } from "../constants/config.js";
import axios from "axios";
import toast from "react-hot-toast";
import { apiRequest } from "../helpers/helpers.js";

export const useAuthStore = create((set) => ({
  user: null,
  isAdmin: false,
  loader: true,
  error: null,

  userExists: (user) => set({ user, loader: false }),
  userNotExists: () => set({ user: null, loader: false }),

  login: async (params) => {
    set({ error: null, loader: true });
    const [data, error] = await apiRequest(
      axios.post(`${server}/api/v1/auth/login`, params, {
        withCredentials: true,
      })
    );

    if (error) {
      set({ error, loader: false });
      return false;
    }

    set({ user: data.savedUserData, error: null, loader: false });
    return true;
  },

  

  logout: async () => {
    set({ error: null });
    const [data, error] = await apiRequest(
      axios.post(
        `${server}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      )
    );

    if (error) { 
      set({ error });
      return false;
    }

    set({ user: null });
    return true
  },




  // adminLogin: async (secretKey) => {
  //   try {
  //     const config = {
  //       withCredentials: true,
  //       headers: { "Content-Type": "application/json" },
  //     };

  //     const { data } = await axios.post(
  //       `${server}/api/v1/admin/verify`,
  //       { secretKey },
  //       config
  //     );

  //     set({ isAdmin: true });
  //     toast.success(data.message);
  //   } catch (error) {
  //     set({ isAdmin: false });
  //     toast.error(error.response?.data?.message || "Login failed");
  //   }
  // },

  // getAdmin: async () => {
  //   try {
  //     const { data } = await axios.get(`${server}/api/v1/admin/`, {
  //       withCredentials: true,
  //     });
  //     set({ isAdmin: !!data.admin });
  //   } catch (error) {
  //     set({ isAdmin: false });
  //   }
  // },

  // adminLogout: async () => {
  //   try {
  //     const { data } = await axios.get(`${server}/api/v1/admin/logout`, {
  //       withCredentials: true,
  //     });

  //     set({ isAdmin: false });
  //     toast.success(data.message);
  //   } catch (error) {
  //     set({ isAdmin: true });
  //     toast.error(error.response?.data?.message || "Logout failed");
  //   }
  // },
}));
