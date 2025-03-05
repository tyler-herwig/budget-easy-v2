'use client';

import { login, signup } from './actions';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, mt: 5 }}>
        <Typography variant="h5" gutterBottom align="center">
          Welcome Back
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <form action={login}>
            <TextField label="Email" id="email" name="email" type="email" required fullWidth sx={{ mb: 2 }}/>
            <TextField label="Password" id="password" name="password" type="password" required fullWidth />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Log in
            </Button>
          </form>

          <form action={signup}>
            <Button type="submit" variant="outlined" color="secondary" fullWidth>
              Sign up
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
}