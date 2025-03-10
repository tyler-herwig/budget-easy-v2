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
  Badge,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  useTheme,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { NumericFormat } from "react-number-format";
import AdditionalIncomeTable from "./Income/AdditionalIncomeTable";
import AdditionalIncomeForm from "./Income/AdditionalIncomeForm";

interface IncomeListProps {
  incomes: Income[] | undefined;
  refetch: () => void;
}

const IncomeList: React.FC<IncomeListProps> = ({ incomes, refetch }) => {

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
                        <AdditionalIncomeForm income={income} refetch={refetch} />
                        <AdditionalIncomeTable income={income.additional_income} refetch={refetch} />
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    <AdditionalIncomeForm income={income} refetch={refetch} />
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
