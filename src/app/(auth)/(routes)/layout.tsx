interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <div className="flex items-center justify-center h-full">{children}</div>;
};

export default Layout;
