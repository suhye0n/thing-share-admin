'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { ProductColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface ProductClientProps {
  data: ProductColumn[];
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`상품 (${data?.length})`} description="쉐어박스 상품을 관리하세요" />
        <Button onClick={() => router.push(`/${params.shareboxId}/products/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          새로 추가
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="상품 관련 API" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};
