'use client';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { OrderColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading title={`주문 (${data?.length})`} description="쉐어박스 주문을 관리하세요" />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="passes" />
    </>
  );
};
