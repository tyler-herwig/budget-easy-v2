import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Add } from "@mui/icons-material";
import AddBudgetStepper from "./AddBudgetStepper";

interface AddBudgetDialogProps {
  refetch: () => void;
}

const AddBudgetDialog: React.FC<AddBudgetDialogProps> = ({ refetch }) => {
  const [open, setOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        sx={{ borderRadius: "25px", mt: -2 }}
        startIcon={<Add />}
        onClick={handleClickOpen}
      >
        Add Budget
      </Button>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={activeStep === 0 ? 'sm' : 'md'}
        onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { borderRadius: "15px" } }}
      >
        <DialogTitle>Add New Budget</DialogTitle>
        <DialogContent>
          <AddBudgetStepper refetch={refetch} handleClose={handleClose} activeStep={activeStep} setActiveStep={setActiveStep} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddBudgetDialog;
