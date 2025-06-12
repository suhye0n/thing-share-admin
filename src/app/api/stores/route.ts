import { getAuth } from '@clerk/nextjs/server';
import prismadb from '@/lib/prismadb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
