import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Shield, Users } from "lucide-react";
import { useAuth } from "../auth/auth";
import { Button } from "../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";

export function AppLayout() {
  const { me, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-[var(--radius)] bg-[hsl(var(--primary))] grid place-items-center">
              <Shield className="h-5 w-5 text-[hsl(var(--primary-foreground))]" />
            </div>
            <div>
              <div className="font-semibold leading-tight">DriverEdOS</div>
              <div className="text-xs text-[hsl(var(--muted-foreground))]">Operations & Compliance</div>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-[var(--radius)] text-sm border border-[hsl(var(--border))] ${isActive ? "bg-[hsl(var(--muted))]" : "hover:bg-[hsl(var(--muted))]/60"}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/students"
              className={({ isActive }) =>
                `px-3 py-2 rounded-[var(--radius)] text-sm border border-[hsl(var(--border))] ${isActive ? "bg-[hsl(var(--muted))]" : "hover:bg-[hsl(var(--muted))]/60"}`
              }
            >
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4" /> Students
              </span>
            </NavLink>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10">
                {me?.username ?? "Account"} <span className="ml-2 text-xs opacity-75">{me?.role}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => nav("/students")}>Students</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  logout();
                  nav("/login");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
