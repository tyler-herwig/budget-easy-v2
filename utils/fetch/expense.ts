import { Expense } from "@/types/expense";
import axios from "axios";

// Get all expenses
export const fetchExpenses = async (startDate: string, endDate: string): Promise<Expense[]> => {
    const { data } = await axios.get('/api/expenses', {
        params: {
            start_date: startDate,
            end_date: endDate
        }
    });
    return data;
};