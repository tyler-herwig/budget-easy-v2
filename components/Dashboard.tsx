'use client';

import React, { useMemo, useState } from 'react';
import { Grid, Container, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell, Box, Button } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { NumericFormat } from 'react-number-format';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import moment, { Moment } from 'moment';

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

// Fetch expenses from API
const fetchExpenses = async (startDate: string, endDate: string): Promise<ExpenseData[]> => {
  const { data } = await axios.get('/api/expenses', {
    params: {
        start_date: startDate,
        end_date: endDate
    }
  });
  return data;
};

// Group expenses by month and year
const groupByMonthYear = (expenses: ExpenseData[]) => {
    return expenses.reduce((acc, expense) => {
      // Parse the date using moment and format it as 'MMMM, YYYY'
      const monthYearKey = moment(expense.date_due).format('MMMM, YYYY');
  
      // Group expenses by month and year
      if (!acc[monthYearKey]) {
        acc[monthYearKey] = [];
      }
  
      acc[monthYearKey].push(expense);
      return acc;
    }, {} as Record<string, ExpenseData[]>);
};

const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);

  // Sample income data
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

  const { data: expenses, isLoading, isError, error } = useQuery<ExpenseData[], Error>({
    queryKey: ['expenses', startDate, endDate],
    queryFn: () => fetchExpenses(
      startDate ? moment(startDate).format('YYYY-MM-DD') : '',
      endDate ? moment(endDate).format('YYYY-MM-DD') : ''
    ),
    enabled: !!startDate && !!endDate
  });

  // Group expenses by month and year using useMemo to optimize performance
  const groupedExpenses = useMemo(() => {
    return expenses ? groupByMonthYear(expenses) : {};
  }, [expenses]);

  const handleStartDateChange = (newValue: Moment | null) => setStartDate(newValue);
  const handleEndDateChange = (newValue: Moment | null) => setEndDate(newValue);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
        <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
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
            <Grid container spacing={3}>
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
                            // Render grouped expenses
                            Object.keys(groupedExpenses).map((monthYear, index) => (
                            <div key={index}>
                                <Typography variant="h6" sx={{ mt: 3 }}>
                                {monthYear}
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
                                        <TableCell>{moment(expense.date_due).format('MMMM Do, YYYY')}</TableCell>
                                        <TableCell>{expense.date_paid ? moment(expense.date_paid).format('MMMM Do, YYYY') : 'Not Paid'}</TableCell>
                                        <TableCell>{expense.autopay ? 'Yes' : 'No'}</TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                            </div>
                            ))
                        )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    </LocalizationProvider>
  );
};

export default Dashboard;