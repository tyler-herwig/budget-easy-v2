'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';

interface Profile { 
    full_name: string | null; 
    username: string | null; 
    website: string | null; 
    avatar_url: string | null; 
}

interface ProfileContextType {
    profile: Profile | null;
    loading: boolean;
    fetchProfile: () => Promise<void>;
    updateProfile: (updatedProfile: Profile) => Promise<void>;
}
  
const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ user, children }: { user: User | null; children: React.ReactNode }) {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);  
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updatedProfile: Profile) => {
    if (!user) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        ...updatedProfile,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setProfile(updatedProfile);
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating profile!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, fetchProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}
  