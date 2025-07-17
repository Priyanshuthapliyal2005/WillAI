'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { FileText, Menu, X, User, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navigation() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">Will Generator</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-green-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{session.user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <FileText className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/create">
                      <Settings className="mr-2 h-4 w-4" />
                      Create Will
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onSelect={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/dashboard/create">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium transition-colors hover:text-green-600"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  <div className="border-t pt-4">
                    {session ? (
                      <div className="space-y-2">
                        <div className="px-2 py-1">
                          <p className="font-medium">{session.user?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.user?.email}
                          </p>
                        </div>
                        <Button asChild variant="ghost" className="w-full justify-start">
                          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full justify-start">
                          <Link href="/dashboard/create" onClick={() => setIsOpen(false)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Create Will
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600"
                          onClick={() => {
                            signOut();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button asChild variant="ghost" className="w-full">
                          <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                            Sign In
                          </Link>
                        </Button>
                        <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                          <Link href="/dashboard/create" onClick={() => setIsOpen(false)}>
                            Get Started
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
