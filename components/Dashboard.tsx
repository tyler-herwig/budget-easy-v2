"use client";

import React, { useEffect, useState } from "react";
import {
  Grid,
  Container,
  Typography,
  Box,
  Alert,
  AlertTitle,
  Card,
  CardContent,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useQuery } from "@tanstack/react-query";
import moment, { Moment } from "moment";
import { Expense } from "@/types/expense";
import { Income } from "@/types/income";
import { fetchExpenses } from "@/utils/fetch/expense";
import { fetchIncome } from "@/utils/fetch/income";
import { LoadingSpinner } from "./LoadingSpinner";
import IncomeVsExpensesChart from "./IncomeVsExpenseChart";
import IncomeList from "./IncomeList";
import ExpenseList from "./ExpenseList";

const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedStartDate = localStorage.getItem("startDate");
      const storedEndDate = localStorage.getItem("endDate");
      if (storedStartDate) {
        setStartDate(moment(storedStartDate));
      }
      if (storedEndDate) {
        setEndDate(moment(storedEndDate));
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (startDate) {
      localStorage.setItem("startDate", startDate.format("YYYY-MM-DD"));
    }
    if (endDate) {
      localStorage.setItem("endDate", endDate.format("YYYY-MM-DD"));
    }
  }, [startDate, endDate]);

  const {
    data: incomes,
    isLoading: isLoadingIncome,
    isError: isErrorIncome,
    error: incomeError,
  } = useQuery<Income[], Error>({
    queryKey: ["income", startDate, endDate],
    queryFn: () =>
      fetchIncome(
        startDate ? moment(startDate).format("YYYY-MM-DD") : "",
        endDate ? moment(endDate).format("YYYY-MM-DD") : ""
      ),
    enabled: !!startDate && !!endDate,
  });

  const {
    data: expenses,
    isLoading: isLoadingExpenses,
    isError: isErrorExpenses,
    error: expensesError,
  } = useQuery<Expense[], Error>({
    queryKey: ["expenses", startDate, endDate],
    queryFn: () =>
      fetchExpenses(
        startDate ? moment(startDate).format("YYYY-MM-DD") : "",
        endDate ? moment(endDate).format("YYYY-MM-DD") : ""
      ),
    enabled: !!startDate && !!endDate,
  });

  const handleStartDateChange = (newValue: Moment | null) =>
    setStartDate(newValue);
  const handleEndDateChange = (newValue: Moment | null) => setEndDate(newValue);

  if (loading || isLoadingIncome || isLoadingExpenses) {
    return <LoadingSpinner />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Grid container spacing={3} sx={{ pl: 3, pr: 3}}>
        <Grid item xs={12}>
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "#121212",
              pt: 3,
              pb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </Box>
          </Box>
          {(!incomes || !expenses) && (!startDate || !endDate) ? (
            <Alert variant="outlined" severity="info">
              <AlertTitle>Get Started</AlertTitle>
              To get started, select a start date and end date. Once selected,
              you will see income and expenses for that time range.
            </Alert>
          ) : (
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <Box sx={{ height: "400px", width: "100% !important" }}>
                  <IncomeVsExpensesChart incomes={incomes} />
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="h6" gutterBottom>
                  Income
                </Typography>
                <Box
                  sx={{
                    position: "sticky",
                    top: 90,
                    backgroundColor: "inherit",
                  }}
                >
                  {isErrorIncome ? (
                    <Typography color="error">
                      {(incomeError as Error).message ||
                        "Failed to fetch income"}
                    </Typography>
                  ) : (
                    <IncomeList incomes={incomes} />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography variant="h6" gutterBottom>
                  Expenses
                </Typography>
                {isErrorExpenses ? (
                  <Typography color="error">
                    {(expensesError as Error).message ||
                      "Failed to fetch expenses"}
                  </Typography>
                ) : (
                  <ExpenseList expenses={expenses} />
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default Dashboard;
