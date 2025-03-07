"use client";

import { Income } from "@/types/income";
import { Add, ExpandMore, MonetizationOn } from "@mui/icons-material";
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Tooltip,
  LinearProgress,
  Button,
  IconButton,
  Badge,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  useTheme,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { NumericFormat } from "react-number-format";

interface IncomeListProps {
  incomes: Income[] | undefined;
}

const IncomeList: React.FC<IncomeListProps> = ({ incomes }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {incomes?.map((income) => {
        const expensePercentage =
          income.amount > 0 ? (income.total_expenses / income.amount) * 100 : 0;

        return (
          <Grid item xs={12} key={income.id}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                boxShadow: 3,
                borderRadius: 5,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      Income Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {moment(income.date_received).format("MMMM Do, YYYY")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
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
                        expensePercentage < 75
                          ? "success"
                          : expensePercentage < 100
                          ? "warning"
                          : "error"
                      }
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Tooltip
                    title={`${Math.round(
                      Math.min(expensePercentage, 100)
                    )}% of income used`}
                    arrow
                  >
                    <Box>
                      <LinearProgress
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          mt: 1,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor:
                              expensePercentage < 75
                                ? "#66bb6a"
                                : expensePercentage < 100
                                ? "#ffa726"
                                : "#f44336",
                          },
                        }}
                        variant="determinate"
                        value={Math.round(Math.min(expensePercentage, 100))}
                      />
                    </Box>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    mt: 2,
                  }}
                >
                  {income.additional_income.length > 0 ? (
                    <Accordion
                      sx={{
                        boxShadow: "none",
                        border: "none",
                        margin: 0,
                        padding: 0,
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={{
                          margin: 0,
                          padding: 0,
                          minHeight: "unset",
                          "& .MuiAccordionSummary-content": {
                            margin: 0,
                          },
                        }}
                      >
                        <Badge
                          badgeContent={
                            income.additional_income.length > 0
                              ? income.additional_income.length
                              : null
                          }
                          color="primary"
                          sx={{
                            "& .MuiBadge-badge": {
                              right: -10,
                              top: 10,
                            },
                          }}
                        >
                          <Typography variant="body2" sx={{ pr: 1 }}>
                            Additional Income
                          </Typography>
                        </Badge>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mb: 2,
                          }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Add />}
                            sx={{ borderRadius: "15px" }}
                          >
                            Additional Income
                          </Button>
                        </Box>
                        <Grid container>
                          <Grid item xs={4}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                              }}
                            >
                              <Typography variant="h5" sx={{ fontWeight: "bolder" }}>
                                <NumericFormat
                                  value={income.additional_income.reduce(
                                    (sum, item) => sum + item.amount,
                                    0
                                  )}
                                  displayType="text"
                                  thousandSeparator={true}
                                  prefix="$"
                                  decimalScale={2}
                                  fixedDecimalScale={true}
                                />
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={8}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Description
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Amount
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {income.additional_income.map(
                                  (additionalIncome) => (
                                    <TableRow key={additionalIncome.id}>
                                      <TableCell sx={{ fontWeight: "bold" }}>
                                        {additionalIncome.description}
                                      </TableCell>
                                      <TableCell>
                                        <NumericFormat
                                          value={additionalIncome.amount || 0}
                                          displayType="text"
                                          thousandSeparator={true}
                                          prefix="$"
                                          decimalScale={2}
                                          fixedDecimalScale={true}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end"
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Add />}
                        sx={{ borderRadius: "15px", mr: 1 }}
                      >
                        Additional Income
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default IncomeList;
