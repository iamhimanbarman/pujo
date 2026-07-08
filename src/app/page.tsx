import Link from "next/link"
import { Search, Map, Camera, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PujoCard } from "@/components/cards/PujoCard"
import { ImageGalleryCard } from "@/components/cards/ImageGalleryCard"

// Dummy data for visual presentation until Supabase is hooked up
const featuredPujos = [
  { id: "1", name: "Sreebhumi Sporting Club", slug: "sreebhumi", area: "Lake Town", district: "Kolkata", type: "Famous Pujo" },
  { id: "2", name: "Suruchi Sangha", slug: "suruchi-sangha", area: "New Alipore", district: "Kolkata", type: "Club Pujo" },
  { id: "3", name: "Sovabazar Rajbari", slug: "sovabazar-rajbari", area: "North Kolkata", district: "Kolkata", type: "Bonedi Bari" },
  { id: "4", name: "Ballygunge Cultural", slug: "ballygunge-cultural", area: "Ballygunge", district: "Kolkata", type: "Traditional" },
]

const recentImages = [
  { id: "1", url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", aspect: "portrait" },
  { id: "2", url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", aspect: "landscape" },
  { id: "3", url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", aspect: "square" },
  { id: "4", url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", aspect: "portrait" },
  { id: "5", url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", aspect: "square" },
  { id: "6", url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", aspect: "landscape" },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-[var(--hero-padding-top)] pb-[var(--hero-padding-bottom)] bg-[var(--background-hero)] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, var(--gold-400), transparent 40%)' }} />
        
        <div className="container relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-sm border border-white/40 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-red-700)] animate-pulse" />
            <span className="text-sm font-medium text-[var(--text-primary)]">Public Visual Directory</span>
          </div>

          <h1 className="hero-title text-[var(--text-brand)] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
            Experience the <br className="hidden sm:block" />
            <span className="text-[var(--text-gold)] festival-title">Divine Aura</span>
          </h1>

          <p className="hero-subtitle text-[var(--text-secondary)] mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            Explore thousands of Durga Pujos across West Bengal. Discover pandals, traditional Bonedi Bari pujos, and the vibrant culture of our biggest festival.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl bg-white p-2 rounded-2xl shadow-[var(--shadow-card-hover)] flex items-center gap-2 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-disabled)]" />
              <Input 
                type="text" 
                placeholder="Search by pujo name, area, or district..." 
                className="w-full pl-12 h-14 border-none shadow-none text-base bg-transparent focus-visible:ring-0"
              />
            </div>
            <Link href="/search">
              <Button variant="primary" className="h-12 px-8 rounded-xl text-base">
                Search
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Pujos Section */}
      <section className="section-lg bg-[var(--surface-primary)]">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-[var(--font-section-title)] font-display font-bold text-[var(--text-primary)] tracking-tight">
                Featured Pujos
              </h2>
              <p className="text-[var(--text-secondary)] font-medium">
                Iconic and historical celebrations across Bengal.
              </p>
            </div>
            <Link href="/search?type=famous" className="hidden sm:flex items-center gap-1 text-[var(--link-default)] font-semibold hover:text-[var(--link-hover)] transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--grid-gap-md)]">
            {featuredPujos.map(pujo => (
              <PujoCard key={pujo.id} {...pujo} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Uploads Section (Masonry Grid) */}
      <section className="section-lg bg-[var(--background-secondary)] border-y border-[var(--border-secondary)]">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-[var(--font-section-title)] font-display font-bold text-[var(--text-primary)] tracking-tight">
                Latest Captures
              </h2>
              <p className="text-[var(--text-secondary)] font-medium">
                Recently approved images submitted by our community.
              </p>
            </div>
          </div>

          {/* Simple CSS Columns for Masonry Effect */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-[var(--gallery-gap)] space-y-[var(--gallery-gap)]">
            {recentImages.map((img, i) => (
              <div key={i} className="break-inside-avoid">
                <ImageGalleryCard 
                  id={img.id}
                  url={img.url}
                  aspectRatio={img.aspect as "portrait" | "landscape" | "square"}
                />
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/gallery">
              <Button variant="outline" className="rounded-full px-8 h-12">
                Load More Images
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section-lg bg-[var(--background-festival)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--overlay-hero)] mix-blend-multiply" />
        <div className="container relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 mb-6 text-[var(--gold-300)]">
            <Camera className="w-8 h-8" />
          </div>
          <h2 className="text-[var(--font-section-title)] font-display font-bold text-white mb-4">
            Contribute to the Directory
          </h2>
          <p className="text-[var(--ivory-200)] max-w-2xl text-lg mb-8 leading-relaxed">
            Help us preserve the beauty of Durga Pujo. Upload photos of pandals, idols, and traditional bari pujos from your locality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/upload">
              <Button variant="secondary" className="h-14 px-8 rounded-full text-base font-bold shadow-[var(--shadow-lg)] w-full sm:w-auto hover:-translate-y-1 transition-transform">
                Submit an Image
              </Button>
            </Link>
            <Link href="/districts">
              <Button variant="outline" className="h-14 px-8 rounded-full text-base font-bold border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                <Map className="w-5 h-5 mr-2" />
                Browse Map
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
