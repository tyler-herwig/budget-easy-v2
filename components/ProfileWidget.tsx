"use client";

import { useProfile } from "@/context/ProfileContext";
import { MonetizationOn } from "@mui/icons-material";
import {
  Box,
  Avatar,
  Typography,
  Chip,
} from "@mui/material";
import React from "react";
import { SkeletonProfileWidget } from "./Loaders/SkeletonProfileWidget";

interface ProfileWidgetProps {
  open: boolean;
}

const ProfileWidget: React.FC<ProfileWidgetProps> = ({ open }) => {
  const { profile } = useProfile();

  return (
    <Box
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "15px",
          height: "300px",
        },
        !open && { display: "none" },
      ]}
    >
      {!profile ? (
        <SkeletonProfileWidget />
      ) : (
        <>
          <Avatar sx={{ width: 80, height: 80 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Welcome back,
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {profile?.full_name}
          </Typography>
          <Chip
            icon={<MonetizationOn />}
            label="$1,265.15"
            color="success"
            variant="outlined"
            sx={{ mt: 5 }}
          />
          <Typography variant="body2" color="text.secondary">
            Money remaining
          </Typography>
        </>
      )}
    </Box>
  );
};

export default ProfileWidget;
