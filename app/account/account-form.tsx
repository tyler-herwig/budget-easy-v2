'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useProfile } from '@/context/ProfileContext';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/profile';

export default function AccountForm({ user }: { user: User | null }) {
  const { profile, loading, updateProfile } = useProfile();
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullname(profile.full_name);
      setUsername(profile.username);
      setWebsite(profile.website);
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (profile) {
      const updatedProfile: Profile = { full_name: fullname, username, website, avatar_url };
      await updateProfile(updatedProfile);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, mt: 5 }}>
        <Typography variant="h5" gutterBottom align="center">
          Account Settings
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Email" type="text" value={user?.email} disabled fullWidth />

          <TextField
            label="Full Name"
            type="text"
            value={fullname || ''}
            onChange={(e) => setFullname(e.target.value)}
            fullWidth
          />

          <TextField
            label="Username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />

          <TextField
            label="Website"
            type="url"
            value={website || ''}
            onChange={(e) => setWebsite(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateProfile}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>

          <form action="/auth/signout" method="post">
            <Button type="submit" variant="outlined" color="secondary" fullWidth>
              Sign Out
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
}