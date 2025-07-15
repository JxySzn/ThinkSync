import { create } from "zustand";

interface User {
  _id?: string;
  id?: string;
  fullname?: string;
  username?: string;
  avatar?: string;
  location?: string;
  joinDate?: string;
  online?: boolean;
  followers?: string[];
  following?: string[];
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  updateFollowing: (username: string, follow: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateFollowing: (username, follow) => {
    set((state) => {
      if (!state.user) return state;
      let following = state.user.following || [];
      if (follow) {
        if (!following.includes(username)) following = [...following, username];
      } else {
        following = following.filter((u) => u !== username);
      }
      return { user: { ...state.user, following } };
    });
  },
}));
