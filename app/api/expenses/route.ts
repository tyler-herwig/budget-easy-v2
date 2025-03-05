import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log(user);

    // If no user is authenticated, return an error
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Fetch expenses for the authenticated user's profile_id
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('profile_id', user.id)
      .order('date_due', { ascending: true })

    // Handle any errors from the database query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return the expenses data
    return NextResponse.json(expenses)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
