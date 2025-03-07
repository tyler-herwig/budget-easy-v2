import React from "react";
import { Skeleton } from "@mui/material";

interface SkeletonCardProps {
  count: number;
  width: number;
  height: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  count,
  width,
  height,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          width={width}
          height={height}
          sx={{ mb: 3, borderRadius: '15px' }}
        />
      ))}
    </>
  );
};
