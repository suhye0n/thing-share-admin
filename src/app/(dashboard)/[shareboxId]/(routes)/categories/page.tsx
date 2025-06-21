import { format } from 'date-fns';
import prismadb from '@/lib/prismadb';
import { CategoryClient } from './components/client';
import { CategoryColumn } from './components/columns';

const Page = async ({ params }: { params: Promise<{ shareboxId: string }> }) => {
  const { shareboxId } = await params;
  const categories = await prismadb.category.findMany({
    where: {
      shareboxId: shareboxId,
    },
    include: {
      banner: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    bannerLabel: item.banner.label,
    createdAt: format(item.createdAt, 'yyyy년 M월 d일'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default Page;
