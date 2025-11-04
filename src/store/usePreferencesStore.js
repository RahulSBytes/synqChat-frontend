// store/usePreferencesStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { apiRequest } from "../helpers/helpers.js";
import { server } from "../constants/config";

const usePreferencesStore = create(
  persist(
    (set, get) => ({
      preferences: null,

      fetchPreferences: async () => {
        const [data, error] = await apiRequest(
          axios.get(`${server}/api/v1/preferences`, {
            withCredentials: true,
          })
        );

        if (error) return false;

        set({ preferences: data.preferences });

        // Apply theme immediately
        document.documentElement.classList.toggle(
          "dark",
          data.preferences.appearance.theme === "dark"
        );

        // Apply font size
        document.documentElement.style.setProperty(
          "--font-size",
          data.preferences.appearance.fontSize
        );

        // Apply accent color
        document.documentElement.style.setProperty(
          "--accent-color",
          data.preferences.accentColor
        );

        return true;
      },

      // Update appearance
      updateAppearance: async (settings) => {
        const [data, error] = await apiRequest(
          axios.patch(`${server}/api/v1/preferences/appearance`, settings, {
            withCredentials: true,
          })
        );

        if (error) return false;

        set((state) => ({
          preferences: {
            ...state.preferences,
            appearance: { ...state.preferences.appearance, ...settings },
          },
        }));

        // Apply changes immediately
        if (settings.theme) {
          document.documentElement.classList.toggle(
            "dark",
            settings.theme === "dark"
          );
        }
        if (settings.fontSize) {
          document.documentElement.style.setProperty(
            "--font-size",
            settings.fontSize
          );
        }
        if (settings.chatWallpaper !== undefined) {
          document.documentElement.style.setProperty(
            "--chat-wallpaper",
            settings.chatWallpaper ? `url(${settings.chatWallpaper})` : "none"
          );
        }

        return true;
      },

      // Update privacy
      updatePrivacy: async (settings) => {
        const [data, error] = await apiRequest(
          axios.patch(`${server}/api/v1/preferences/privacy`, settings, {
            withCredentials: true,
          })
        );

        if (error) return false;

        set((state) => ({
          preferences: {
            ...state.preferences,
            privacy: { ...state.preferences.privacy, ...settings },
          },
        }));

        return true;
      },

      // Update general settings
      updateGeneralSettings: async (settings) => {
        const [data, error] = await apiRequest(
          axios.patch(`${server}/api/v1/preferences/general`, settings, {
            withCredentials: true,
          })
        );

        if (error) return false;

        set((state) => ({
          preferences: {
            ...state.preferences,
            ...settings,
          },
        }));

        // Apply accent color if changed
        if (settings.accentColor) {
          document.documentElement.style.setProperty(
            "--accent-color",
            settings.accentColor
          );
        }

        return true;
      },

      // Toggle single setting
      toggleSetting: async (key, value) => {
        const [data, error] = await apiRequest(
          axios.patch(
            `${server}/api/v1/preferences/toggle`,
            { [key]: value },
            {
              withCredentials: true,
            }
          )
        );

        if (error) return false;

        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value,
          },
        }));

        return true;
      },

      // Reset to defaults
      resetPreferences: async () => {
        const [data, error] = await apiRequest(
          axios.post(`${server}/api/v1/preferences/reset`, null, {
            withCredentials: true,
          })
        );

        if (error) return false;

        set({ preferences: data.preferences });

        // Reapply defaults
        document.documentElement.classList.toggle(
          "dark",
          data.preferences.appearance.theme === "dark"
        );
        document.documentElement.style.setProperty("--font-size", "medium");
        document.documentElement.style.setProperty(
          "--accent-color",
          "#0084ff"
        );
        document.documentElement.style.setProperty("--chat-wallpaper", "none");

        return true;
      },

      // ===== HELPER METHODS =====

      getPreference: (key) => {
        const prefs = get().preferences;
        if (!prefs) return null;

        // Handle nested keys like 'appearance.theme'
        const keys = key.split(".");
        let value = prefs;
        for (const k of keys) {
          value = value?.[k];
        }
        return value;
      },

      isFeatureEnabled: (feature) => {
        return get().preferences?.[feature] === true;
      },
    }),
    {
      name: "user-preferences",
      partialize: (state) => ({
        preferences: state.preferences,
      }),
    }
  )
);

export default usePreferencesStore;