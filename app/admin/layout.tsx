export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
      </header>
      <main className="container mx-auto py-6">
        {children}
      </main>
    </div>
  )
} 