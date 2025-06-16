import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { SettingsForm } from './components/settings-form';

const Page = async ({ params }: { params: Promise<{ shareboxId: string }> }) => {
  const { shareboxId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const sharebox = await prismadb.sharebox.findFirst({
    where: {
      id: shareboxId,
      userId,
    },
  });

  if (!sharebox) {
    redirect('/');
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SettingsForm initialData={sharebox} />
      </div>
    </div>
  );
};

export default Page;
