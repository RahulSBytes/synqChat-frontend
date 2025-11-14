import { create } from "zustand";
import { server } from "../constants/config.js";
import axios from "axios";
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

  updateUser: (user) => set({ user }),

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
}));
