import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
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

    const profileId = user.id;

    // Fetch the budget templates for the authenticated user's profile_id
    const { data: templates, error } = await supabase
      .from('budget_templates')
      .select('*')
      .eq('profile_id', profileId)

    // Handle any errors from the database query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return the templates data
    return NextResponse.json(templates)
  } catch (error) {
    console.error(error); 
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}