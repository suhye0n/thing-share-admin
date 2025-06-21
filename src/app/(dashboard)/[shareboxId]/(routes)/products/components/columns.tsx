'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type ProductColumn = {
  id: string;
  name: string;
  category: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: '이름',
  },
  {
    accessorKey: 'isArchived',
    header: '아카이브',
  },
  {
    accessorKey: 'isFeatured',
    header: '추천 상품',
  },
  {
    accessorKey: 'category',
    header: '카테고리',
  },
  {
    accessorKey: 'createdAt',
    header: '생성일',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
