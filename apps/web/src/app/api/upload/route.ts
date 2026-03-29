import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/upload
 * Upload bottle photos to Supabase Storage
 * Body: FormData with 'files' (multiple) and 'org_id'
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const org_id = formData.get('org_id') as string;
    const bottle_id = formData.get('bottle_id') as string | null;

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (!org_id) {
      return NextResponse.json({ error: 'org_id required' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];
    const client = supabase();

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${org_id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      const { data, error } = await client.storage
        .from('bottle-photos')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        continue;
      }

      const { data: urlData } = client.storage
        .from('bottle-photos')
        .getPublicUrl(data.path);

      uploadedUrls.push(urlData.publicUrl);
    }

    // Update bottle record with photos if bottle_id provided
    if (bottle_id && uploadedUrls.length > 0) {
      const { data: existing } = await client
        .from('bottles')
        .select('photos')
        .eq('id', bottle_id)
        .single();

      const existingPhotos = existing?.photos || [];
      const allPhotos = [...existingPhotos, ...uploadedUrls];

      await client
        .from('bottles')
        .update({
          photos: allPhotos,
          primary_photo: allPhotos[0],
        })
        .eq('id', bottle_id);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
