'use client';

import { UserButton } from '@clerk/nextjs';
import { useShareboxModal } from '@/hooks/use-sharebox-modal';
import { useEffect } from 'react';

const Page = () => {
  const onOpen = useShareboxModal((state) => state.onOpen);
  const isOpen = useShareboxModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) onOpen();
  }, [isOpen, onOpen]);

  return (
    <div className="p-4">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default Page;
