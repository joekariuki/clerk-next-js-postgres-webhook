



export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { dashboardId: string };
}) {



  return (
    <>
      {children}
    </>
  );
}
