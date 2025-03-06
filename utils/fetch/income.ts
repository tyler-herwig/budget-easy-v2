import { Income } from "@/types/income";
import axios from "axios";

// Fetch income from API
export const fetchIncome = async (startDate: string, endDate: string): Promise<Income[]> => {
    const { data } = await axios.get('/api/income', {
        params: {
            start_date: startDate,
            end_date: endDate
        }
    });
    return data;
};