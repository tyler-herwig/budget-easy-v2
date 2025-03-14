import Dashboard from "@/components/Dashboard";
import PageWrapper from "@/components/PageWrapper";
import { ProfileProvider } from "@/context/ProfileContext";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <ProfileProvider user={user}>
      <PageWrapper title="Dashboard">
        <Dashboard />
      </PageWrapper>
    </ProfileProvider>
  );
}
