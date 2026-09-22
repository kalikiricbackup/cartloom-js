interface PageContainerProps {
  children: React.ReactNode;
}

function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="page">
      <div className="container">{children}</div>
    </main>
  );
}

export default PageContainer;
