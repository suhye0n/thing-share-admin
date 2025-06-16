'use client';

import React, { useState } from 'react';
import { Sharebox } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import { Check, ChevronsUpDown, PlusCircle, Box } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command';
import { Button } from './ui/button';
import { useShareboxModal } from '@/hooks/use-sharebox-modal';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface ShareboxSwitcherProps extends PopoverTriggerProps {
  items: Sharebox[];
}

export default function ShareboxSwitcher({ className, items = [] }: ShareboxSwitcherProps) {
  const shareboxModal = useShareboxModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentSharebox = formattedItems.find((item) => item.value === params.shareboxId);

  const [open, setOpen] = useState(false);

  const onShareboxSelect = (sharebox: { value: string; label: string }) => {
    setOpen(true);
    router.push(`/${sharebox.value}`);
  };
  return (
    <Popover onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a sharebox"
          className={cn('w-[200px] justify-between', className)}
        >
          <Box className="w-4 h-4 mr-2" />
          {currentSharebox?.label}
          <ChevronsUpDown className="w-4 h-4 ml-auto opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="쉐어박스 검색..." />
            <CommandEmpty>쉐어박스를 찾을 수 없습니다.</CommandEmpty>
            <CommandGroup heading="쉐어박스 목록">
              {formattedItems.map((sharebox, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => onShareboxSelect(sharebox)}
                  className="text-sm"
                >
                  <Box className="w-4 h-4 mr-2" />
                  {sharebox.label}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentSharebox?.value === sharebox.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  shareboxModal.onOpen();
                }}
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                쉐어박스 생성
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
