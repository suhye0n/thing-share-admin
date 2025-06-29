'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.shareboxId}`,
      label: '내 쉐어박스',
      active: pathname === `/${params.shareboxId}`,
    },
    {
      href: `/${params.shareboxId}/orders`,
      label: '주문',
      active: pathname === `/${params.shareboxId}/orders`,
    },
    {
      href: `/${params.shareboxId}/categories`,
      label: '카테고리',
      active: pathname === `/${params.shareboxId}/categories`,
    },
    {
      href: `/${params.shareboxId}/products`,
      label: '상품',
      active: pathname === `/${params.shareboxId}/products`,
    },
    {
      href: `/${params.shareboxId}/banners`,
      label: '배너',
      active: pathname === `/${params.shareboxId}/banners`,
    },
    {
      href: `/${params.shareboxId}/settings`,
      label: '설정',
      active: pathname === `/${params.shareboxId}/settings`,
    },
  ];
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {routes.map((route, index) => (
        <Link
          key={index}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground',
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
