'use client';

import React, { useEffect, useState } from 'react';
import { Grid, Container, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface IncomeData {
  incomeDate: string;
  incomeAmount: number;
  totalExpenses: number;
  moneyRemaining: number;
}

interface ExpenseData {
  expense_name: string;
  amount: number;
  date_due: string;
  date_paid: string;
  autopay: boolean;
}

// Function to fetch expenses from the API
const fetchExpenses = async (): Promise<ExpenseData[]> => {
  const { data } = await axios.get('/api/expenses');
  return data;
};

const Dashboard: React.FC = () => {
  // Hardcoded data for income
  const incomeData: IncomeData[] = [
    {
      incomeDate: '2025-03-01',
      incomeAmount: 5000,
      totalExpenses: 3000,
      moneyRemaining: 2000,
    },
    {
      incomeDate: '2025-03-15',
      incomeAmount: 4500,
      totalExpenses: 2500,
      moneyRemaining: 2000,
    },
  ];

  // Use React Query to fetch expenses data
  const { data: expenses, isLoading, isError, error } = useQuery<ExpenseData[], Error>({
    queryKey: ['expenses'],  // query key
    queryFn: fetchExpenses,  // query function
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
      <Grid container spacing={3}>
        {/* Income Column */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Income
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Income Date</TableCell>
                    <TableCell>Income Amount</TableCell>
                    <TableCell>Total Expenses</TableCell>
                    <TableCell>Money Remaining</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incomeData.map((income, index) => (
                    <TableRow key={index}>
                      <TableCell>{income.incomeDate}</TableCell>
                      <TableCell>{`$${income.incomeAmount.toFixed(2)}`}</TableCell>
                      <TableCell>{`$${income.totalExpenses.toFixed(2)}`}</TableCell>
                      <TableCell>{`$${income.moneyRemaining.toFixed(2)}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Expenses Column */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expenses
              </Typography>
              {isLoading ? (
                <Typography>Loading expenses...</Typography>
              ) : isError ? (
                <Typography color="error">{(error as Error).message || 'Failed to fetch expenses'}</Typography>
              ) : (
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
                    {expenses?.map((expense, index) => (
                      <TableRow key={index}>
                        <TableCell>{expense.expense_name}</TableCell>
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
                        <TableCell>{expense.date_due}</TableCell>
                        <TableCell>{expense.date_paid || 'Not Paid'}</TableCell>
                        <TableCell>{expense.autopay ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;