import { create } from "zustand";
import axios from "axios";
import { server } from "../constants/config.js";
import { apiRequest } from "../helpers/helpers.js";
import { persist } from "zustand/middleware";

export const useApiStore = create(
  persist((set) => ({
    messagesRelatedToChat: [],

    fetchMessages: async (currentSelectedChatId) => {
      const [data, error] = await apiRequest(
        axios.get(`${server}/api/v1/chats/getmsgs/${currentSelectedChatId}`, {
          withCredentials: true,
        })
      );

      if (error) return false;

      set({ messagesRelatedToChat: data.chat });
      return true;
    },

    contacts: [],

    fetchContact: async () => {
      const [data, error] = await apiRequest(
        axios.get(`${server}/api/v1/chats`, { withCredentials: true })
      );

      if (error) return false;

      set({ contacts: data.chats });
      return true;
    },

    sendMessage: async (formData, currentSelectedChatId) => {
      const [data, error] = await apiRequest(
        axios.post(
          `${server}/api/v1/chats/sendMessage/${currentSelectedChatId}`,
          formData,
          { withCredentials: true }
        )
      );

      if (error) return false;
      return true;
    },

    createGroup: async (formData) => {
      const [data, error] = await apiRequest(
        axios.post(`${server}/api/v1/chats`, formData, {
          withCredentials: true,
        })
      );

      return error ? false : true;
    },

    handleInvite: async (userId) => {
      const [data, error] = await apiRequest(
        axios.post(
          `${server}/api/v1/users/sendfriendrequest?q=${userId}`,
          {},
          { withCredentials: true }
        )
      );
      console.log(data, error);
      return error ? false : true;
    },

    fetchUsersEligibleForInvitation: async (searchQuery) => {
      const controller = new AbortController();

      const [data, error] = await apiRequest(
        axios.get(`${server}/api/v1/chats/findUser`, {
          params: { q: searchQuery.trim() },
          withCredentials: true,
          signal: controller.signal,
        })
      );

      return error ? [] : data;
    },

    fetchNotifications: async () => {
      const [data, error] = await apiRequest(
        axios.get(`${server}/api/v1/users/notifications`, {
          withCredentials: true,
        })
      );
      return error ? [] : data.data;
    },

    handleFriendRequest: async (requestId, accept) => {
      const [data, error] = await apiRequest(
        axios.post(
          `${server}/api/v1/users/respondfriendrequest`,
          { requestId, accept },
          { withCredentials: true }
        )
      );

      console.log("handleFriendRequest::", data, error);
      return error ? false : true;
    },

    // myChats: async () =>
    //   axios.get(`${server}/api/v1/chat/my`, { withCredentials: true }),

    // searchUser: async (name) =>
    //   axios.get(`${server}/api/v1/user/search?name=${name}`, {
    //     withCredentials: true,
    //   }),

    // sendFriendRequest: async (data) =>
    //   axios.put(`${server}/api/v1/user/sendrequest`, data, {
    //     withCredentials: true,
    //   }),

    // getNotifications: async () =>
    //   axios.get(`${server}/api/v1/user/notifications`, {
    //     withCredentials: true,
    //   }),

    // acceptFriendRequest: async (data) =>
    //   axios.put(`${server}/api/v1/user/acceptrequest`, data, {
    //     withCredentials: true,
    //   }),

    // chatDetails: async ({ chatId, populate = false }) => {
    //   let url = `${server}/api/v1/chat/${chatId}`;
    //   if (populate) url += "?populate=true";
    //   return axios.get(url, { withCredentials: true });
    // },

    // getMessages: async ({ chatId, page }) =>
    //   axios.get(`${server}/api/v1/chat/message/${chatId}?page=${page}`, {
    //     withCredentials: true,
    //   }),

    // sendAttachments: async (data) =>
    //   axios.post(`${server}/api/v1/chat/message`, data, {
    //     withCredentials: true,
    //   }),

    // myGroups: async () =>
    //   axios.get(`${server}/api/v1/chat/my/groups`, {
    //     withCredentials: true,
    //   }),

    // availableFriends: async (chatId) => {
    //   let url = `${server}/api/v1/user/friends`;
    //   if (chatId) url += `?chatId=${chatId}`;
    //   return axios.get(url, { withCredentials: true });
    // },

    // newGroup: async ({ name, members }) =>
    //   axios.post(
    //     `${server}/api/v1/chat/new`,
    //     { name, members },
    //     { withCredentials: true }
    //   ),

    // renameGroup: async ({ chatId, name }) =>
    //   axios.put(
    //     `${server}/api/v1/chat/${chatId}`,
    //     { name },
    //     { withCredentials: true }
    //   ),

    // removeGroupMember: async ({ chatId, userId }) =>
    //   axios.put(
    //     `${server}/api/v1/chat/removemember`,
    //     { chatId, userId },
    //     { withCredentials: true }
    //   ),

    // addGroupMembers: async ({ members, chatId }) =>
    //   axios.put(
    //     `${server}/api/v1/chat/addmembers`,
    //     { members, chatId },
    //     { withCredentials: true }
    //   ),

    // deleteChat: async (chatId) =>
    //   axios.delete(`${server}/api/v1/chat/${chatId}`, { withCredentials: true }),

    // leaveGroup: async (chatId) =>
    //   axios.delete(`${server}/api/v1/chat/leave/${chatId}`, {
    //     withCredentials: true,
    //   }),
  }))
);
