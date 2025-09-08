import { create } from "zustand";
import axios from "axios";
import { server } from "../constants/config.js";

export const useApiStore = create(() => ({
  myChats: async () =>
    axios.get(`${server}/api/v1/chat/my`, { withCredentials: true }),

  searchUser: async (name) =>
    axios.get(`${server}/api/v1/user/search?name=${name}`, {
      withCredentials: true,
    }),

  sendFriendRequest: async (data) =>
    axios.put(`${server}/api/v1/user/sendrequest`, data, {
      withCredentials: true,
    }),

  getNotifications: async () =>
    axios.get(`${server}/api/v1/user/notifications`, {
      withCredentials: true,
    }),

  acceptFriendRequest: async (data) =>
    axios.put(`${server}/api/v1/user/acceptrequest`, data, {
      withCredentials: true,
    }),

  chatDetails: async ({ chatId, populate = false }) => {
    let url = `${server}/api/v1/chat/${chatId}`;
    if (populate) url += "?populate=true";
    return axios.get(url, { withCredentials: true });
  },

  getMessages: async ({ chatId, page }) =>
    axios.get(`${server}/api/v1/chat/message/${chatId}?page=${page}`, {
      withCredentials: true,
    }),

  sendAttachments: async (data) =>
    axios.post(`${server}/api/v1/chat/message`, data, {
      withCredentials: true,
    }),

  myGroups: async () =>
    axios.get(`${server}/api/v1/chat/my/groups`, {
      withCredentials: true,
    }),

  availableFriends: async (chatId) => {
    let url = `${server}/api/v1/user/friends`;
    if (chatId) url += `?chatId=${chatId}`;
    return axios.get(url, { withCredentials: true });
  },

  newGroup: async ({ name, members }) =>
    axios.post(
      `${server}/api/v1/chat/new`,
      { name, members },
      { withCredentials: true }
    ),

  renameGroup: async ({ chatId, name }) =>
    axios.put(
      `${server}/api/v1/chat/${chatId}`,
      { name },
      { withCredentials: true }
    ),

  removeGroupMember: async ({ chatId, userId }) =>
    axios.put(
      `${server}/api/v1/chat/removemember`,
      { chatId, userId },
      { withCredentials: true }
    ),

  addGroupMembers: async ({ members, chatId }) =>
    axios.put(
      `${server}/api/v1/chat/addmembers`,
      { members, chatId },
      { withCredentials: true }
    ),

  deleteChat: async (chatId) =>
    axios.delete(`${server}/api/v1/chat/${chatId}`, { withCredentials: true }),

  leaveGroup: async (chatId) =>
    axios.delete(`${server}/api/v1/chat/leave/${chatId}`, {
      withCredentials: true,
    }),
}));
