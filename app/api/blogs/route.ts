import { NextRequest, NextResponse } from 'next/server';
import { getBlogsPage } from '@/lib/blogs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const cursorParam = searchParams.get('cursor');
  const limitParam = searchParams.get('limit');

  const limit = Number.isFinite(Number(limitParam)) ? Number(limitParam) : 10;
  const cursor = Number.isFinite(Number(cursorParam)) ? Number(cursorParam) : 0;

  const safeLimit = limit > 0 && limit <= 50 ? limit : 10;
  const safeCursor = cursor >= 0 ? cursor : 0;

  const blogs = await getBlogsPage(safeLimit, safeCursor);
  const nextCursor =
    blogs.length === safeLimit ? safeCursor + safeLimit : null;

  return NextResponse.json({
    blogs,
    nextCursor,
  });
}

