import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ shareboxId: string }> },
) {
  try {
    const { userId } = await auth();
    const { shareboxId } = await params;
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!shareboxId) {
      return new NextResponse('Sharebox id is required', { status: 400 });
    }

    const sharebox = await prismadb.sharebox.updateMany({
      where: {
        id: shareboxId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(sharebox);
  } catch (error) {
    console.error('[PATCH /api/shareboxes/{shareboxId}]', error);
    return new NextResponse('Internal error', { status: 500 });
  } finally {
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ shareboxId: string }> },
) {
  try {
    const { userId } = await auth();
    const { shareboxId } = await params;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!shareboxId) {
      return new NextResponse('Sharebox id is required', { status: 400 });
    }

    const sharebox = await prismadb.sharebox.deleteMany({
      where: {
        id: shareboxId,
        userId,
      },
    });

    return NextResponse.json(sharebox);
  } catch (error) {
    console.error('[DELETE /api/shareboxes/{shareboxId]}', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
