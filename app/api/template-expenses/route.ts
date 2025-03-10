import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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

    // Extract budget_template_id from query parameters
    const { searchParams } = new URL(request.url);
    const budgetTemplateId = searchParams.get('budget_template_id');

    if (!budgetTemplateId) {
      return NextResponse.json({ error: 'Missing budget_template_id' }, { status: 400 });
    }

    // Fetch template expenses for the given budget_template_id and authenticated user
    const { data: expenses, error } = await supabase
      .from('template_expenses')
      .select('*')
      .eq('profile_id', profileId)
      .eq('budget_template_id', budgetTemplateId);

    // Handle any errors from the database query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the expenses data
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}