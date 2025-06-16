import prismadb from '@/lib/prismadb';

interface PageProps {
  params: { shareboxId: string };
}

const Page = async ({ params }: PageProps) => {
  const { shareboxId } = await params;
  const sharebox = await prismadb.sharebox.findFirst({
    where: { id: shareboxId },
  });

  return <div>{sharebox?.name}</div>;
};

export default Page;
