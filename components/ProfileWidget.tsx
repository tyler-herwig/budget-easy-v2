"use client";

import { useProfile } from "@/context/ProfileContext";
import { MonetizationOn } from "@mui/icons-material";
import { Box, Avatar, Typography, Chip } from "@mui/material";
import React from "react";
import { SkeletonProfileWidget } from "./Loaders/SkeletonProfileWidget";
import { NumericFormat } from "react-number-format";

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
          <Typography sx={{ mt: 5 }}>Year to Date</Typography>

          <Chip
            icon={<MonetizationOn />}
            label={
              <NumericFormat
                value={profile?.total_income || 0}
                displayType="text"
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
              />
            }
            color="success"
            variant="outlined"
            sx={{ mt: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            Income
          </Typography>
          <Chip
            icon={<MonetizationOn />}
            label={
              <NumericFormat
                value={profile?.total_expenses || 0}
                displayType="text"
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
              />
            }
            color="primary"
            variant="outlined"
            sx={{ mt: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            Expenses
          </Typography>
        </>
      )}
    </Box>
  );
};

export default ProfileWidget;
