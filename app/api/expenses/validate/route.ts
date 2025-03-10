import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If no user is authenticated, return an error
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const profileId = user.id;

    // Get the request body (month and year)
    const { month, year } = await request.json();

    // Check if any expenses exist for the selected month and year
    const { data: existingExpenses, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('profile_id', profileId)
      .eq('date_due', `${year}-${month + 1}-01`); // Check for expenses in the selected month and year

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If expenses exist for the given month and year, return exists = true
    return NextResponse.json({ exists: existingExpenses.length > 0 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}