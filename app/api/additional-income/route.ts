import { createClient } from '@/utils/supabase/server'
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
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
  
      // Parse request body (expecting an array of IDs directly)
      const ids: string[] = await request.json()
  
      if (!Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: 'No IDs provided or invalid format' }, { status: 400 })
      }
  
      // Fetch records that match the provided IDs and belong to the authenticated user
      const { data: existingRecords, error: fetchError } = await supabase
        .from('additional_income')
        .select('id, profile_id')
        .in('id', ids)
  
      if (fetchError || !existingRecords) {
        return NextResponse.json({ error: 'Records not found' }, { status: 404 })
      }
  
      // Filter records where the authenticated user owns the record
      const recordsToDelete = existingRecords.filter((record) => record.profile_id === user.id)
  
      if (recordsToDelete.length === 0) {
        return NextResponse.json({ error: 'Unauthorized to delete these records' }, { status: 403 })
      }
  
      // Extract IDs to delete
      const idsToDelete = recordsToDelete.map((record) => record.id)
  
      // Delete the records
      const { error: deleteError } = await supabase
        .from('additional_income')
        .delete()
        .in('id', idsToDelete)
  
      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }
  
      return NextResponse.json({ message: `${idsToDelete.length} records deleted successfully` })
    } catch (error) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }

  export async function POST(request: Request) {
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
  
      // Parse request body (expecting the fields: income_id, description, amount)
      const { income_id, description, amount } = await request.json()
  
      // Validate the required fields
      if (!income_id || !description || !amount) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }
  
      // Prepare data for insertion
      const newIncome = {
        income_id,
        description,
        amount,
        profile_id: user.id, // Associate the income with the user's profile_id
        created_at: new Date().toISOString(),
      }
  
      // Insert the new record into the 'additional_income' table
      const { data, error } = await supabase
        .from('additional_income')
        .insert([newIncome])
        .single()
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
  
      // Respond with the newly created record
      return NextResponse.json({ message: 'Income added successfully', income: data })
    } catch (error) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }
  