'use client';

import { useShareboxModal } from '@/hooks/use-sharebox-modal';
import { useEffect } from 'react';

const Page = () => {
  const onOpen = useShareboxModal((state) => state.onOpen);
  const isOpen = useShareboxModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) onOpen();
  }, [isOpen, onOpen]);
};

export default Page;
