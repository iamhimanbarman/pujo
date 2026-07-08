"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, MapPin, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { uploadImageToCloudinary } from "@/lib/cloudinary"
import { Spinner } from "@/components/ui/spinner"

const PUJO_TYPES = [
  "Pandal",
  "Temple",
  "Club Pujo",
  "Bonedi Bari",
  "Barowari Pujo",
  "Famous Pujo"
]

const WEST_BENGAL_DISTRICTS = [
  "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", 
  "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", 
  "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", 
  "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", 
  "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"
]

export default function UploadPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    district: "",
    area: "",
    address: "",
    year: new Date().getFullYear().toString(),
    description: ""
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(selected.type)) {
      toast.error("Please select a JPG, PNG, or WEBP image.")
      return
    }

    // Validate size (max 5MB)
    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.")
      return
    }

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      toast.error("Please select an image to upload.")
      return
    }

    if (!formData.name || !formData.type || !formData.district || !formData.area) {
      toast.error("Please fill in all required fields.")
      return
    }

    setIsLoading(true)

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("You must be logged in to upload.")

      // 2. Upload image to Cloudinary
      toast.loading("Uploading image...", { id: 'upload' })
      const { secure_url, public_id } = await uploadImageToCloudinary(file)

      // 3. Create database row with status = pending
      toast.loading("Saving submission...", { id: 'upload' })
      
      // Generate a basic slug
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6)

      const { error: dbError } = await supabase.rpc('submit_pujo_with_image', {
        p_name: formData.name,
        p_slug: slug,
        p_type: formData.type,
        p_district: formData.district,
        p_area: formData.area,
        p_address: formData.address,
        p_year: parseInt(formData.year),
        p_description: formData.description,
        p_image_url: secure_url,
        p_cloudinary_id: public_id,
        p_user_id: user.id
      })

      if (dbError) {
        // Fallback if RPC doesn't exist yet, we will just insert manually
        // We will insert into pujo_places then pujo_images
        const { data: place, error: placeError } = await supabase
          .from('pujo_places')
          .insert({
            name: formData.name,
            slug,
            type: formData.type,
            district: formData.district,
            area: formData.area,
            address: formData.address,
            year: parseInt(formData.year),
            description: formData.description,
            status: 'pending',
            submitted_by: user.id
          })
          .select()
          .single()

        if (placeError) throw placeError

        const { error: imageError } = await supabase
          .from('pujo_images')
          .insert({
            place_id: place.id,
            url: secure_url,
            cloudinary_id: public_id,
            status: 'pending',
            submitted_by: user.id
          })

        if (imageError) throw imageError
      }

      toast.success("Your image has been submitted for review.", { id: 'upload' })
      router.push('/dashboard') // Redirect to user's dashboard (to be created)
      
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "An error occurred during submission.", { id: 'upload' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-10 text-center">
        <h1 className="font-display text-[var(--heading-2)] font-bold text-[var(--text-brand)] mb-2">
          Contribute to the Directory
        </h1>
        <p className="text-[var(--text-secondary)]">
          Submit photos of pujos, pandals, and idols. All submissions are reviewed by admins before appearing publicly.
        </p>
      </div>

      <Card className="border-[var(--card-border)] bg-[var(--surface-primary)] shadow-[var(--shadow-card)]">
        <CardContent className="p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* Image Upload Zone */}
            <div className="flex flex-col gap-3">
              <label className="text-[var(--label-lg)] font-semibold text-[var(--text-primary)]">
                Pujo Image <span className="text-[var(--text-error)]">*</span>
              </label>
              
              {!preview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="upload-zone flex flex-col items-center justify-center p-12 rounded-xl cursor-pointer text-[var(--text-disabled)]"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center mb-4 text-[var(--text-brand)]">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <p className="font-medium text-[var(--text-primary)] mb-1">Click to upload image</p>
                  <p className="text-sm">JPG, PNG, WEBP (Max 5MB)</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-[var(--border-secondary)] bg-black/5 aspect-[4/3] sm:aspect-video flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
                  <Button 
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-4 right-4 rounded-full shadow-lg"
                    onClick={clearFile}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
              />
            </div>

            <hr className="divider" />

            {/* Pujo Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[var(--label-md)] font-medium text-[var(--text-secondary)]">Pujo / Temple Name *</label>
                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Suruchi Sangha" required />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[var(--label-md)] font-medium text-[var(--text-secondary)]">Type *</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleInputChange} 
                  className="input-border w-full rounded-[var(--radius-md)] bg-[var(--input-bg)] px-[var(--input-padding-x)] py-[var(--input-padding-y)] h-[var(--input-height)] text-[var(--input-text)] outline-none"
                  required
                >
                  <option value="" disabled>Select Type</option>
                  {PUJO_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[var(--label-md)] font-medium text-[var(--text-secondary)]">District *</label>
                <select 
                  name="district" 
                  value={formData.district} 
                  onChange={handleInputChange} 
                  className="input-border w-full rounded-[var(--radius-md)] bg-[var(--input-bg)] px-[var(--input-padding-x)] py-[var(--input-padding-y)] h-[var(--input-height)] text-[var(--input-text)] outline-none"
                  required
                >
                  <option value="" disabled>Select District</option>
                  {WEST_BENGAL_DISTRICTS.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[var(--label-md)] font-medium text-[var(--text-secondary)]">Local Area *</label>
                <Input name="area" value={formData.area} onChange={handleInputChange} placeholder="e.g. New Alipore" required />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[var(--label-md)] font-medium text-[var(--text-secondary)]">Full Address</label>
                <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="Complete address for maps..." />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[var(--label-md)] font-medium text-[var(--text-secondary)]">Description (Optional)</label>
                <Textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Share details about the theme, history, or what makes this pujo special..." 
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[var(--label-md)] font-medium text-[var(--text-secondary)]">Year</label>
                <Input name="year" type="number" value={formData.year} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="flex items-center justify-end mt-4 pt-6 border-t border-[var(--border-secondary)]">
              <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto px-10 gap-2" disabled={isLoading || !file}>
                {isLoading ? <Spinner size="sm" className="text-white" /> : <Upload className="w-5 h-5" />}
                Submit for Review
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
