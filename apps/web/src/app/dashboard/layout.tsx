import { Sidebar } from '@/shared/components/layout/sidebar';
import { Header } from '@/shared/components/layout/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[radial-gradient(circle_at_10%_10%,hsl(var(--accent)/0.35),transparent_35%),radial-gradient(circle_at_90%_0%,hsl(var(--primary)/0.18),transparent_30%)]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="stn-main-container container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
