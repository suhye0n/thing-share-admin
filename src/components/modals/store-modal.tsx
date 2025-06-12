'use client';

import * as z from 'zod';

import { Modal } from '@/components/ui/modal';
import { useStoreModal } from '@/hooks/use-store-modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import { SignOutButton } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const response = await axios.post('/api/stores', data);

      console.log(response.data);
      toast.success('완료되었습니다.');
    } catch (error) {
      console.log(error);
      toast.error('에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Test"
      description="Test Desc"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <SignOutButton />
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Test" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end">
                <Button disabled={loading} variant="outline" onClick={storeModal.onClose}>
                  취소
                </Button>
                <Button disabled={loading} type="submit">
                  완료
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
