"use client";

import { Expense } from "@/types/expense";
import { groupByMonthYear } from "@/utils/helpers/expense";
import { CalendarMonth } from "@mui/icons-material";
import { Card, CardContent, Typography } from "@mui/material";
import React, { useMemo } from "react";
import ExpensesTable from "./Expenses/ExpensesTable";

interface ExpenseListProps {
  expenses: Expense[] | undefined;
  refetch: () => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, refetch }) => {
  const groupedExpenses = useMemo(() => {
    return expenses ? groupByMonthYear(expenses) : {};
  }, [expenses]);

  return Object.keys(groupedExpenses).map((monthYear, index) => (
    <Card key={index} sx={{ mb: 3, borderRadius: 5 }}>
      <CardContent>
        <Typography variant="h6" color="primary">
          <CalendarMonth sx={{ pt: 1 }} /> {monthYear}
        </Typography>
        <ExpensesTable
          expenses={groupedExpenses[monthYear]}
          refetch={refetch}
        />
      </CardContent>
    </Card>
  ));
};

export default ExpenseList;
