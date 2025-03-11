import { NextRequest as Request, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const id = (await params).id;

  if (!id) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Fetch profile data from 'profiles' table
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, username, website, avatar_url")
    .eq("id", id)
    .single();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // Calculate total income (income + additional_income) for current YTD
  const { data: incomeData, error: incomeError } = await supabase
    .from("income") // The 'income' table
    .select("amount")
    .eq("profile_id", id)
    .gte("date_received", `${currentYear}-01-01`); // Filter by current year

  if (incomeError) {
    return NextResponse.json({ error: incomeError.message }, { status: 500 });
  }

  // Sum up the income
  const totalIncome = incomeData.reduce((acc, row) => acc + row.amount, 0);

  // Fetch additional income for current YTD
  const { data: additionalIncomeData, error: additionalIncomeError } =
    await supabase
      .from("additional_income") // The 'additional_income' table
      .select("amount")
      .eq("profile_id", id)
      .gte("created_at", `${currentYear}-01-01`); // Filter by current year

  if (additionalIncomeError) {
    return NextResponse.json(
      { error: additionalIncomeError.message },
      { status: 500 }
    );
  }

  // Sum up the additional income
  const totalAdditionalIncome = additionalIncomeData.reduce(
    (acc, row) => acc + row.amount,
    0
  );

  // Calculate total income (income + additional_income)
  const total_income = totalIncome + totalAdditionalIncome;

  // Calculate total expenses for current YTD
  const { data: expensesData, error: expensesError } = await supabase
    .from("expenses") // The 'expenses' table
    .select("amount")
    .eq("profile_id", id)
    .gte("date_due", `${currentYear}-01-01`); // Filter by current year

  if (expensesError) {
    return NextResponse.json({ error: expensesError.message }, { status: 500 });
  }

  // Sum up the expenses
  const total_expenses = expensesData.reduce((acc, row) => acc + row.amount, 0);

  // Construct the final response with profile and calculated totals
  const responseData = {
    ...profileData,
    total_income,
    total_expenses,
  };

  return NextResponse.json(responseData, { status: 200 });
}
