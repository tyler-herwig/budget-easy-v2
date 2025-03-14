import { AdditionalIncome } from "./additional_income";

export interface Income {
    id: string;
    amount: number;
    date_received: string;
    total_expenses: number;
    money_remaining: number;
    additional_income: AdditionalIncome[];
}