import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prismadb from '@/lib/prismadb';

export async function POST(req: Request, { params }: { params: Promise<{ shareboxId: string }> }) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name, passes, categoryId, images, isFeatured, isArchived } = body;

    const { shareboxId } = await params;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
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

    const product = await prismadb.product.create({
      data: {
        name,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => ({ url: image.url }))],
          },
        },
        isFeatured,
        isArchived,
        categoryId,
        shareboxId,
      },
    });

    if (passes && passes.length > 0) {
      await prismadb.pass.createMany({
        data: passes.map((pass: { name: string; description: string; duration: number }) => ({
          name: pass.name,
          description: pass.description,
          duration: pass.duration,
          productId: product.id,
        })),
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('[POST /api/{shareboxId}/products]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ shareboxId: string }> }) {
  try {
    const { shareboxId } = await params;
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!shareboxId) {
      return new NextResponse('Sharebox Id is required', { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        shareboxId: shareboxId,
        categoryId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        passes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('[GET /api/{shareboxId}/products]', error);
    return new NextResponse(`Internal error`, { status: 500 });
  }
}
