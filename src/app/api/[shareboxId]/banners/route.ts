import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prismadb from '@/lib/prismadb';

export async function POST(req: Request, { params }: { params: Promise<{ shareboxId: string }> }) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { label, imageUrl } = body;
    const { shareboxId } = await params;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!label) {
      return new NextResponse('Label is required', { status: 400 });
    }

    if (!shareboxId) {
      return new NextResponse('Sharebox Id is required', { status: 400 });
    }

    const shareboxByUserId = await prismadb.sharebox.findFirst({
      where: {
        id: shareboxId,
        userId,
      },
    });

    if (!shareboxByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const banner = await prismadb.banner.create({
      data: {
        label,
        imageUrl,
        shareboxId: shareboxId,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('[POST /api/{shareboxId}/banners]', error);
    return new NextResponse(`Internal error`, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ shareboxId: string }> }) {
  try {
    const { shareboxId } = await params;

    if (!shareboxId) {
      return new NextResponse('Sharebox Id is required', { status: 400 });
    }

    const banners = await prismadb.banner.findMany({
      where: {
        shareboxId: shareboxId,
      },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('[GET /api/{shareboxId}/banners]', error);
    return new NextResponse(`Internal error`, { status: 500 });
  }
}
