import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';
import { isValidLocale } from '@/lib/i18n/config';

export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') ?? 'en';

  const products = await getProducts(isValidLocale(lang) ? lang : 'en');

  return NextResponse.json({ products });
}
