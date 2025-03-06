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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Expense</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date Due</TableCell>
              <TableCell>Date Paid</TableCell>
              <TableCell>Autopay</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedExpenses[monthYear].map((expense, expenseIndex) => (
              <TableRow key={expenseIndex}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {expense.expense_name}
                </TableCell>
                <TableCell>
                  <NumericFormat
                    value={expense.amount || 0}
                    displayType="text"
                    thousandSeparator={true}
                    prefix="$"
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {moment(expense.date_due).format("MMMM Do, YYYY")}
                </TableCell>
                <TableCell
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {expense.date_paid ? (
                    moment(expense.date_paid).format("MMMM Do, YYYY")
                  ) : expense.date_due &&
                    moment(expense.date_due).isBefore(moment(), "day") ? (
                    <Chip
                      icon={<Error />}
                      label="Past due"
                      color="error"
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Chip
                      icon={<Error />}
                      label="Not paid"
                      color="warning"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {expense.autopay ? <Check color="success" /> : ""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  ));
};

export default ExpenseList;
