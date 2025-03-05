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

    // If no user is authenticated, return an error
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Parse query parameters for start_date and end_date
    const url = new URL(request.url)
    const startDate = url.searchParams.get('start_date')
    const endDate = url.searchParams.get('end_date')

    // Build the query to filter expenses by date range
    let query = supabase.from('expenses').select('*').eq('profile_id', user.id).order('date_due', { ascending: true })

    if (startDate) {
      const parsedStartDate = parseISO(startDate)
      query = query.gte('date_due', parsedStartDate) // Filter expenses where date_due is greater than or equal to start_date
    }

    if (endDate) {
      const parsedEndDate = parseISO(endDate)
      query = query.lte('date_due', parsedEndDate) // Filter expenses where date_due is less than or equal to end_date
    }

    // Fetch expenses for the authenticated user's profile_id within the date range
    const { data: expenses, error } = await query

    // Handle any errors from the database query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return the filtered expenses data
    return NextResponse.json(expenses)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
