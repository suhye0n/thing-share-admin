import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ categoryId: string }> }) {
  try {
    const { categoryId } = await params;
    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        banner: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[GET /api/{shareboxId}/categories/{categoryId}]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ shareboxId: string; categoryId: string }> },
) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name, bannerId } = body;
    const { shareboxId, categoryId } = await params;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!bannerId) {
      return new NextResponse('Banner URL is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
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

    const category = await prismadb.category.updateMany({
      where: {
        id: categoryId,
      },
      data: {
        name,
        bannerId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[PATCH /api/{shareboxId}/categories/{categoryId}]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ shareboxId: string; categoryId: string }> },
) {
  try {
    const { userId } = await auth();
    const { shareboxId, categoryId } = await params;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
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

    const category = await prismadb.category.deleteMany({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[DELETE /api/{shareboxId}/categories/{categoryId}]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
