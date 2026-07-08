import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
export interface PujoCardProps {
  id: string
  name: string
  slug: string
  area: string
  district: string
  type: string
  imageUrl?: string
  status?: string
}

export function PujoCard({ id, name, slug, area, district, type, imageUrl }: PujoCardProps) {
  // Map type to our design system badges
  const getBadgeClass = (pujoType: string) => {
    switch (pujoType.toLowerCase()) {
      case "bonedi bari":
      case "traditional":
        return "bg-[var(--badge-traditional-bg)] text-[var(--badge-traditional-text)] border-none"
      case "famous pujo":
      case "famous":
        return "bg-[var(--badge-famous-bg)] text-[var(--badge-famous-text)] border-none"
      case "new":
        return "bg-[var(--badge-new-bg)] text-[var(--badge-new-text)] border-none"
      default:
        return "bg-[var(--brand-red-50)] text-[var(--brand-red-700)] border-none"
    }
  }

  return (
    <Link href={`/pujo/${slug}`} className="block h-full outline-none focus-visible:ring-3 focus-visible:ring-brand rounded-[var(--radius-xl)]">
      <Card className="h-full flex flex-col group/pujocard border-[var(--card-border)] overflow-hidden cursor-pointer transition-all duration-300">
        
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-secondary)]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover/pujocard:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--text-disabled)]">
              <span className="font-bengali opacity-50 text-4xl">দুর্গা</span>
            </div>
          )}
          
          {/* Overlay Gradient (Hover) */}
          <div className="absolute inset-0 bg-[var(--gradient-gallery-hover)] opacity-0 transition-opacity duration-300 group-hover/pujocard:opacity-100 mix-blend-overlay" />
          
          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[var(--badge-size)] font-medium ${getBadgeClass(type)} shadow-sm`}>
              {type}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="flex flex-col flex-1 p-5 gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="card-title text-[var(--card-title)] font-bengali leading-snug line-clamp-2">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 text-[var(--card-meta-size)] text-[var(--text-secondary)] font-medium mt-1">
              <MapPin className="w-3.5 h-3.5 opacity-70" />
              <span className="line-clamp-1">{area}, {district}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
