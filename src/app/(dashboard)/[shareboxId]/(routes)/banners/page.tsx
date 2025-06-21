import { format } from 'date-fns';
import prismadb from '@/lib/prismadb';
import { BannerClient } from './components/client';
import { BannerColumn } from './components/columns';

const Page = async ({ params }: { params: Promise<{ shareboxId: string }> }) => {
  const { shareboxId } = await params;
  const banners = await prismadb.banner.findMany({
    where: {
      shareboxId: shareboxId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedBanners: BannerColumn[] = banners.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'yyyy년 M월 d일'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BannerClient data={formattedBanners} />
      </div>
    </div>
  );
};

export default Page;
