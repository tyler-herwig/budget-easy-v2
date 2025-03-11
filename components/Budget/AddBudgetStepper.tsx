import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Step,
  StepLabel,
  Stepper,
  CircularProgress,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers";
import { useQuery } from "@tanstack/react-query";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LoadingSpinner } from "../LoadingSpinner";
import { NumericFormat } from "react-number-format";
import { Check } from "@mui/icons-material";
import axios from "axios";

const steps = ["Select Template", "Refine Budget"];

interface AddBudgetStepperProps {
  refetch: () => void;
  handleClose: () => void;
}

// Fetch budget templates
const fetchBudgetTemplates = async () => {
  const response = await axios.get("/api/budget-templates");
  return response.data;
};

// Fetch template expenses
const fetchTemplateExpenses = async (budgetTemplateId: number) => {
  const response = await axios.get(
    `/api/template-expenses?budget_template_id=${budgetTemplateId}`
  );
  return response.data;
};

const AddBudgetStepper: React.FC<AddBudgetStepperProps> = ({
  refetch,
  handleClose,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [budgetTemplateId, setBudgetTemplateId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [adjustedExpenses, setAdjustedExpenses] = useState<any[]>([]);

  const {
    data: templates = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["budgetTemplates"],
    queryFn: fetchBudgetTemplates,
  });

  const { data: expenses = [], isFetching: loadingExpenses } = useQuery({
    queryKey: ["templateExpenses", budgetTemplateId],
    queryFn: () => fetchTemplateExpenses(budgetTemplateId!),
    enabled: !!budgetTemplateId
  });

  useEffect(() => {
    if (budgetData && expenses.length > 0) {
      const selectedMonth = moment(budgetData?.month);
      const selectedYear = budgetData?.year || moment().year();

      const adjusted = expenses.map((expense: any) => {
        const lastDay = selectedMonth.daysInMonth();
        const adjustedDueDay = Math.min(expense.due_day, lastDay);

        const adjustedDate = moment()
          .year(selectedYear)
          .month(selectedMonth.month())
          .date(adjustedDueDay);

        return {
          ...expense,
          formatted_date: adjustedDate.format("YYYY-MM-DD"),
        };
      });

      setAdjustedExpenses(adjusted);
    }
  }, [budgetData, expenses]);

  const handleNext = async (values: any) => {
    if (activeStep === 0) {
      setBudgetData(values);
      setBudgetTemplateId(
        templates.find((t: any) => t.template_name === values.template)?.id ||
          null
      );

      // Call the validation API before moving to step 2
      try {
        const response = await axios.post("/api/expenses/validate", {
          month: values.month.month(),
          year: values.year,
        });

        if (response.data.exists) {
          // If a budget already exists for the selected month and year, prevent moving forward
          alert("A budget already exists for the selected month and year.");
          return;
        }

        // No budget found, proceed to step 2
        setActiveStep(1);
      } catch (error) {
        console.error("Error validating budget:", error);
        alert("Failed to validate the budget.");
      }
    } else {
      try {
        setIsSaving(true);
        const expensesToSubmit = adjustedExpenses.map((expense: any) => ({
          expense_name: expense.expense_name,
          expense_description: expense.expense_description || "",
          amount: expense.amount,
          formatted_date: expense.formatted_date,
          autopay: expense.autopay || false,
        }));

        const response = await axios.post("/api/expenses", {
          expenses: expensesToSubmit,
        });

        if (response.status === 200) {
          await refetch();
          handleClose();
        } else {
          alert("Error adding expenses");
        }
      } catch (error) {
        console.error("Error submitting expenses:", error);
        alert("Failed to add expenses");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  if (isLoading || loadingExpenses) return <LoadingSpinner />;
  if (isError) return <Typography>Error loading templates.</Typography>;

  const columns: GridColDef[] = [
    { field: "expense_name", headerName: "Expense", flex: 3, editable: true },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      flex: 1,
      editable: true,
      renderCell: (params: any) => (
        <NumericFormat
          value={params.value || 0}
          displayType="text"
          thousandSeparator={true}
          prefix="$"
          decimalScale={2}
          fixedDecimalScale={true}
        />
      ),
    },
    {
      field: "formatted_date",
      headerName: "Date Due",
      flex: 1,
      editable: true,
      renderEditCell: (params: any) => {
        const selectedMonth = moment(budgetData?.month);

        return (
          <DatePicker
            value={moment(params.value)}
            onChange={(newValue) => {
              if (newValue) {
                params.api.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: newValue,
                });
              }
            }}
            shouldDisableDate={(date) => !date.isSame(selectedMonth, "month")} // Disable dates outside selected month
          />
        );
      },
      renderCell: (params: any) => moment(params.value).format("MMMM Do, YYYY"),
    },
    {
      field: "autopay",
      headerName: "Autopay",
      flex: 0.5,
      editable: true,
      renderEditCell: (params: any) => (
        <Select
          value={params.value ? "Yes" : "No"}
          onChange={(event) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: event.target.value === "Yes",
            })
          }
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </Select>
      ),
      renderCell: (params: any) =>
        params.value ? <Check color="success" /> : "",
    }
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Formik
        initialValues={{
          month: moment(),
          year: moment().year(),
          template: templates[0]?.template_name || "",
        }}
        onSubmit={handleNext}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  marginTop: 2,
                }}
              >
                {/* Month Picker */}
                <Field name="month">
                  {({ field }: any) => (
                    <DatePicker
                      label="Month"
                      views={["month"]}
                      value={field.value}
                      onChange={(newDate: any) =>
                        setFieldValue("month", newDate!)
                      }
                    />
                  )}
                </Field>

                {/* Year Picker */}
                <Field name="year">
                  {({ field }: any) => (
                    <DatePicker
                      label="Year"
                      views={["year"]}
                      value={moment().year(field.value)}
                      onChange={(newDate: any) =>
                        setFieldValue("year", moment(newDate!).year())
                      }
                    />
                  )}
                </Field>

                {/* Template Dropdown */}
                <FormControl fullWidth>
                  <InputLabel>Template</InputLabel>
                  <Select
                    value={values.template}
                    onChange={(e) => setFieldValue("template", e.target.value)}
                    label="Template"
                  >
                    {templates.map((templateOption: any) => (
                      <MenuItem
                        key={templateOption.id}
                        value={templateOption.template_name}
                      >
                        {templateOption.template_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {activeStep === 1 && (
              <Box sx={{ marginTop: 2 }}>
                {loadingExpenses ? (
                  <LoadingSpinner />
                ) : (
                  <DataGrid
                    rows={adjustedExpenses}
                    columns={columns}
                    autoHeight
                    processRowUpdate={(newRow) => {
                      // Update state with the modified row
                      setAdjustedExpenses((prev) =>
                        prev.map((row) => (row.id === newRow.id ? newRow : row))
                      );
                      return newRow;
                    }}
                  />
                )}
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button type="submit" disabled={loadingExpenses || isSaving}>
                {activeStep === steps.length - 1 ? (
                  isSaving ? (
                    <>
                      <CircularProgress
                        size={24}
                        color="inherit"
                        sx={{ mr: 1 }}
                      />{" "}
                      Generating Budget
                    </>
                  ) : (
                    "Generate Budget"
                  )
                ) : (
                  "Next"
                )}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddBudgetStepper;
