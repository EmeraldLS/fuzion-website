"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  User2,
  Menu,
} from "lucide-react";

export default function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col h-full">
            <div className="flex h-16 flex-shrink-0 items-center px-4">
              <a
                href="/"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <span className="text-2xl font-semibold">
                  Fu<span className="text-main">zion</span>
                </span>
              </a>
            </div>
            <Separator />
            <div className="flex-1 overflow-auto py-4">
              <NavItem
                href="/admin"
                icon={<LayoutDashboard className="h-5 w-5" />}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </NavItem>
              <NavItem
                href="/admin/products"
                icon={<Package className="h-5 w-5" />}
                onClick={() => setOpen(false)}
              >
                Products
              </NavItem>
              <NavItem
                href="/admin/orders"
                icon={<ShoppingCart className="h-5 w-5" />}
                onClick={() => setOpen(false)}
              >
                Orders
              </NavItem>
              <NavItem
                href="/admin/workers/register"
                icon={<User2 className="h-5 w-5" />}
                onClick={() => setOpen(false)}
              >
                Register Worker
              </NavItem>
              <NavItem
                href="/admin/workers"
                icon={<Users className="h-5 w-5" />}
                onClick={() => setOpen(false)}
              >
                Workers
              </NavItem>
            </div>
            <Separator />
            <div className="p-4">
              <form action="/api/auth/logout" method="POST">
                <Button type="submit" variant="outline" className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </form>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavItem({ href, icon, children, onClick }: NavItemProps) {
  return (
    <a
      href={href}
      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      onClick={onClick}
    >
      {icon}
      <span className="ml-3">{children}</span>
    </a>
  );
}
