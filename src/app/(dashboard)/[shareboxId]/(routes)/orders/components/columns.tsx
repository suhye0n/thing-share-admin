'use client';
import { ColumnDef } from '@tanstack/react-table';

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  passes: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: 'passes',
    header: '이용권',
  },
  {
    accessorKey: 'phone',
    header: '연락처',
  },
  {
    accessorKey: 'address',
    header: '주소',
  },
  {
    accessorKey: 'totalPrice',
    header: '총 금액',
  },
  {
    accessorKey: 'isPaid',
    header: '결제 여부',
  },
  {
    accessorKey: 'createdAt',
    header: '생성일',
  },
];
