"use client";

import { Expense } from "@/types/expense";
import { groupByMonthYear } from "@/utils/helpers/expense";
import { CalendarMonth, Check, Error } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import moment from "moment";
import React, { useMemo } from "react";
import { NumericFormat } from "react-number-format";
import ExpensesTable from "./Expenses/ExpensesTable";

interface ExpenseListProps {
  expenses: Expense[] | undefined;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  const groupedExpenses = useMemo(() => {
    return expenses ? groupByMonthYear(expenses) : {};
  }, [expenses]);

  return Object.keys(groupedExpenses).map((monthYear, index) => (
    <Card key={index} sx={{ mb: 3, borderRadius: 5 }}>
      <CardContent>
        <Typography variant="h6" color="primary">
          <CalendarMonth sx={{ pt: 1 }} /> {monthYear}
        </Typography>
        <ExpensesTable expenses={groupedExpenses[monthYear]} />
      </CardContent>
    </Card>
  ));
};

export default ExpenseList;
