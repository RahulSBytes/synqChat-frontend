// chatStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NEW_MESSAGE_ALERT } from "../constants/events";

export const useChatStore = create(
  persist(
    (set, get) => ({
      notificationCount: 0,

      currentSelectedChatId: null,
      setCurrentSelectedChatId: (chatId) =>
        set({ currentSelectedChatId: chatId }),

      newMessagesAlert: [],

      incrementNotification: () =>
        set((state) => ({
          notificationCount: state.notificationCount + 1,
        })),

      resetNotificationCount: () => set({ notificationCount: 0 }),

      setNewMessagesAlert: ({ chatId }) =>
        set((state) => {
          const index = state.newMessagesAlert.findIndex(
            (item) => item.chatId === chatId
          );

          if (index !== -1) {
            const updated = [...state.newMessagesAlert];
            updated[index].count += 1;
            return { newMessagesAlert: updated };
          } else {
            return {
              newMessagesAlert: [
                ...state.newMessagesAlert,
                { chatId, count: 1 },
              ],
            };
          }
        }),

      removeNewMessagesAlert: (chatId) =>
        set((state) => ({
          newMessagesAlert: state.newMessagesAlert.filter(
            (item) => item.chatId !== chatId
          ),
        })),
    }),
    {
      name: "chat-storage", // 🔑 key where it’s saved in localStorage
      partialize: (state) => ({
        currentSelectedChatId: state.currentSelectedChatId,
      }),
    }
  )
);