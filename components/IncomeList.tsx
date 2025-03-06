"use client";

import { Income } from "@/types/income";
import { MonetizationOn } from "@mui/icons-material";
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { NumericFormat } from "react-number-format";

interface IncomeListProps {
  incomes: Income[] | undefined;
}

const IncomeList: React.FC<IncomeListProps> = ({ incomes }) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {incomes?.map((income) => {
        const expensePercentage =
          income.amount > 0 ? (income.total_expenses / income.amount) * 100 : 0;

        return (
          <Grid item xs={12} key={income.id}>
            <Card
              sx={{ display: "flex", flexDirection: "column", boxShadow: 3, borderRadius: 5 }}
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
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default IncomeList;
