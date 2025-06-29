import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import Navbar from '@/components/navbar';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ shareboxId: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { userId } = await auth();
  const { shareboxId } = await params;

  if (!userId) {
    redirect('/sign-in');
  }

  const sharebox = await prismadb?.sharebox.findFirst({
    where: {
      id: shareboxId,
      userId,
    },
  });

  if (!sharebox) {
    redirect('/');
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;
