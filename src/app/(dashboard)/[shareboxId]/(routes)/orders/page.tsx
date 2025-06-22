import { format } from 'date-fns';
import prismadb from '@/lib/prismadb';
import { OrderClient } from './components/client';
import { OrderColumn } from './components/columns';
import { formatter } from '@/lib/utils';

const Page = async ({ params }: { params: Promise<{ shareboxId: string }> }) => {
  const { shareboxId } = await params;

  const orders = await prismadb.order.findMany({
    where: {
      shareboxId: shareboxId,
    },
    include: {
      orderItems: {
        include: {
          pass: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    passes: item.orderItems.map((orderItem) => orderItem.pass.name).join(', '),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => total + Number(item.pass.price), 0),
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, 'yyyy년 M월 d일'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default Page;
