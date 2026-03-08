'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Scissors,
  Package,
  Lightbulb,
  ShoppingCart,
  Boxes,
  Receipt,
  Settings,
  Store,
  FolderTree,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Servicios', href: '/services', icon: Scissors },
  { name: 'Productos', href: '/products', icon: Package },
  { name: 'Categorías', href: '/categories', icon: FolderTree },
  { name: 'POS', href: '/pos', icon: ShoppingCart },
  { name: 'Stock', href: '/inventory', icon: Boxes },
  { name: 'Ventas', href: '/sales', icon: Receipt },
  { name: 'Insights', href: '/insights', icon: Lightbulb },
  { name: 'Identidad del local', href: '/settings/branding', icon: Store },
  { name: 'Métodos de pago', href: '/settings/payment-methods', icon: Settings },
];

const DEFAULT_BRANDING = {
  storeName: 'SeeTheNumbers',
  profileImage: '',
};

export function Sidebar() {
  const pathname = usePathname();
  const [branding, setBranding] = useState(DEFAULT_BRANDING);

  useEffect(() => {
    const saved = localStorage.getItem('stn-branding');
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setBranding({
        storeName: parsed.storeName || DEFAULT_BRANDING.storeName,
        profileImage: parsed.profileImage || '',
      });
    } catch {
      setBranding(DEFAULT_BRANDING);
    }
  }, [pathname]);

  return (
    <div className="stn-sidebar hidden p-4 lg:block lg:w-72">
      <div className="flex h-full flex-col">
        <div className="apple-card flex min-h-20 items-center rounded-[calc(var(--radius)+12px)] px-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-primary/90 text-primary-foreground">
              {branding.profileImage ? (
                <img src={branding.profileImage} alt={branding.storeName} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-bold">{branding.storeName.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Local</p>
              <span className="line-clamp-1 text-lg font-semibold">{branding.storeName}</span>
            </div>
          </Link>
        </div>
        <nav className="apple-card mt-4 flex-1 space-y-1 rounded-[calc(var(--radius)+12px)] p-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-[calc(var(--radius)+2px)] px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
