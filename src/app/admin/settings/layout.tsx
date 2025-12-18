'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Cog,
  Users,
  CreditCard,
  Truck,
  Percent,
  Bell,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const settingsNav = [
  { href: '/admin/settings/general', label: 'General', icon: Cog },
  { href: '/admin/settings/users-roles', label: 'Users & Roles', icon: Users },
  { href: '/admin/settings/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/settings/shipping', label: 'Shipping & Logistics', icon: Truck },
  { href: '/admin/settings/taxes', label: 'Tax & Compliance', icon: Percent },
  { href: '/admin/settings/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/settings/security', label: 'Security', icon: Shield },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
       <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <Card>
            <CardContent className="p-2">
              <nav className="flex flex-col space-y-1">
                {settingsNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </>
  );
}
