import { Skeleton } from "@mui/material";

export const SkeletonProfileWidget = () => {
  return (
    <>
      <Skeleton variant="circular" width={80} height={80} />
      <Skeleton variant="text" width={101.69} height={20.02} sx={{ fontSize: '0.875rem', mt: 1 }} />
      <Skeleton variant="text" width={124.63} height={32} sx={{ fontSize: '1.25rem' }} />
      <Skeleton variant="text" width={124.63} height={24} sx={{ fontSize: '1rem', mt: 5 }} />
      <Skeleton variant="rounded" width={110} height={32} sx={{ borderRadius: '16px', mt: 2 }} />
      <Skeleton variant="text" width={65} height={20.02} sx={{ fontSize: '0.875rem' }} />
      <Skeleton variant="rounded" width={110} height={32} sx={{ borderRadius: '16px', mt: 1 }} />
      <Skeleton variant="text" width={65} height={20.02} sx={{ fontSize: '0.875rem' }} />
    </>
  );
};
