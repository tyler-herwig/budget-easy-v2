import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    // Get the additional_income ID from the route parameters
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Missing additional_income ID' }, { status: 400 })
    }

    // Check if the record belongs to the authenticated user
    const { data: existingRecord, error: fetchError } = await supabase
      .from('additional_income')
      .select('id, profile_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingRecord) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }

    if (existingRecord.profile_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete the record
    const { error: deleteError } = await supabase
      .from('additional_income')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Record deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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

    // Get the additional_income ID from the route parameters
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Missing additional_income ID' }, { status: 400 })
    }

    // Parse request body
    const requestBody = await request.json()
    const { description, amount } = requestBody

    if (description === undefined && amount === undefined) {
      return NextResponse.json({ error: 'At least one field (description or amount) is required' }, { status: 400 })
    }

    // Check if the record belongs to the authenticated user
    const { data: existingRecord, error: fetchError } = await supabase
      .from('additional_income')
      .select('id, profile_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingRecord) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }

    if (existingRecord.profile_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Prepare update object
    const updateData: { description?: string; amount?: number } = {}
    if (description !== undefined) updateData.description = description
    if (amount !== undefined) updateData.amount = amount

    // Update the record
    const { error: updateError } = await supabase
      .from('additional_income')
      .update(updateData)
      .eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Record updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}