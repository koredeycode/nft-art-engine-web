import { signOut, useSession } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme";
import { LayoutDashboard, LogOut, Moon, Sparkles, Sun } from "lucide-react";
import { Link, useLocation } from "react-router";

interface NavbarProps {
  children?: React.ReactNode;
}

export function Navbar({ children }: NavbarProps) {
  const location = useLocation();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // ignore
    }
  };

  const isDashboardActive = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/projects");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-purple-900/40 bg-white/90 dark:bg-[#0b0819]/90 backdrop-blur-xl transition-colors duration-200 h-14 shrink-0">
      <div className="w-full px-4 h-full flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Brand logo & Studio Dashboard link */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="Mintrix Logo"
              className="w-7 h-7 rounded-lg object-cover shadow-xs group-hover:scale-105 transition-transform"
            />
            <span className="font-extrabold text-base tracking-wider uppercase text-slate-900 dark:text-white">
              Mintrix
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                isDashboardActive
                  ? "bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-800"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-fuchsia-600 dark:text-fuchsia-400" />
              <span className="hidden sm:inline">Studio Workspace</span>
            </Link>
          </nav>
        </div>

        {/* Center / Custom Children */}
        {children && (
          <div className="flex items-center gap-3 overflow-x-auto min-w-0 flex-1 justify-center">
            {children}
          </div>
        )}

        {/* Right: Theme Toggle & User Auth Profile */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/50 transition-colors flex items-center gap-1 text-xs"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
          >
            {theme === "light" ? (
              <Moon className="w-3.5 h-3.5 text-purple-600" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          {session?.user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-purple-900/40">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-fuchsia-600 to-purple-600 text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
                  {session.user.name?.[0]?.toUpperCase() ||
                    session.user.email?.[0]?.toUpperCase() ||
                    "U"}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden md:inline max-w-[120px] truncate">
                  {session.user.name || session.user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="sleek-button px-3 py-1 text-xs font-extrabold uppercase rounded-lg shadow-xs"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
