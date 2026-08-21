import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { CONTENTFUL_CACHE_TAG } from '@/lib/contentful/config';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);

  const secret =
    searchParams.get('secret') ?? request.headers.get('x-revalidate-secret');

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, message: 'Invalid secret' },
      { status: 401 }
    );
  }

  revalidateTag(CONTENTFUL_CACHE_TAG);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
