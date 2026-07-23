import { useSession } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Cpu,
  Layers,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

export function LandingPage() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLaunchStudio = () => {
    if (session?.user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleTryDemo = () => {
    navigate("/auth?demo=true");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Mesh Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[400px] right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Mintrix
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#showcase" className="hover:text-white transition-colors">
              Showcase
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              Architecture
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {session?.user ? (
              <Link
                to="/dashboard"
                className="sleek-button px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
              >
                <span>Go to Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTryDemo}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
                >
                  Demo Account
                </button>
                <Link
                  to="/auth"
                  className="sleek-button px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                >
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Mintrix Engine v2.0 • Dual ETH & Solana Metadata</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-white leading-[1.1]">
          Generate <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">10,000+ NFT Collections</span> with Precision
        </h1>

        <p className="mt-6 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          The high-performance studio for digital artists and NFT creators. Assemble layer traits, configure custom rarity rules, preview DNA uniqueness live, and export production assets.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
          <button
            onClick={handleLaunchStudio}
            className="sleek-button w-full sm:w-auto px-6 py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
          >
            <span>Launch Mintrix Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleTryDemo}
            className="secondary-button w-full sm:w-auto px-6 py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 border border-slate-800"
          >
            <span>Explore Demo Account</span>
          </button>
        </div>

        {/* Feature Pill Highlights */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Zero Duplicates Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>ETH ERC-721 & Solana Metaplex</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>Layer Blend Modes & GIF Encoder</span>
          </div>
        </div>

        {/* Centerpiece Studio Preview Mockup */}
        <div className="mt-14 w-full studio-panel p-2 sm:p-4 rounded-2xl border border-slate-800/90 shadow-2xl shadow-indigo-950/40 relative">
          <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-900 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            {/* Left: Layer list preview */}
            <div className="lg:col-span-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Configured Layers</span>
                <span className="text-indigo-400 font-mono">6 Layers</span>
              </div>
              {[
                { name: "Background", count: "12 traits", active: false },
                { name: "Base Avatar", count: "8 traits", active: false },
                { name: "Visors & Eyes", count: "15 traits", active: true },
                { name: "Mouth Accessories", count: "10 traits", active: false },
                { name: "Headwear", count: "14 traits", active: false },
                { name: "Aura FX", count: "6 traits", active: false },
              ].map((layer) => (
                <div
                  key={layer.name}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                    layer.active
                      ? "bg-indigo-950/60 border-indigo-700/80 text-white font-semibold"
                      : "bg-slate-950/40 border-slate-800/80 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{layer.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{layer.count}</span>
                </div>
              ))}
            </div>

            {/* Middle: Canvas Stage */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-900/40 rounded-xl border border-slate-800 relative">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-xl bg-gradient-to-tr from-purple-900/40 via-indigo-900/30 to-cyan-900/40 border border-indigo-500/30 flex items-center justify-center relative overflow-hidden shadow-inner">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 blur-xl opacity-40 animate-pulse" />
                <Sparkles className="w-16 h-16 text-cyan-300 relative z-10 drop-shadow-md" />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="px-2.5 py-1 bg-indigo-950 border border-indigo-800 text-indigo-400 rounded-md text-[11px] font-mono">
                  DNA: 8a4f91b2...
                </span>
                <span className="px-2.5 py-1 bg-purple-950 border border-purple-800 text-purple-400 rounded-md text-[11px] font-mono">
                  Edition #0042
                </span>
              </div>
            </div>

            {/* Right: Rarity & Stats */}
            <div className="lg:col-span-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-300 mb-3">Rarity Matrix</div>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Cyber Visor Gold</span>
                      <span className="text-indigo-400 font-mono">4.2%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[20%] h-full bg-indigo-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Holo Neon Backdrop</span>
                      <span className="text-purple-400 font-mono">12.5%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[45%] h-full bg-purple-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Mecha Crown</span>
                      <span className="text-cyan-400 font-mono">1.8%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[10%] h-full bg-cyan-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLaunchStudio}
                className="w-full py-2.5 sleek-button text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Generate Collection</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Engineered for Generative Perfection
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Everything you need to craft high-value NFT collections without touching code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="studio-panel p-6 hover:border-indigo-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/80 flex items-center justify-center text-indigo-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Layer Compositor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drag-and-drop layer reordering, per-layer blend mode controls (multiply, screen, overlay), and real-time canvas canvas rendering.
              </p>
            </div>

            <div className="studio-panel p-6 hover:border-purple-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/80 flex items-center justify-center text-purple-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">DNA Uniqueness Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated DNA hashing prevents duplicate trait combinations across 10,000+ generated editions with configurable tolerance limits.
              </p>
            </div>

            <div className="studio-panel p-6 hover:border-cyan-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 mb-4">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Dual-Chain Exporter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate ready-to-deploy metadata standards for both Ethereum (ERC-721/1155) and Solana (Metaplex format) simultaneously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Grid */}
      <section id="showcase" className="py-20 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Pre-Loaded Demo Collections
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Explore pre-seeded generative collections available inside the Mintrix Demo account.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Cyberpunk Pixel Avatars",
                network: "Solana",
                layers: "6 Layers",
                elements: "72 Traits",
                color: "from-purple-600 to-indigo-600",
              },
              {
                title: "Galactic Space Explorers",
                network: "Ethereum",
                layers: "6 Layers",
                elements: "68 Traits",
                color: "from-blue-600 to-cyan-600",
              },
              {
                title: "Pixel Fantasy Quest",
                network: "Solana",
                layers: "6 Layers",
                elements: "64 Traits",
                color: "from-amber-600 to-rose-600",
              },
              {
                title: "3D Glassmorphic Badges",
                network: "Polygon",
                layers: "5 Layers",
                elements: "45 Traits",
                color: "from-emerald-600 to-teal-600",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="studio-panel p-5 flex flex-col justify-between group hover:border-indigo-500/50 transition-all cursor-pointer"
                onClick={handleTryDemo}
              >
                <div>
                  <div
                    className={`w-full h-32 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white mb-4 group-hover:scale-[1.02] transition-transform`}
                  >
                    <Cpu className="w-10 h-10 text-white/80" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>{item.network}</span>
                    <span>{item.layers}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h4>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{item.elements}</span>
                  <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Demo <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 border-t border-slate-800/80 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Start Generating Your NFT Collection Today
          </h2>
          <p className="mt-4 text-sm text-slate-400">
            Sign in to your Mintrix Studio workspace to build from scratch or test pre-loaded collections.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleLaunchStudio}
              className="sleek-button px-6 py-3 text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">Mintrix Studio</span>
          </div>
          <div>© {new Date().getFullYear()} Mintrix. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
