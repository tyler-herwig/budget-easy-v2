import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing expense ID" },
        { status: 400 }
      );
    }

    // Check if the record belongs to the authenticated user
    const { data: existingRecord, error: fetchError } = await supabase
      .from("expenses")
      .select("id, profile_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingRecord) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    if (existingRecord.profile_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the record
    const { error: deleteError } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing expense ID" },
        { status: 400 }
      );
    }

    // Parse request body
    const requestBody = await request.json();
    const { expense_name, amount, date_due, date_paid, autopay } = requestBody;

    if (expense_name === undefined && date_due === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the record belongs to the authenticated user
    const { data: existingRecord, error: fetchError } = await supabase
      .from("expenses")
      .select("id, profile_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingRecord) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    if (existingRecord.profile_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Prepare update object
    const updateData: {
      expense_name: string;
      amount?: number;
      date_due: string;
      date_paid?: string;
      autopay?: boolean;
    } = {
      expense_name: expense_name,
      date_due: date_due,
    };

    if (amount !== undefined) updateData.amount = amount;
    if (date_paid !== undefined) updateData.date_paid = date_paid;
    if (autopay !== undefined) updateData.autopay = autopay;

    // Update the record
    const { error: updateError } = await supabase
      .from("expenses")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Record updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
