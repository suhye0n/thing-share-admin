import prismadb from '@/lib/prismadb';
import { BannerForm } from './components/banner-form';

const Page = async ({ params }: { params: Promise<{ bannerId: string }> }) => {
  const { bannerId } = await params;
  const banner = await prismadb.banner.findUnique({
    where: {
      id: bannerId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BannerForm initialData={banner} />
      </div>
    </div>
  );
};

export default Page;
