import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.log('EMPTY');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Convert file to a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('newsimage')
      .upload(filePath, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.log('Upload error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicURL } = supabase.storage
      .from('newsimage')
      .getPublicUrl(filePath);

    console.log('Upload successful:', publicURL.publicUrl);
    return NextResponse.json({ imageUrl: publicURL.publicUrl });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
