# Sharod Darshan - West Bengal Durga Pujo Directory

A premium, public visual directory for Durga Pujo across West Bengal, built with Next.js, Supabase, and Cloudinary.

## Features

- **Public Directory:** Browse Durga Pujos, pandals, temples, and bonedi bari across West Bengal.
- **Search & Filter:** Find pujos by name, area, district, or type.
- **Image Submissions:** Authenticated users can upload their own photos for review.
- **Admin Moderation:** Dedicated admin dashboard to approve, reject, or edit submissions.
- **Premium UI:** Built with Tailwind CSS and shadcn/ui for a clean, emotional, and festive design.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security)
- **Image Hosting:** Cloudinary

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd sharod-darshan
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Database Setup:**
   - Go to your Supabase dashboard.
   - Open the SQL Editor.
   - Run the SQL script located in `supabase/schema.sql` to create all tables and RLS policies.

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Vercel Deployment Instructions

1. **Push your code to a GitHub repository.**
2. **Go to [Vercel](https://vercel.com/) and create a new project.**
3. **Import your GitHub repository.**
4. **Configure Environment Variables:**
   In the Vercel dashboard for your project, go to Settings -> Environment Variables. Add the following variables exactly as they are in your `.env.local` file:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. **Deploy:** Vercel will automatically detect that it's a Next.js project. Click "Deploy".
6. **Post-Deployment:** Ensure that your Supabase Auth is configured to accept redirects from your new Vercel production URL. Go to Supabase -> Authentication -> URL Configuration, and add your Vercel domain to the "Site URL" and "Redirect URLs".

## Security & Architecture Notes
- All database interactions from the client are protected by Supabase Row Level Security (RLS).
- The `service_role` key is never exposed to the frontend.
- Images are optimized using Cloudinary and Next.js Image component (where applicable).
