import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { parseISO } from "date-fns";

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
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Parse query parameters for start_date and end_date
    const url = new URL(request.url);
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");

    // Build the query to filter expenses by date range
    let query = supabase
      .from("expenses")
      .select("*")
      .eq("profile_id", user.id)
      .order("date_due", { ascending: true })
      .order("amount", { ascending: false });

    if (startDate) {
      // Parse and convert the start date to UTC
      const parsedStartDate = parseISO(startDate).toISOString();
      query = query.gte("date_due", parsedStartDate); // Filter expenses where date_due is greater than or equal to start_date
    }

    if (endDate) {
      // Parse and convert the end date to UTC
      const parsedEndDate = parseISO(endDate).toISOString();
      query = query.lte("date_due", parsedEndDate); // Filter expenses where date_due is less than or equal to end_date
    }

    // Fetch expenses for the authenticated user's profile_id within the date range
    const { data: expenses, error } = await query;

    // Handle any errors from the database query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the filtered expenses data
    return NextResponse.json(expenses);
  } catch (error) {
    console.error(error); 
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = await createClient();

    // Parse the request body
    const { expenses } = await request.json();

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If no user is authenticated, return an error
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const profileId = user.id;

    // Map expenses to match the database structure
    const expensesToInsert = expenses.map((expense: any) => ({
      profile_id: profileId,
      expense_name: expense.expense_name,
      expense_description: expense.expense_description || null,
      amount: expense.amount,
      date_due: expense.formatted_date,
      autopay: expense.autopay || false,
      status: "pending",
    }));

    // Insert the expenses
    const { data, error } = await supabase
      .from("expenses")
      .insert(expensesToInsert);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Expenses inserted successfully",
      data,
    });
  } catch (error) {
    console.error(error); 
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Parse request body (expecting an array of IDs directly)
    const ids: string[] = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No IDs provided or invalid format" },
        { status: 400 }
      );
    }

    // Fetch records that match the provided IDs and belong to the authenticated user
    const { data: existingRecords, error: fetchError } = await supabase
      .from("expenses")
      .select("id, profile_id")
      .in("id", ids);

    if (fetchError || !existingRecords) {
      return NextResponse.json({ error: "Records not found" }, { status: 404 });
    }

    // Filter records where the authenticated user owns the record
    const recordsToDelete = existingRecords.filter(
      (record) => record.profile_id === user.id
    );

    if (recordsToDelete.length === 0) {
      return NextResponse.json(
        { error: "Unauthorized to delete these records" },
        { status: 403 }
      );
    }

    // Extract IDs to delete
    const idsToDelete = recordsToDelete.map((record) => record.id);

    // Delete the records
    const { error: deleteError } = await supabase
      .from("expenses")
      .delete()
      .in("id", idsToDelete);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `${idsToDelete.length} records deleted successfully`,
    });
  } catch (error) {
    console.error(error); 
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
