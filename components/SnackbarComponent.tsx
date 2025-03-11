import { Alert, Snackbar } from "@mui/material";

interface SnackbarProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

const SnackbarComponent: React.FC<SnackbarProps> = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={8000} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <Alert onClose={onClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;