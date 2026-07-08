"use client"

import { useState } from "react"
import { Search as SearchIcon, Filter, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PujoCard } from "@/components/cards/PujoCard"

// Dummy data for visual presentation until Supabase is hooked up
const searchResults = [
  { id: "1", name: "Sreebhumi Sporting Club", slug: "sreebhumi", area: "Lake Town", district: "Kolkata", type: "Famous Pujo" },
  { id: "2", name: "Suruchi Sangha", slug: "suruchi-sangha", area: "New Alipore", district: "Kolkata", type: "Club Pujo" },
  { id: "3", name: "Sovabazar Rajbari", slug: "sovabazar-rajbari", area: "North Kolkata", district: "Kolkata", type: "Bonedi Bari" },
  { id: "4", name: "Ballygunge Cultural", slug: "ballygunge-cultural", area: "Ballygunge", district: "Kolkata", type: "Traditional" },
  { id: "5", name: "Maddox Square", slug: "maddox-square", area: "Ballygunge", district: "Kolkata", type: "Famous Pujo" },
  { id: "6", name: "Mudiali Club", slug: "mudiali", area: "Tollygunge", district: "Kolkata", type: "Club Pujo" },
]

const PUJO_TYPES = [
  "Bonedi Bari",
  "Club Pujo",
  "Famous Pujo",
  "Traditional",
  "Barowari Pujo",
  "Theme Pujo",
  "Housing Society",
  "Temple",
  "Ekchala",
  "Sabeki"
]

const WB_LOCATIONS = [
  "Alipurduar", "Asansol", "Baharampur", "Balurghat", "Bankura", "Barasat", 
  "Bardhaman", "Barrackpore", "Baruipur", "Basirhat", "Bidhannagar (Salt Lake)", 
  "Birbhum", "Bishnupur", "Bongaon", "Canning", "Chandannagar", "Chinsurah", 
  "Contai", "Cooch Behar", "Darjeeling", "Diamond Harbour", "Digha", 
  "Dinhata", "Durgapur", "Haldia", "Haldibari", "Hooghly", "Howrah", 
  "Islampur", "Jalpaiguri", "Jhargram", "Kakdwip", "Kalimpong", "Kalna", 
  "Kalyani", "Katwa", "Kharagpur", "Kolkata", "Krishnanagar", "Kurseong", 
  "Malda", "Mathabhanga", "Medinipur", "Mekhliganj", "Mirik", "Murshidabad", 
  "Nabadwip", "Nadia", "New Town", "North 24 Parganas", "Purulia", 
  "Raiganj", "Rampurhat", "Ranaghat", "Serampore", "Siliguri", 
  "South 24 Parganas", "Suri", "Tamluk", "Tufanganj"
]

export default function SearchPage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const FiltersContent = () => (
    <>
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Pujo Type</h3>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {PUJO_TYPES.map(type => (
            <label key={type} className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors">
              <input type="checkbox" value={type} className="rounded border-[var(--border-strong)] text-[var(--brand-red-700)] focus:ring-[var(--brand-red-700)] w-4 h-4" />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">City / Town / District</h3>
        
        {/* Simple inline search for locations so user doesn't have to scroll all 60+ */}
        <Input 
          placeholder="Find city..." 
          className="h-8 text-sm mb-1 bg-[var(--surface-secondary)]" 
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
        
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar border border-[var(--border-secondary)] rounded-md p-2">
          {WB_LOCATIONS.filter(loc => loc.toLowerCase().includes(searchQuery)).map(loc => (
            <label key={loc} className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors">
              <input type="checkbox" value={loc} className="rounded border-[var(--border-strong)] text-[var(--brand-red-700)] focus:ring-[var(--brand-red-700)] w-4 h-4" />
              {loc}
            </label>
          ))}
          {WB_LOCATIONS.filter(loc => loc.toLowerCase().includes(searchQuery)).length === 0 && (
            <span className="text-xs text-[var(--text-tertiary)] italic">No locations found</span>
          )}
        </div>
      </div>
    </>
  )

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-primary)]">
      
      {/* Search Header */}
      <section className="bg-[var(--surface-secondary)] border-b border-[var(--border-secondary)] pt-8 md:pt-12 pb-6 md:pb-8">
        <div className="container">
          <h1 className="text-3xl md:text-[var(--font-page-title)] font-display font-bold text-[var(--text-primary)] mb-6">
            Search Directory
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-disabled)]" />
              <Input 
                type="text" 
                placeholder="Search by pujo name, area, district, or address..." 
                className="w-full pl-11 h-12 bg-[var(--surface-primary)] shadow-sm text-base"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="h-12 px-6 gap-2 bg-[var(--surface-primary)] flex-1 sm:flex-none md:hidden"
                onClick={() => setIsFiltersOpen(true)}
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Button variant="primary" className="h-12 px-8 flex-1 sm:flex-none">
                Search
              </Button>
            </div>
          </div>
          
          {/* Quick Filters */}
          <div className="flex overflow-x-auto pb-2 -mb-2 sm:flex-wrap items-center gap-2 mt-6 no-scrollbar">
            <span className="text-sm text-[var(--text-tertiary)] font-medium mr-2 shrink-0">Quick filters:</span>
            <Button variant="ghost" size="sm" className="rounded-full bg-[var(--surface-primary)] border border-[var(--border-secondary)] shrink-0">Bonedi Bari</Button>
            <Button variant="ghost" size="sm" className="rounded-full bg-[var(--surface-primary)] border border-[var(--border-secondary)] shrink-0">Famous Pujo</Button>
            <Button variant="ghost" size="sm" className="rounded-full bg-[var(--surface-primary)] border border-[var(--border-secondary)] shrink-0">Kolkata</Button>
            <Button variant="ghost" size="sm" className="rounded-full bg-[var(--surface-primary)] border border-[var(--border-secondary)] shrink-0">Howrah</Button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="section-md flex-1">
        <div className="container flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden md:flex flex-col w-64 shrink-0 gap-8">
            <div className="flex items-center gap-2 font-heading font-semibold text-[var(--text-primary)] mb-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filter By
            </div>
            <FiltersContent />
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-[var(--text-secondary)] font-medium">
                Found <span className="text-[var(--text-primary)] font-bold">{searchResults.length}</span> results
              </p>
              
              <select className="input-border rounded-lg bg-[var(--surface-primary)] px-3 py-1.5 text-sm text-[var(--text-secondary)] outline-none cursor-pointer w-full sm:w-auto">
                <option>Sort by: Popularity</option>
                <option>Sort by: Name (A-Z)</option>
                <option>Sort by: Newest</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[var(--grid-gap-md)]">
              {searchResults.map(pujo => (
                <PujoCard key={pujo.id} {...pujo} />
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center mt-12">
              <Button variant="outline" className="rounded-full px-8">
                Load More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Modal */}
      {isFiltersOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFiltersOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-[var(--surface-primary)] shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 font-heading font-bold text-lg text-[var(--text-primary)]">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsFiltersOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex flex-col gap-8 flex-1">
              <FiltersContent />
            </div>
            
            <div className="pt-6 mt-6 border-t border-[var(--border-secondary)] flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setIsFiltersOpen(false)}>Clear</Button>
              <Button variant="primary" className="flex-1" onClick={() => setIsFiltersOpen(false)}>Apply</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
