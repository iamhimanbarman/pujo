import { Metadata, ResolvingMetadata } from 'next'
import { MapPin, Calendar, Camera } from "lucide-react"
import { createClient } from '@/lib/supabase/server'
import { ImageGalleryCard } from '@/components/cards/ImageGalleryCard'
import { Button } from '@/components/ui/button'

type Props = {
  params: Promise<{ slug: string }>
}

// Dynamic SEO Metadata Generation
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: pujo } = await supabase
    .from('pujo_places')
    .select('name, area, district, description, pujo_images(url)')
    .eq('slug', slug)
    .single()
    
  if (!pujo) {
    return { title: 'Pujo Not Found | Sharod Darshan' }
  }

  const ogImage = pujo.pujo_images?.[0]?.url || ''

  return {
    title: `${pujo.name} - ${pujo.area} | Sharod Darshan`,
    description: pujo.description || `Explore photos and details of ${pujo.name} in ${pujo.area}, ${pujo.district}.`,
    openGraph: {
      title: `${pujo.name} | Sharod Darshan`,
      description: pujo.description || `Discover ${pujo.name}`,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function PujoDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: pujo, error } = await supabase
    .from('pujo_places')
    .select(`
      *,
      pujo_images (id, url, status)
    `)
    .eq('slug', slug)
    .single()

  if (error || !pujo) {
    return (
      <div className="container py-24 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Pujo Not Found</h1>
        <p className="text-[var(--text-secondary)]">The pujo you are looking for does not exist or has not been approved yet.</p>
      </div>
    )
  }

  const approvedImages = pujo.pujo_images?.filter((img: any) => img.status === 'approved') || []

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section className="bg-[var(--surface-secondary)] border-b border-[var(--border-secondary)] pt-12 pb-8">
        <div className="container flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-3 py-1 bg-[var(--badge-famous-bg)] text-[var(--badge-famous-text)] rounded-full text-xs font-bold tracking-wider uppercase">
                {pujo.type}
              </span>
            </div>
            <h1 className="text-[var(--font-page-title)] font-display font-bold text-[var(--text-primary)] leading-tight">
              {pujo.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[var(--text-secondary)] font-medium text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {pujo.address ? pujo.address : `${pujo.area}, ${pujo.district}`}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Year: {pujo.year}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
            <Button variant="outline" className="flex-1 md:flex-none">Share</Button>
            <Button variant="upload" className="flex-1 md:flex-none gap-2">
              <Camera className="w-4 h-4" /> Add Photo
            </Button>
          </div>
        </div>
      </section>

      {/* Description & Gallery */}
      <section className="section-md">
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 flex flex-col gap-8">
            {pujo.description && (
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <h2 className="text-xl font-bold font-heading mb-4 text-[var(--text-primary)]">About this Pujo</h2>
                <p className="text-[var(--text-secondary)] leading-relaxed">{pujo.description}</p>
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold font-heading mb-6 text-[var(--text-primary)]">Image Gallery</h2>
              
              {approvedImages.length > 0 ? (
                <div className="columns-1 sm:columns-2 gap-[var(--gallery-gap)] space-y-[var(--gallery-gap)]">
                  {approvedImages.map((img: any) => (
                    <div key={img.id} className="break-inside-avoid">
                      <ImageGalleryCard id={img.id} url={img.url} aspectRatio="portrait" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-xl p-12 text-center flex flex-col items-center">
                  <Camera className="w-12 h-12 text-[var(--text-disabled)] mb-4" />
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">No photos yet</h3>
                  <p className="text-[var(--text-secondary)] mb-6">Be the first to share a photo of this pujo.</p>
                  <Button variant="primary">Upload Photo</Button>
                </div>
              )}
            </div>
          </div>

          {/* Map/Sidebar Sidebar */}
          <aside className="flex flex-col gap-6">
            <div className="bg-[var(--surface-primary)] border border-[var(--card-border)] shadow-[var(--shadow-card)] rounded-xl overflow-hidden">
              <div className="aspect-video bg-stone-200 dark:bg-stone-800 flex items-center justify-center relative">
                {/* Dummy Map Placeholder */}
                <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cartographer.png")' }}></div>
                <MapPin className="w-8 h-8 text-[var(--brand-red-700)] relative z-10" />
              </div>
              <div className="p-5 flex flex-col gap-2">
                <h3 className="font-bold text-[var(--text-primary)]">Location Map</h3>
                <p className="text-sm text-[var(--text-secondary)]">{pujo.area}, {pujo.district}, West Bengal</p>
                <Button variant="outline" className="w-full mt-2">Get Directions</Button>
              </div>
            </div>
          </aside>

        </div>
      </section>

    </div>
  )
}
