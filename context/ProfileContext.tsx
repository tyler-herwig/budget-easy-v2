"use client";

import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type User } from "@supabase/supabase-js";
import { Profile } from "@/types/profile";

interface ProfileContextType {
  profile: Profile | undefined;
  loading: boolean;
  refetchProfile: () => void;
  updateProfile: (updatedProfile: Profile) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery<Profile>({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not found");
      const { data } = await axios.get(`/api/profile/${user.id}`);
      return data;
    },
    enabled: !!user, // Only run if user exists
  });

  const mutation = useMutation({
    mutationFn: async (updatedProfile: Profile) => {
      if (!user) throw new Error("User not found");
      await axios.put(`/api/profile/${user.id}`, updatedProfile);
    },
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      }
      alert("Profile updated!");
    },
    onError: () => {
      alert("Error updating profile!");
    },
  });

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading: isLoading,
        refetchProfile: refetch,
        updateProfile: mutation.mutateAsync,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
