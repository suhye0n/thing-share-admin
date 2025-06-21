import prismadb from '@/lib/prismadb';
import { CategoryForm } from './components/category-form';

const Page = async ({
  params,
}: {
  params: Promise<{ categoryId: string; shareboxId: string }>;
}) => {
  const { categoryId, shareboxId } = await params;
  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  const banners = await prismadb.banner.findMany({
    where: {
      shareboxId: shareboxId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <CategoryForm banners={banners} initialData={category} />
      </div>
    </div>
  );
};

export default Page;
