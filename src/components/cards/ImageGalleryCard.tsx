"use client"

import Image from "next/image"
import { Maximize2 } from "lucide-react"

export interface ImageGalleryCardProps {
  id: string
  url: string
  alt?: string
  aspectRatio?: "square" | "portrait" | "landscape"
  onClick?: () => void
}

export function ImageGalleryCard({ id, url, alt = "Pujo Image", aspectRatio = "portrait", onClick }: ImageGalleryCardProps) {
  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]"
  }

  return (
    <div 
      className={`group relative overflow-hidden rounded-[var(--gallery-radius)] border border-[var(--gallery-border)] bg-[var(--gallery-background)] cursor-pointer ${aspectClasses[aspectRatio]}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <Image
        src={url}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Interaction Icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
        <Maximize2 className="w-5 h-5" />
      </div>
    </div>
  )
}
