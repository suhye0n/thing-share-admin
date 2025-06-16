'use client';

import * as z from 'zod';

import { Modal } from '@/components/ui/modal';
import { useShareboxModal } from '@/hooks/use-sharebox-modal';
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
import { toast } from 'react-hot-toast';

const formSchema = z.object({
  name: z.string().min(1, '쉐어박스 이름을 반드시 입력해야 합니다.'),
});

export const ShareboxModal = () => {
  const shareboxModal = useShareboxModal();

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

      const response = await axios.post('/api/shareboxes', data);

      window.location.assign(`/${response.data.id}`);
      toast.success('쉐어박스가 성공적으로 생성되었습니다.');
    } catch (error) {
      toast.error('문제가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="새 쉐어박스 만들기"
      description="관리할 새 쉐어박스 이름을 입력해 주세요."
      isOpen={shareboxModal.isOpen}
      onClose={shareboxModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>쉐어박스 이름</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="쉐어박스 이름을 입력해 주세요."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end">
                <Button disabled={loading} variant="outline" onClick={shareboxModal.onClose}>
                  취소
                </Button>
                <Button disabled={loading} type="submit">
                  생성하기
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
