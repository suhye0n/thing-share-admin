import { UserButton } from '@clerk/nextjs';

const Page = () => {
  return (
    <div className="p-4">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default Page;
