"use client"

import { useState } from "react"
import Image from "next/image"
import logo from "@/assets/logo.jpg"
import Link from "next/link"
import { Search, Plus, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--navbar-border)] bg-[var(--navbar-bg)] backdrop-blur-md transition-all shadow-[var(--shadow-navbar)]">
      <div className="container h-[var(--navbar-height)] flex items-center justify-between px-[var(--navbar-padding)]">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 outline-none focus-visible:ring-3 focus-visible:ring-brand rounded-md">
          <Image src={logo} alt="Sharod Darshan Logo" width={40} height={40} className="rounded-full object-cover shadow-sm border border-[var(--border-secondary)]" />
          <span className="font-display font-bold text-2xl md:text-3xl tracking-tight text-[var(--text-brand)]">
            Sharod<span className="text-[var(--text-gold)]">Darshan</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-[var(--navbar-link)] hover:text-[var(--navbar-link-hover)] text-[var(--font-navbar)] font-medium transition-colors">
            Home
          </Link>
          <Link href="/search" className="text-[var(--navbar-link)] hover:text-[var(--navbar-link-hover)] text-[var(--font-navbar)] font-medium transition-colors">
            Search
          </Link>
          <Link href="/districts" className="text-[var(--navbar-link)] hover:text-[var(--navbar-link-hover)] text-[var(--font-navbar)] font-medium transition-colors">
            Districts
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/search" className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="w-5 h-5" />
            </Button>
          </Link>
          
          <Link href="/search" className="hidden md:flex">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="w-5 h-5" />
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="outline" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>

          <Link href="/upload">
            <Button variant="upload" className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline-block">Upload Image</span>
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden ml-1" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-[var(--navbar-height)] left-0 w-full bg-[var(--surface-primary)] border-b border-[var(--border-secondary)] shadow-lg flex flex-col md:hidden py-4 px-6 gap-4 animate-in slide-in-from-top-2">
          <Link 
            href="/" 
            className="text-[var(--text-primary)] font-medium py-2 border-b border-[var(--border-secondary)]"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/search" 
            className="text-[var(--text-primary)] font-medium py-2 border-b border-[var(--border-secondary)]"
            onClick={() => setIsMenuOpen(false)}
          >
            Search Directory
          </Link>
          <Link 
            href="/districts" 
            className="text-[var(--text-primary)] font-medium py-2 border-b border-[var(--border-secondary)]"
            onClick={() => setIsMenuOpen(false)}
          >
            Browse Districts
          </Link>
          <Link 
            href="/login" 
            className="text-[var(--text-primary)] font-medium py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign In / Admin
          </Link>
        </div>
      )}
    </header>
  )
}
