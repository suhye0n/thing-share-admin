import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prismadb from '@/lib/prismadb';

export async function POST(req: Request, { params }: { params: Promise<{ shareboxId: string }> }) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name, bannerId } = body;
    const { shareboxId } = await params;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!bannerId) {
      return new NextResponse('Banner id is required', { status: 400 });
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

    const category = await prismadb.category.create({
      data: {
        name,
        bannerId,
        shareboxId: shareboxId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[POST /api/{shareboxId}/categories]', error);
    return new NextResponse(`Internal error`, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ shareboxId: string }> }) {
  try {
    const { shareboxId } = await params;

    if (!shareboxId) {
      return new NextResponse('Sharebox Id is required', { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: {
        shareboxId: shareboxId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('[GET /api/{shareboxId}/categories]', error);
    return new NextResponse(`Internal error`, { status: 500 });
  }
}
