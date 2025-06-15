'use client';

import { useState, useEffect } from 'react';
import { ShareboxModal } from '@/components/modals/sharebox-modal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <ShareboxModal />;
};
