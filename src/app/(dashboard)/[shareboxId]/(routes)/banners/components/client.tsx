'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { BannerColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface BannerClientProps {
  data: BannerColumn[];
}

export const BannerClient: React.FC<BannerClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`배너 (${data?.length})`} description="쉐어박스 배너를 관리하세요" />
        <Button onClick={() => router.push(`/${params.shareboxId}/banners/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          새로 추가
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading title="API" description="배너 관련 API" />
      <Separator />
      <ApiList entityName="banners" entityIdName="bannerId" />
    </>
  );
};
