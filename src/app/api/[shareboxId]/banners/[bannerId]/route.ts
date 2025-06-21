import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ bannerId: string }> }) {
  try {
    const { bannerId } = await params;
    if (!bannerId) {
      return new NextResponse('Banner id is required', { status: 400 });
    }

    const banner = await prismadb.banner.findUnique({
      where: {
        id: bannerId,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('[GET /api/{shareboxId}/banners/{bannerId}]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ shareboxId: string; bannerId: string }> },
) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { shareboxId, bannerId } = await params;

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!label) {
      return new NextResponse('Label is required', { status: 400 });
    }

    if (!bannerId) {
      return new NextResponse('Banner id is required', { status: 400 });
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

    const banner = await prismadb.banner.updateMany({
      where: {
        id: bannerId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('[PATCH /api/{shareboxId}/banners/{bannerId}]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ shareboxId: string; bannerId: string }> },
) {
  try {
    const { userId } = await auth();
    const { bannerId, shareboxId } = await params;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!bannerId) {
      return new NextResponse('Banner id is required', { status: 400 });
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

    const banner = await prismadb.banner.deleteMany({
      where: {
        id: bannerId,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('[DELETE /api/{shareboxId}/banners/{bannerId}]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
