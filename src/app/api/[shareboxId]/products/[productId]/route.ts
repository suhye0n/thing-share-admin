import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params;

    if (!productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
        passes: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[GET /api/{shareboxId}/products/{productId}]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ shareboxId: string; productId: string }> },
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { shareboxId, productId } = await params;

    const { name, passes, categoryId, images, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!categoryId) new NextResponse('Category id is required', { status: 400 });

    if (!images || !images.length) {
      return new NextResponse('Image is required', { status: 400 });
    }

    if (!productId) {
      return new NextResponse('Product id is required', { status: 400 });
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

    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
        categoryId,
        shareboxId: shareboxId,
        ...(passes
          ? {
              passes: {
                deleteMany: {},
              },
            }
          : {}),
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        ...(passes
          ? {
              passes: {
                createMany: {
                  data: passes.map(
                    (pass: { name: string; description: string; duration: number }) => ({
                      name: pass.name,
                      description: pass.description,
                      duration: pass.duration,
                    }),
                  ),
                },
              },
            }
          : {}),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PATCH /api/{shareboxId}/products/{productId}]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ shareboxId: string; productId: string }> },
) {
  try {
    const { userId } = await auth();
    const { shareboxId, productId } = await params;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!productId) {
      return new NextResponse('Product id is required', { status: 400 });
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

    const product = await prismadb.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[DELETE /api/{shareboxId}/products/{productId}]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
