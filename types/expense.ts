export interface Expense {
    expense_name: string;
    amount: number;
    date_due: string;
    date_paid: string;
    autopay: boolean;
}