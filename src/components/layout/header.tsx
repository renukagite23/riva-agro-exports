import Link from 'next/link';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { Logo } from '../icons/logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-secondary">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <MainNav className="mx-6 hidden md:flex" />
          <div className="flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
