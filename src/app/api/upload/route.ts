import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { supabase } from '@/lib/supabase';

// Since this is a public API for unauthenticated uploads (if allowed) or authenticated,
// we'll handle the request. In a real app we might check the auth token.
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const district = formData.get('district') as string;
    const area = formData.get('area') as string;
    const address = formData.get('address') as string;
    const year = formData.get('year') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // 1. Upload to Cloudinary
    const cloudinaryResult: any = await uploadImage(image);
    
    const imageUrl = cloudinaryResult.secure_url;
    const publicId = cloudinaryResult.public_id;

    // Generate a simple slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    // 2. Insert into Supabase - pujo_places
    const { data: placeData, error: placeError } = await supabase
      .from('pujo_places')
      .insert([
        {
          name,
          slug,
          type,
          area,
          district,
          address,
          description,
          year: year ? parseInt(year) : null,
          status: 'pending', // Requires admin approval
          // submitter_id: we would set this if user is logged in
        }
      ])
      .select('id')
      .single();

    if (placeError) {
      console.error('Supabase Place Error:', placeError);
      return NextResponse.json({ error: 'Failed to save place details' }, { status: 500 });
    }

    // 3. Insert into Supabase - pujo_images
    const { error: imageError } = await supabase
      .from('pujo_images')
      .insert([
        {
          pujo_place_id: placeData.id,
          cloudinary_url: imageUrl,
          cloudinary_public_id: publicId,
          status: 'pending',
        }
      ]);

    if (imageError) {
      console.error('Supabase Image Error:', imageError);
      return NextResponse.json({ error: 'Failed to save image details' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Uploaded successfully and pending review.' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
