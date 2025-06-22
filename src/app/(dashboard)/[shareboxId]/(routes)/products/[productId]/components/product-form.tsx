'use client';

import { useState } from 'react';
import * as z from 'zod';
import { Category, Image, Product, Pass } from '@prisma/client';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
        passes: Pass[];
      })
    | null;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  passes: z
    .object({
      name: z.string().min(1, '이름을 입력하세요'),
      description: z.string().min(1, '설명을 입력하세요'),
      price: z.number().min(0, '가격은 0 이상이어야 합니다'),
      duration: z.number().min(1, '기간은 1일 이상이어야 합니다'),
    })
    .array()
    .optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? '상품 수정' : '상품 생성';
  const description = initialData ? '상품을 수정합니다.' : '새 상품을 추가합니다.';
  const toastMessage = initialData ? '상품이 수정되었습니다.' : '상품이 생성되었습니다.';
  const action = initialData ? '변경사항 저장' : '생성';

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          passes:
            initialData.passes?.map(({ name, description, price, duration }) => ({
              name,
              description,
              price: Number(price),
              duration,
            })) || [],
        }
      : {
          name: '',
          images: [],
          categoryId: '',
          isFeatured: false,
          isArchived: false,
          passes: [],
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.shareboxId}/products/${params.productId}`, data);
      } else {
        await axios.post(`/api/${params.shareboxId}/products`, data);
      }
      router.refresh();
      router.push(`/${params.shareboxId}/products`);
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
      await axios.delete(`/api/${params.shareboxId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.shareboxId}/products`);
      toast.success('상품이 삭제되었습니다.');
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
          {/* 이미지 업로드 */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상품 이미지</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) => field.onChange([...field.value, { url }])}
                    onRemove={(url) =>
                      field.onChange([...field.value.filter((image) => image.url !== url)])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="상품명" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="카테고리 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>추천 상품</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>아카이브</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* 이용권 관리 */}
          <FormField
            control={form.control}
            name="passes"
            render={({ field }) => (
              <>
                <Separator className="my-8" />
                <Heading title="이용권" description="상품에 포함된 이용권들을 관리합니다." />
                <div className="space-y-6">
                  {(field.value ?? []).map((pass, idx) => (
                    <div key={idx} className="p-6 space-y-4 border rounded-lg shadow-sm bg-white">
                      <FormLabel>이용권 이름</FormLabel>
                      <Input
                        placeholder="이용권 이름"
                        value={pass.name}
                        disabled={loading}
                        onChange={(e) => {
                          const arr = [...(field.value ?? [])];
                          arr[idx].name = e.target.value;
                          field.onChange(arr);
                        }}
                      />
                      <FormLabel>설명</FormLabel>
                      <Input
                        placeholder="설명"
                        value={pass.description}
                        disabled={loading}
                        onChange={(e) => {
                          const arr = [...(field.value ?? [])];
                          arr[idx].description = e.target.value;
                          field.onChange(arr);
                        }}
                      />
                      <FormLabel>가격</FormLabel>
                      <Input
                        type="number"
                        placeholder="가격"
                        value={pass.price.toString()}
                        disabled={loading}
                        onChange={(e) => {
                          const arr = [...(field.value ?? [])];
                          arr[idx].price = parseFloat(e.target.value || '0');
                          field.onChange(arr);
                        }}
                      />
                      <FormLabel>기간 (일)</FormLabel>
                      <Input
                        type="number"
                        placeholder="기간 (일)"
                        value={pass.duration.toString()}
                        disabled={loading}
                        onChange={(e) => {
                          const arr = [...(field.value ?? [])];
                          arr[idx].duration = parseInt(e.target.value || '0', 10);
                          field.onChange(arr);
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          field.onChange((field.value ?? []).filter((_, i) => i !== idx))
                        }
                        disabled={loading}
                      >
                        삭제
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        field.onChange([
                          ...(field.value ?? []),
                          { name: '', description: '', price: 0, duration: 1 },
                        ])
                      }
                      disabled={loading}
                    >
                      이용권 추가
                    </Button>
                  </div>
                </div>
                <FormMessage />
              </>
            )}
          />

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
