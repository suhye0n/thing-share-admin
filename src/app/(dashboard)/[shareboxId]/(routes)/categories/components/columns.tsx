'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type CategoryColumn = {
  id: string;
  name: string;
  bannerLabel: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: 'name',
    header: '이름',
  },
  {
    accessorKey: 'banner',
    header: '배너',
    cell: ({ row }) => row.original.bannerLabel,
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
