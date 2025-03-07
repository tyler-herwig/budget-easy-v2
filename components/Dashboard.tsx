"use client";

import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Alert,
  AlertTitle,
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
import IncomeVsExpensesChart from "./IncomeVsExpenseChart";
import IncomeList from "./IncomeList";
import ExpenseList from "./ExpenseList";
import { SkeletonCard } from "./Loaders/SkeletonCard";

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

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Grid container spacing={3} sx={{ pl: 3, pr: 3 }}>
        <Grid item xs={12}>
          <Box
            sx={{
              right: "15px",
              position: "fixed",
              top: "15px",
              zIndex: 1300,
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
          {!loading && (!incomes || !expenses) && (!startDate || !endDate) ? (
            <Alert variant="outlined" severity="info" sx={{ mt: 3 }}>
              <AlertTitle>Get Started</AlertTitle>
              To get started, select a start date and end date. Once selected,
              you will see income and expenses for that time range.
            </Alert>
          ) : (
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <Box sx={{ height: "400px", width: "100% !important" }}>
                  {loading || isLoadingIncome ? (
                    <SkeletonCard count={1} width={1557} height={400} />
                  ) : (
                    <IncomeVsExpensesChart incomes={incomes} />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="h6" gutterBottom>
                  Income
                </Typography>
                <Box
                  sx={{
                    position: "sticky",
                    top: 80,
                    backgroundColor: "inherit",
                  }}
                >
                  {isErrorIncome ? (
                    <Typography color="error">
                      {(incomeError as Error).message ||
                        "Failed to fetch income"}
                    </Typography>
                  ) : loading || isLoadingIncome ? (
                    <SkeletonCard count={5} width={634.75} height={154.77} />
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
                ) : loading || isLoadingExpenses ? (
                  <SkeletonCard count={1} width={898.25} height={1000} />
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
