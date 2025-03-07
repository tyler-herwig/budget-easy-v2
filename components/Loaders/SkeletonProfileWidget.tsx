import { Skeleton } from "@mui/material";

export const SkeletonProfileWidget = () => {
  return (
    <>
      <Skeleton variant="circular" width={80} height={80} />
      <Skeleton variant="text" width={101.69} height={20.02} sx={{ fontSize: '0.875rem', mt: 1 }} />
      <Skeleton variant="text" width={124.63} height={32} sx={{ fontSize: '1.25rem' }} />
      <Skeleton variant="rounded" width={102.36} height={32} sx={{ borderRadius: '16px', mt: 5 }} />
      <Skeleton variant="text" width={114.25} height={20.02} sx={{ fontSize: '0.875rem' }} />
    </>
  );
};
