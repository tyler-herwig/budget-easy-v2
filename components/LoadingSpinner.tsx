import { Box, CircularProgress } from "@mui/material"

export const LoadingSpinner = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px'
            }}
        >
            <CircularProgress />
        </Box>
    )
}