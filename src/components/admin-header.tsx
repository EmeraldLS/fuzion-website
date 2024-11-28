import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  User2,
} from "lucide-react";

export default function AdminHeader() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex h-full flex-col bg-white shadow-lg">
        <div className="flex h-16 flex-shrink-0 items-center px-4">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl font-semibold">
              Fu<span className="text-main">zion</span>
            </span>
          </a>
        </div>
        <Separator />
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-2 py-4">
            <NavItem
              href="/admin"
              icon={<LayoutDashboard className="h-5 w-5" />}
            >
              Dashboard
            </NavItem>
            <NavItem
              href="/admin/products"
              icon={<Package className="h-5 w-5" />}
            >
              Products
            </NavItem>
            <NavItem
              href="/admin/orders"
              icon={<ShoppingCart className="h-5 w-5" />}
            >
              Orders
            </NavItem>
            <NavItem
              href="/admin/workers/register"
              icon={<User2 className="h-5 w-5" />}
            >
              Register Worker
            </NavItem>
            <NavItem href="/admin/workers" icon={<Users className="h-5 w-5" />}>
              Workers
            </NavItem>
          </nav>
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
      </div>
    </aside>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function NavItem({ href, icon, children }: NavItemProps) {
  return (
    <a
      href={href}
      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    >
      {icon}
      <span className="ml-3">{children}</span>
    </a>
  );
}
