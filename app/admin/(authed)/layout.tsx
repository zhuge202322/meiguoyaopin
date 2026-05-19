import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import Logo from "@/components/Logo";
import { Package, LayoutDashboard, LogOut } from "lucide-react";

export const metadata = { title: "Admin · MyFastRx" };

export default async function AdminAuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-[#0F2259] text-white">
        <div className="p-5 border-b border-white/10 bg-white">
          <Logo width={140} />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <SideLink href="/admin" icon={<LayoutDashboard size={16} />}>
            Dashboard
          </SideLink>
          <SideLink href="/admin/orders" icon={<Package size={16} />}>
            All Orders
          </SideLink>
        </nav>
        <div className="p-3 border-t border-white/10">
          <p className="px-3 pb-2 text-[11px] text-white/50">
            {session.email}
          </p>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="w-full inline-flex items-center gap-2 rounded-md px-3 py-2 text-[13px] hover:bg-white/10 transition"
            >
              <LogOut size={16} /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

function SideLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[14px] text-white/85 hover:bg-white/10 hover:text-white transition"
    >
      {icon}
      {children}
    </Link>
  );
}
