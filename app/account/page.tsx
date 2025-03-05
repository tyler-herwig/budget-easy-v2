import { redirect } from 'next/navigation'
import AccountForm from './account-form'
import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import { ProfileProvider } from '@/context/ProfileContext'

export default async function Account() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
        redirect('/login')
  }

  return (
    <ProfileProvider user={user}>
      <Header />
      <AccountForm user={user} />
    </ProfileProvider>
  )

}