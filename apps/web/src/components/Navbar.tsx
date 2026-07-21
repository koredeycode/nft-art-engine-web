import { Link, useLocation } from "react-router";
import { Sparkles, Layers, LogOut, Sun, Moon } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme";

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

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200 h-14 shrink-0">
      <div className="w-full px-4 h-full flex items-center justify-between gap-3">
        {/* Left: Brand logo & Collections link */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs group-hover:bg-indigo-700 transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white hidden sm:inline">
              NFT Art Engine
            </span>
          </Link>

          <nav className="flex items-center">
            <Link
              to="/"
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                location.pathname === "/"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden md:inline">Collections</span>
            </Link>
          </nav>
        </div>

        {/* Center / Custom Children (Top Nav Generation Engine & Gallery Toggle) */}
        {children && <div className="flex items-center gap-3 overflow-x-auto min-w-0 flex-1 justify-center">{children}</div>}

        {/* Right: Theme Toggle & User Auth Profile */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 text-xs"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
          >
            {theme === "light" ? <Moon className="w-3.5 h-3.5 text-slate-700" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {session?.user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-semibold text-[11px] flex items-center justify-center shadow-xs">
                {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <button
                onClick={handleSignOut}
                className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
