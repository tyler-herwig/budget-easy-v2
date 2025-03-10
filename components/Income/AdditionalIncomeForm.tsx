import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Add, Info } from "@mui/icons-material";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputAdornment from "@mui/material/InputAdornment";
import { Income } from "@/types/income";
import moment from "moment";
import { NumericFormat } from "react-number-format";
import axios from "axios";

const validationSchema = Yup.object({
  description: Yup.string().required("Description is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
});

interface AdditionalIncomeFormProps {
  income: Income;
  refetch: () => void;
}

const AdditionalIncomeForm: React.FC<AdditionalIncomeFormProps> = ({
  income,
  refetch,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (values: {
    income_id: string;
    description: string;
    amount: number;
  }) => {
    try {
      await axios.post("/api/additional-income", {
        income_id: values.income_id,
        description: values.description,
        amount: values.amount,
      });

      await refetch();
      handleClose();
    } catch (error) {
      console.error("Error occurred while adding income", error);
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
          Additional Income
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { borderRadius: "15px" } }}
      >
        <DialogTitle>Add Additional Income</DialogTitle>
        <Formik
          initialValues={{ income_id: income.id, description: "", amount: 0 }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            touched,
            errors,
            isValid,
            dirty,
            isSubmitting,
          }) => (
            <Form>
              <DialogContent>
                <Typography variant="body2">
                  <Info fontSize="small" sx={{ pt: 1 }} /> Saving will add to
                  your income of{" "}
                  <NumericFormat
                    value={income.amount || 0}
                    displayType="text"
                    thousandSeparator={true}
                    prefix="$"
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />{" "}
                  on {moment(income.date_received).format("MMMM Do, YYYY")}
                </Typography>

                <TextField
                  fullWidth
                  margin="dense"
                  id="description"
                  name="description"
                  label="Description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                  variant="standard"
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
                  variant="standard"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
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
                    <CircularProgress size={24} color="inherit" sx={{mr: 1 }} /> Saving
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

export default AdditionalIncomeForm;
