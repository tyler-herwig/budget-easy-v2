'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Grid, Container, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell, Box, Alert, AlertTitle, Chip, LinearProgress, Tooltip } from '@mui/material';
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
import { CalendarMonth, Check, Error, MonetizationOn } from '@mui/icons-material';
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
                    <Typography variant="h6" gutterBottom>
                        Income
                    </Typography>
                    <Box 
                      sx={{ 
                        position: 'sticky', 
                        top: 180,
                        backgroundColor: 'inherit'
                      }}
                    >
                      {isErrorIncome ? (
                        <Typography color="error">{(incomeError as Error).message || 'Failed to fetch income'}</Typography>
                      ) : (
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          {incomes?.map((income) => {
                            const expensePercentage = income.amount > 0 ? (income.total_expenses / income.amount) * 100 : 0;

                            return (
                              <Grid item xs={12} key={income.id}>
                                <Card sx={{ display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                                  <CardContent>
                                    {/* Income Row with 4 Columns */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                        <Typography variant="body2" color="textSecondary">
                                          Income Date
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                          {moment(income.date_received).format('MMMM Do, YYYY')}
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                        <Typography variant="body2" color="textSecondary">
                                          Amount
                                        </Typography>
                                        <Typography variant="body2">
                                          <NumericFormat
                                            value={income.amount || 0}
                                            displayType="text"
                                            thousandSeparator={true}
                                            prefix="$"
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                          />
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                        <Typography variant="body2" color="textSecondary">
                                          Total Expenses
                                        </Typography>
                                        <Typography variant="body2">
                                          <NumericFormat
                                            value={income.total_expenses || 0}
                                            displayType="text"
                                            thousandSeparator={true}
                                            prefix="$"
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                          />
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                        <Typography variant="body2" color="textSecondary">
                                          Money Remaining
                                        </Typography>
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
                                          color={
                                            expensePercentage < 75 ? 'success' 
                                              : expensePercentage < 100 ? 'warning' 
                                              : 'error'
                                          }
                                          variant="outlined"
                                          size="small"
                                        />
                                      </Box>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                      <Tooltip title={`${Math.round(Math.min(expensePercentage, 100))}% of income used`} arrow>
                                        <Box>
                                          <LinearProgress
                                            sx={{
                                              height: 8,
                                              borderRadius: 5,
                                              mt: 1,
                                              '& .MuiLinearProgress-bar': {
                                                backgroundColor: expensePercentage < 75 ? '#66bb6a'
                                                  : expensePercentage < 100 ? '#ffa726'
                                                  : '#f44336',
                                              },
                                            }}
                                            variant="determinate"
                                            value={Math.round(Math.min(expensePercentage, 100))}
                                          />
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>
                            )
                          })}
                        </Grid>
                      )}
                    </Box>
                </Grid>
                <Grid item xs={12} md={7}>
                      <Typography variant="h6" gutterBottom>
                          Expenses
                      </Typography>
                      {isErrorExpenses ? (
                          <Typography color="error">{(expensesError as Error).message || 'Failed to fetch expenses'}</Typography>
                      ) : (
                        Object.keys(groupedExpenses).map((monthYear, index) => (
                          <Card key={index} sx={{ mb: 3 }}>
                            <CardContent>
                              <Typography variant="h6" color="primary">
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
                                        <TableCell 
                                          sx={{
                                            fontWeight: 'bold', 
                                            whiteSpace: 'nowrap', 
                                            overflow: 'hidden', 
                                            textOverflow: 'ellipsis',
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
                                            whiteSpace: 'nowrap', 
                                            overflow: 'hidden', 
                                            textOverflow: 'ellipsis',
                                          }}
                                        >
                                          {moment(expense.date_due).format('MMMM Do, YYYY')}
                                        </TableCell>
                                        <TableCell 
                                          sx={{
                                            whiteSpace: 'nowrap', 
                                            overflow: 'hidden', 
                                            textOverflow: 'ellipsis',
                                          }}
                                        >
                                          {expense.date_paid ? (
                                            moment(expense.date_paid).format('MMMM Do, YYYY')
                                          ) : expense.date_due && moment(expense.date_due).isBefore(moment(), 'day') ? (
                                            <Chip icon={<Error />} label="Past due" color="error" variant="outlined" size="small" />
                                          ) : (
                                            <Chip icon={<Error />} label="Not paid" color="warning" variant="outlined" size="small" />
                                          )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{expense.autopay ? <Check color="success" /> : ''}</TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </Grid>
            </Grid>
            )}

        </Container>
    </LocalizationProvider>
  );
};

export default Dashboard;