import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { parseISO } from 'date-fns'

export async function GET(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Parse query parameters for start_date and end_date
    const url = new URL(request.url)
    const startDate = url.searchParams.get('start_date')
    const endDate = url.searchParams.get('end_date')

    // Build the query to filter income by date range and sort by date_received
    let incomeQuery = supabase
      .from('income')
      .select('*')
      .eq('profile_id', user.id)
      .order('date_received', { ascending: true })

    if (startDate) {
      incomeQuery = incomeQuery.gte('date_received', parseISO(startDate).toISOString())
    }

    if (endDate) {
      incomeQuery = incomeQuery.lte('date_received', parseISO(endDate).toISOString())
    }

    const { data: incomeRecords, error: incomeError } = await incomeQuery

    if (incomeError) {
      return NextResponse.json({ error: incomeError.message }, { status: 500 })
    }

    // Fetch all expenses for this user in the given date range
    let expenseQuery = supabase
      .from('expenses')
      .select('*')
      .eq('profile_id', user.id)
      .order('date_due', { ascending: true })

    if (startDate) {
      expenseQuery = expenseQuery.gte('date_due', parseISO(startDate).toISOString())
    }

    if (endDate) {
      expenseQuery = expenseQuery.lte('date_due', parseISO(endDate).toISOString())
    }

    const { data: expenses, error: expenseError } = await expenseQuery

    if (expenseError) {
      return NextResponse.json({ error: expenseError.message }, { status: 500 })
    }

    // Compute total_expenses and money_remaining for each income record
    const enhancedIncome = incomeRecords.map((income, index) => {
      // Define the range for expenses: between this income and the next one
      const nextIncomeDate = incomeRecords[index + 1]?.date_received || null

      const filteredExpenses = expenses.filter((expense) => {
        return (
          expense.date_due >= income.date_received &&
          (!nextIncomeDate || expense.date_due < nextIncomeDate)
        )
      })

      // Calculate total_expenses in this range
      const total_expenses = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)

      // Calculate money_remaining
      const money_remaining = Number(income.amount) - total_expenses

      return {
        ...income,
        total_expenses,
        money_remaining,
      }
    })

    return NextResponse.json(enhancedIncome)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}