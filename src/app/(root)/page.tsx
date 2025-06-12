'use client';

import { UserButton } from '@clerk/nextjs';
import { useStoreModal } from '@/hooks/use-store-modal';
import { useEffect } from 'react';

const Page = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  return (
    <div className="p-4">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default Page;
