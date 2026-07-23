import { useSession, signIn, signUp } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

export function AuthPage() {
  const { data: session } = useSession();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rotating slide headlines for bottom left showcase panel
  const slides = [
    {
      title: "Capturing Artwork, Creating Memories",
      subtitle: "Assemble layer trait stacks and craft 10,000+ unique editions effortlessly.",
    },
    {
      title: "10,000+ Editions, Zero Duplicates",
      subtitle: "Real-time DNA hashing guarantees unique artwork combinations across every generation.",
    },
    {
      title: "Ethereum & Solana Dual Export",
      subtitle: "Export ready-to-deploy metadata for ERC-721 and Metaplex standards simultaneously.",
    },
  ];

  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Automatically navigate to dashboard if already authenticated
  useEffect(() => {
    if (session?.user) {
      navigate("/dashboard", { replace: true });
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && !agreeTerms) {
      setError("Please agree to the Terms & Conditions to proceed.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || "Creator";
        const res = await signUp.email({
          email: email.trim(),
          password,
          name: fullName,
        });
        if (res.error) {
          setError(res.error.message || "Failed to create account. Please try again.");
        } else {
          navigate("/dashboard");
        }
      } else {
        const res = await signIn.email({
          email: email.trim(),
          password,
        });
        if (res.error) {
          setError(res.error.message || "Invalid email address or password.");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#120f21] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans selection:bg-indigo-500/30 transition-colors duration-200">
      {/* Main Container Card matching reference design with Light/Dark compatibility */}
      <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-[#1b172e] border border-slate-200 dark:border-slate-800/80 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px] transition-colors duration-200">
        
        {/* Left Side: Rich Graphic Showcase Panel with Automatic Slide Headline Cycling */}
        <div className="lg:col-span-6 p-6 sm:p-8 relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-950 via-[#181236] to-purple-950 min-h-[360px] lg:min-h-full">
          {/* Background Ambient Image Overlay */}
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
            <img
              src="/samples/cyberpunk_ed1.png"
              alt="Mintrix Graphic Artwork"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#140f2a] via-[#140f2a]/40 to-transparent z-0" />

          {/* Top Row: Logo & Back to Website Link */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Mintrix Logo"
                className="w-8 h-8 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="font-black text-xl tracking-tight text-white">
                Mintrix
              </span>
            </Link>

            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <span>Back to website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bottom Left Content with Automatic Text Carousel */}
          {(() => {
            const activeSlide = (slides[slideIndex] ?? slides[0]) as { title: string; subtitle: string };
            return (
              <div className="relative z-10 space-y-4 pt-16">
                <div className="min-h-[100px] flex flex-col justify-end">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight transition-all duration-500">
                    {activeSlide.title}
                  </h2>
                  <p className="mt-2 text-xs text-slate-300 font-medium leading-relaxed transition-all duration-500">
                    {activeSlide.subtitle}
                  </p>
                </div>

                {/* Pagination Carousel Indicator Bars */}
                <div className="flex items-center gap-2 pt-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSlideIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        slideIndex === i ? "w-8 bg-white" : "w-3 bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right Side: Auth Form Panel */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between bg-slate-50/50 dark:bg-[#19152b] transition-colors duration-200">
          {/* Header Row: Theme Toggle & Titles */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                Mintrix Studio Pass
              </span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/80 dark:bg-slate-800/60 border border-slate-300/80 dark:border-slate-700/60 transition-colors"
                title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
              >
                {theme === "light" ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {mode === "signup" ? "Create an account" : "Sign in to account"}
            </h1>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError(null);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                  >
                    Create one
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-4 my-6">
            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/80 rounded-xl text-rose-700 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    First name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Satoshi"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#120e24] border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nakamoto"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#120e24] border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@mintrix.xyz"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#120e24] border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-[#120e24] border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    agreeTerms
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-white dark:bg-[#120e24] border-slate-300 dark:border-slate-700 text-transparent"
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </button>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  I agree to the{" "}
                  <a href="#terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    Terms & Conditions
                  </a>
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating Workspace...</span>
              ) : (
                <span>{mode === "signup" ? "Create account" : "Sign in"}</span>
              )}
            </button>
          </form>

          {/* Social Auth Divider on a Single Line */}
          <div>
            <div className="flex items-center gap-3 my-5">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0">
                {mode === "signup" ? "Or register with" : "Or sign in with"}
              </span>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>

            {/* ONLY Google Sign-In Button */}
            <button
              type="button"
              onClick={() => alert("Google Single Sign-On enabled in production")}
              className="w-full py-2.5 bg-white dark:bg-[#120e24] hover:bg-slate-100 dark:hover:bg-[#1d1738] border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2.5 transition-colors shadow-2xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
