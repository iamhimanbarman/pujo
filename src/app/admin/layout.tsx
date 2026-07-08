import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen bg-[var(--background-secondary)]">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[var(--surface-primary)] border-r border-[var(--border-secondary)] flex flex-col hidden md:flex">
        <div className="p-6 border-b border-[var(--border-secondary)]">
          <h2 className="font-display font-bold text-xl text-[var(--text-brand)]">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <a href="/admin" className="px-4 py-2 rounded-md bg-[var(--surface-hover)] text-[var(--text-primary)] font-medium">
            Review Queue
          </a>
          <a href="/admin/places" className="px-4 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] font-medium">
            Manage Places
          </a>
          <a href="/admin/reports" className="px-4 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] font-medium">
            User Reports
          </a>
        </nav>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-[var(--surface-primary)] border-b border-[var(--border-secondary)] flex items-center px-6">
          <h1 className="font-semibold text-[var(--text-primary)]">Moderation Dashboard</h1>
        </header>
        <div className="p-6 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
