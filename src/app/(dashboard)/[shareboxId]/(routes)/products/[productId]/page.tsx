import prismadb from '@/lib/prismadb';
import { ProductForm } from './components/product-form';

const Page = async ({ params }: { params: Promise<{ productId: string; shareboxId: string }> }) => {
  const { shareboxId, productId } = await params;
  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      shareboxId: shareboxId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ProductForm initialData={product} categories={categories} />
      </div>
    </div>
  );
};

export default Page;
