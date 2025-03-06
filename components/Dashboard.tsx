'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Grid, Container, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell, Box, Alert, AlertTitle, Chip } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { NumericFormat } from 'react-number-format';
import { useQuery } from '@tanstack/react-query';
import moment, { Moment } from 'moment';
import { Expense } from '@/types/expense';
import { Income } from '@/types/income';
import { fetchExpenses } from '@/utils/fetch/expense';
import { groupByMonthYear } from '@/utils/helpers/expense';
import { fetchIncome } from '@/utils/fetch/income';
import { LoadingSpinner } from './LoadingSpinner';
import { CalendarMonth, Check, Error, MonetizationOn, Money } from '@mui/icons-material';
import IncomeVsExpensesChart from './IncomeVsExpenseChart';

const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedStartDate = localStorage.getItem('startDate');
      const storedEndDate = localStorage.getItem('endDate');
      if (storedStartDate) {
        setStartDate(moment(storedStartDate));
      }
      if (storedEndDate) {
        setEndDate(moment(storedEndDate));
      }
    }
  }, []);

  useEffect(() => {
    if (startDate) {
      localStorage.setItem('startDate', startDate.format('YYYY-MM-DD'));
    }
    if (endDate) {
      localStorage.setItem('endDate', endDate.format('YYYY-MM-DD'));
    }
  }, [startDate, endDate]);

  const { data: incomes, isLoading: isLoadingIncome, isError: isErrorIncome, error: incomeError } = useQuery<Income[], Error>({
    queryKey: ['income', startDate, endDate],
    queryFn: () => fetchIncome(
      startDate ? moment(startDate).format('YYYY-MM-DD') : '',
      endDate ? moment(endDate).format('YYYY-MM-DD') : ''
    ),
    enabled: !!startDate && !!endDate
  });

  const { data: expenses, isLoading: isLoadingExpenses, isError: isErrorExpenses, error: expensesError } = useQuery<Expense[], Error>({
    queryKey: ['expenses', startDate, endDate],
    queryFn: () => fetchExpenses(
      startDate ? moment(startDate).format('YYYY-MM-DD') : '',
      endDate ? moment(endDate).format('YYYY-MM-DD') : ''
    ),
    enabled: !!startDate && !!endDate
  });

  const groupedExpenses = useMemo(() => {
    return expenses ? groupByMonthYear(expenses) : {};
  }, [expenses]);

  const handleStartDateChange = (newValue: Moment | null) => setStartDate(newValue);
  const handleEndDateChange = (newValue: Moment | null) => setEndDate(newValue);

  if (isLoadingIncome || isLoadingExpenses) {
    return <LoadingSpinner />
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
        <Box
          sx={{
            position: 'sticky', 
            top: 68.5, 
            zIndex: 1,
            backgroundColor: 'inherit'
          }}
        >
          <Container maxWidth="xl" sx={{ mb: 3, pt: 2, pb: 2 }}>
          <Box 
              sx={{ 
                display: 'flex', 
                gap: 2
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
          </Container>
        </Box>
        <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
            {(!incomes || !expenses) && (!startDate || !endDate) ? (
              <Alert variant="outlined" severity="info">
                <AlertTitle>Get Started</AlertTitle>
                To get started, select a start date and end date. Once selected, you will see income and expenses for that time range.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ height: '400px', width: '100% !important' }}>
                    <IncomeVsExpensesChart incomes={incomes} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Box 
                      sx={{ 
                        position: 'sticky', 
                        top: 180,
                        backgroundColor: 'inherit'
                      }}
                    >
                      <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Income
                            </Typography>
                            {isErrorIncome ? (
                              <Typography color="error">{(incomeError as Error).message || 'Failed to fetch income'}</Typography>
                            ) : (
                              <Table>
                                <TableHead>
                                    <TableRow>
                                      <TableCell>Income Date</TableCell>
                                      <TableCell>Amount</TableCell>
                                      <TableCell>Total Expenses</TableCell>
                                      <TableCell>Money Remaining</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                  {incomes?.map((income) => (
                                    <TableRow key={income.id}>
                                      <TableCell sx={{ fontWeight: 'bold' }}>{moment(income.date_received).format('MMMM Do, YYYY')}</TableCell>
                                      <TableCell>
                                        <NumericFormat
                                            value={income.amount || 0}
                                            displayType="text"
                                            thousandSeparator={true}
                                            prefix="$"
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <NumericFormat
                                            value={income.total_expenses || 0}
                                            displayType="text"
                                            thousandSeparator={true}
                                            prefix="$"
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Chip 
                                          icon={<MonetizationOn />} 
                                          label={
                                            <NumericFormat
                                                value={income.money_remaining || 0}
                                                displayType="text"
                                                thousandSeparator={true}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                            />
                                          }
                                          color={income.money_remaining > 0 ? 'success' : 'error'} 
                                          variant="outlined" 
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </CardContent>
                      </Card>
                    </Box>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Card>
                        <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Expenses
                        </Typography>
                        {isErrorExpenses ? (
                            <Typography color="error">{(expensesError as Error).message || 'Failed to fetch expenses'}</Typography>
                        ) : (
                            // Render grouped expenses
                            Object.keys(groupedExpenses).map((monthYear, index) => (
                            <div key={index}>
                                <Typography variant="h6" sx={{ mt: 3 }} color="primary">
                                  <CalendarMonth sx={{ pt: 1}} /> {monthYear}
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
                                          <TableCell sx={{ fontWeight: 'bold' }}>{expense.expense_name}</TableCell>
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
                                          <TableCell>
                                            {expense.date_paid ? (
                                              moment(expense.date_paid).format('MMMM Do, YYYY')
                                            ) : expense.date_due && moment(expense.date_due).isBefore(moment(), 'day') ? (
                                              <Chip icon={<Error />} label="Past due" color="error" variant="outlined" size="small" />
                                            ) : (
                                              <Chip icon={<Error />} label="Not paid" color="warning" variant="outlined" size="small" />
                                            )}
                                          </TableCell>
                                          <TableCell>{expense.autopay ? <Check color="success" /> : ''}</TableCell>
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
            )}

        </Container>
    </LocalizationProvider>
  );
};

export default Dashboard;