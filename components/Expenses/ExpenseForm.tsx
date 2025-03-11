import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Add, Info } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputAdornment from "@mui/material/InputAdornment";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import axios from "axios";

const validationSchema = Yup.object({
  expense_name: Yup.string().required("Expense name is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  date_due: Yup.string().required("Date due is required"),
  autopay: Yup.boolean().required("Autopay selection is required"),
});

interface ExpenseFormProps {
  monthYear: string;
  refetch: () => Promise<void>;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ monthYear, refetch }) => {
  const [open, setOpen] = React.useState(false);

  const firstDayOfMonth = moment(monthYear, "MMMM, YYYY").startOf("month");
  const lastDayOfMonth = moment(monthYear, "MMMM, YYYY").endOf("month");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (values: {
    expense_name: string;
    amount: number;
    date_due: string;
    autopay: boolean;
  }) => {
    try {
      await axios.post("/api/expenses", {
        expenses: [
          {
            expense_name: values.expense_name,
            amount: values.amount,
            formatted_date: values.date_due,
            autopay: values.autopay,
          },
        ],
      });

      await refetch();
      handleClose();
    } catch (error) {
      console.error("Error occurred while adding expense", error);
    }
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<Add />}
          sx={{ borderRadius: "15px" }}
          onClick={handleClickOpen}
        >
          Add Expense
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { borderRadius: "15px" } }}
      >
        <DialogTitle>Add Expense</DialogTitle>
        <Formik
          initialValues={{
            expense_name: "",
            amount: 0,
            date_due: moment(monthYear, "MMMM, YYYY").format("YYYY-MM-DD"),
            autopay: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            touched,
            errors,
            isValid,
            dirty,
            isSubmitting,
          }) => (
            <Form>
              <DialogContent>
                <Typography variant="body2">
                  <Info fontSize="small" sx={{ pt: 1 }} /> Some info about
                  saving an expense.
                </Typography>

                <TextField
                  fullWidth
                  margin="dense"
                  id="expense_name"
                  name="expense_name"
                  label="Expense"
                  value={values.expense_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.expense_name && errors.expense_name)}
                  helperText={touched.expense_name && errors.expense_name}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  margin="dense"
                  id="amount"
                  name="amount"
                  label="Amount"
                  type="number"
                  value={values.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.amount && errors.amount)}
                  helperText={touched.amount && errors.amount}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <DatePicker
                  label="Date Due"
                  value={moment(values.date_due)}
                  onChange={(date) =>
                    setFieldValue(
                      "date_due",
                      date ? moment(date).format("YYYY-MM-DD") : ""
                    )
                  }
                  minDate={firstDayOfMonth}
                  maxDate={lastDayOfMonth}
                  sx={{ mb: 2 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      id="autopay"
                      name="autopay"
                      checked={values.autopay}
                      onChange={(event) =>
                        setFieldValue("autopay", event.target.checked)
                      }
                      onBlur={handleBlur}
                      color="primary"
                    />
                  }
                  label="Autopay enabled"
                  labelPlacement="end" 
                  sx={{ display: 'block'}}
                />
              </DialogContent>

              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress
                        size={24}
                        color="inherit"
                        sx={{ mr: 1 }}
                      />{" "}
                      Saving
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </React.Fragment>
  );
};

export default ExpenseForm;
