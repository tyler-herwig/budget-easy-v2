import SnackbarComponent from "@/components/SnackbarComponent";
import { createContext, useContext, useState } from "react";

interface SnackbarContextType {
  showSnackbar: (message: string, severity?: "success" | "error" | "info" | "warning") => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<{ message: string; open: boolean; severity: "success" | "error" | "info" | "warning" }>({
    message: "",
    open: false,
    severity: "info",
  });

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning" = "info") => {
    setSnackbar({ message, open: true, severity });
  };

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <SnackbarComponent open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleClose} />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};