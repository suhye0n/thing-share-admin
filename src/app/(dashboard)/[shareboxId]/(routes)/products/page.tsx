import { format } from 'date-fns';
import prismadb from '@/lib/prismadb';
import { ProductClient } from './components/client';
import { ProductColumn } from './components/columns';

const Page = async ({ params }: { params: Promise<{ shareboxId: string }> }) => {
  const { shareboxId } = await params;
  const products = await prismadb.product.findMany({
    where: {
      shareboxId: shareboxId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    category: item.category.name,
    createdAt: format(item.createdAt, 'yyyy년 M월 d일'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default Page;
