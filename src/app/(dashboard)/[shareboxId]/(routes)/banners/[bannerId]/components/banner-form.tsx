'use client';

import { useState } from 'react';
import * as z from 'zod';
import { Banner } from '@prisma/client';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash } from 'lucide-react';
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
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import ImageUpload from '@/components/ui/image-upload';

interface SettingsFromProps {
  initialData: Banner | null;
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().optional(),
});

type BannerFormValues = z.infer<typeof formSchema>;

export const BannerForm: React.FC<SettingsFromProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? '배너 수정' : '배너 생성';
  const description = initialData ? '배너를 수정합니다.' : '새 배너를 추가합니다.';
  const toastMessage = initialData ? '배너가 수정되었습니다.' : '배너가 생성되었습니다.';
  const action = initialData ? '변경사항 저장' : '생성';

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
    },
  });

  const onSubmit = async (data: BannerFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.shareboxId}/banners/${params.bannerId}`, data);
      } else {
        await axios.post(`/api/${params.shareboxId}/banners`, data);
      }
      router.refresh();
      router.push(`/${params.shareboxId}/banners`);
      toast.success(toastMessage);
    } catch (err) {
      toast.error('문제가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.shareboxId}/banners/${params.bannerId}`);
      router.refresh();
      router.push(`/${params.shareboxId}/banners`);
      toast.success('배너가 삭제되었습니다.');
    } catch (err) {
      toast.error('문제가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>배너 이미지</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url: string) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>라벨</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="배너 라벨" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
