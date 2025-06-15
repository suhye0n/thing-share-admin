import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const sharebox = await prismadb?.sharebox?.findFirst({
    where: {
      userId,
    },
  });

  if (sharebox) {
    redirect(`/${sharebox.id}`);
  }

  return <>{children}</>;
};

export default Layout;
