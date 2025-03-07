import { redirect } from "next/navigation";
import AccountForm from "./account-form";
import { createClient } from "@/utils/supabase/server";
import { ProfileProvider } from "@/context/ProfileContext";
import PageWrapper from "@/components/PageWrapper";

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <ProfileProvider user={user}>
      <PageWrapper title="Profile" children={<AccountForm user={user} />} />
    </ProfileProvider>
  );
}
