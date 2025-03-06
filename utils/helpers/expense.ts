import { Expense } from "@/types/expense";
import moment from "moment";

// Group expenses by month and year
export const groupByMonthYear = (expenses: Expense[]) => {
    return expenses.reduce((acc, expense) => {
      const monthYearKey = moment(expense.date_due).format('MMMM, YYYY');
  
      // Group expenses by month and year
      if (!acc[monthYearKey]) {
        acc[monthYearKey] = [];
      }
  
      acc[monthYearKey].push(expense);
      return acc;
    }, {} as Record<string, Expense[]>);
};