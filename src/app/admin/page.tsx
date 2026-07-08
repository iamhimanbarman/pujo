import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Edit } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createClient()

  // Fetch pending images with their associated places
  const { data: pendingImages, error } = await supabase
    .from('pujo_images')
    .select(`
      id, url, status, created_at,
      pujo_places ( id, name, area, district, type )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="text-[var(--text-error)]">Error loading pending submissions.</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Review Queue</h2>
          <p className="text-[var(--text-secondary)]">You have {pendingImages?.length || 0} pending submissions to review.</p>
        </div>
      </div>

      {pendingImages?.length === 0 ? (
        <Card className="bg-[var(--surface-primary)] border-[var(--border-secondary)] text-center p-12">
          <p className="text-[var(--text-secondary)]">No pending submissions. You're all caught up!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pendingImages?.map((item: any) => (
            <Card key={item.id} className="overflow-hidden bg-[var(--surface-primary)] border-[var(--card-border)] shadow-[var(--shadow-card)]">
              <div className="aspect-[4/3] relative bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="Pending Pujo" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider shadow-sm">
                  Pending
                </div>
              </div>
              <CardContent className="p-5 flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-lg text-[var(--text-primary)] line-clamp-1">{item.pujo_places.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{item.pujo_places.area}, {item.pujo_places.district}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1 font-medium">{item.pujo_places.type}</p>
                </div>
                
                <div className="flex items-center gap-2 mt-2 pt-4 border-t border-[var(--border-secondary)]">
                  <form action={async () => {
                    'use server'
                    const supabaseServer = await createClient()
                    await supabaseServer.from('pujo_images').update({ status: 'approved' }).eq('id', item.id)
                    await supabaseServer.from('pujo_places').update({ status: 'approved' }).eq('id', item.pujo_places.id)
                  }}>
                    <Button type="submit" variant="success" size="sm" className="w-full gap-1">
                      <Check className="w-4 h-4" /> Approve
                    </Button>
                  </form>
                  <form action={async () => {
                    'use server'
                    const supabaseServer = await createClient()
                    await supabaseServer.from('pujo_images').update({ status: 'rejected' }).eq('id', item.id)
                  }}>
                    <Button type="submit" variant="danger" size="sm" className="w-full gap-1">
                      <X className="w-4 h-4" /> Reject
                    </Button>
                  </form>
                  <Button variant="outline" size="sm" className="px-3" title="Edit Place Details">
                    <Edit className="w-4 h-4 text-[var(--text-secondary)]" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
