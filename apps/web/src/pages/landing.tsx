import { useSession } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  Globe,
  Layers,
  Moon,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  Wand2,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

// Animated GIF-like Edition Switcher Component
function AnimatedEditionCard({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 1600);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative rounded-xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-800 bg-slate-950">
      {images.map((img, i) => (
        <img
          key={img}
          src={img}
          alt={`${title} Edition #${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
          }`}
        />
      ))}

      {/* Live Animated Edition Badge */}
      <div className="absolute top-3 right-3 z-20 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-cyan-400 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-md">
        <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" style={{ animationDuration: "3s" }} />
        <span>Edition #0{index + 1}</span>
      </div>
    </div>
  );
}

export function LandingPage() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("all");
  const [heroEditionIndex, setHeroEditionIndex] = useState(0);

  const heroImages = [
    "/samples/cyberpunk_ed1.png",
    "/samples/cyberpunk_ed2.png",
    "/samples/cyberpunk_ed3.png",
    "/samples/cyberpunk_ed4.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroEditionIndex((prev) => (prev + 1) % heroImages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleLaunchStudio = () => {
    if (session?.user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  // EXACTLY 5 requested collections: Hashlips Demo, Cyberpunk Pixel Avatar, Galactic Space Explorer, Pixel Crypto Pet, Pixel Fantasy Quest
  const seedCollections = [
    {
      id: "col-hashlips",
      title: "Hashlips Demo",
      network: "Ethereum ERC-721",
      layers: "7 Layers",
      elements: "100 Traits",
      uniqueness: "100%",
      images: [
        "/samples/hashlips_ed1.png",
        "/samples/hashlips_ed2.png",
        "/samples/hashlips_ed3.png",
        "/samples/hashlips_ed4.png",
      ],
      category: "hashlips",
    },
    {
      id: "col-cyberpunk",
      title: "Cyberpunk Pixel Avatar",
      network: "Solana Metaplex",
      layers: "6 Layers",
      elements: "72 Traits",
      uniqueness: "100%",
      images: [
        "/samples/cyberpunk_ed1.png",
        "/samples/cyberpunk_ed2.png",
        "/samples/cyberpunk_ed3.png",
        "/samples/cyberpunk_ed4.png",
      ],
      category: "cyberpunk",
    },
    {
      id: "col-space",
      title: "Galactic Space Explorer",
      network: "Ethereum ERC-721",
      layers: "6 Layers",
      elements: "68 Traits",
      uniqueness: "100%",
      images: [
        "/samples/space_ed1.png",
        "/samples/space_ed2.png",
        "/samples/space_ed3.png",
        "/samples/space_ed4.png",
      ],
      category: "space",
    },
    {
      id: "col-pets",
      title: "Pixel Crypto Pet",
      network: "Ethereum ERC-721",
      layers: "6 Layers",
      elements: "60 Traits",
      uniqueness: "100%",
      images: [
        "/samples/pets_ed1.png",
        "/samples/pets_ed2.png",
        "/samples/pets_ed3.png",
        "/samples/pets_ed4.png",
      ],
      category: "pets",
    },
    {
      id: "col-fantasy",
      title: "Pixel Fantasy Quest",
      network: "Solana Metaplex",
      layers: "6 Layers",
      elements: "64 Traits",
      uniqueness: "99.9%",
      images: [
        "/samples/fantasy_ed1.png",
        "/samples/fantasy_ed2.png",
        "/samples/fantasy_ed3.png",
        "/samples/fantasy_ed4.png",
      ],
      category: "fantasy",
    },
  ];

  const filteredCollections =
    activeCategory === "all"
      ? seedCollections
      : seedCollections.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0919] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500/20 relative overflow-hidden transition-colors duration-200">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0c0919]/90 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="Mintrix Logo" className="w-8 h-8 rounded-xl object-cover shadow-xs group-hover:scale-105 transition-transform" />
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Mintrix Studio
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            <a href="#hero" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Studio
            </a>
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Capabilities
            </a>
            <a href="#showcase" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Collections
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Workflow
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            >
              {theme === "light" ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {session?.user ? (
              <Link
                to="/dashboard"
                className="sleek-button px-4 py-2 text-xs font-bold uppercase rounded-xl flex items-center gap-1.5 shadow-xs whitespace-nowrap"
              >
                <span>Studio Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/auth"
                className="sleek-button px-4 py-2 text-xs font-bold uppercase rounded-xl flex items-center gap-1.5 shadow-xs whitespace-nowrap"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Animated Live Render Stage */}
      <section id="hero" className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mintrix Engine v2.0 • Dual ETH & Solana Metadata Export</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.08]">
          Generate <span className="text-indigo-600 dark:text-indigo-400">10,000+ NFT Collections</span> with Precision
        </h1>

        <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          The high-performance studio for digital artists and NFT creators. Assemble layer trait stacks, configure custom rarity rules, preview DNA uniqueness live, and export production assets.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
          <button
            onClick={handleLaunchStudio}
            className="sleek-button w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
          >
            <span>Launch Mintrix Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#how-it-works"
            className="secondary-button w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>How It Works</span>
          </a>
        </div>

        {/* Feature Checkmarks */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Zero Duplicates Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
            <span>ETH ERC-721 & Solana Metaplex</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
            <span>Layer Blend Modes & GIF Encoder</span>
          </div>
        </div>

        {/* Studio Canvas UI Mockup with Cycling Edition Render Animation */}
        <div className="mt-12 w-full p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#130f26] border border-slate-200 dark:border-slate-800 shadow-2xl relative text-left">
          <div className="px-4 py-2.5 bg-slate-100 dark:bg-[#0c0919] rounded-xl border border-slate-200 dark:border-slate-800 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">Mintrix Studio Workspace v2.0</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                ● Live Engine
              </span>
              <span>10,000 / 10,000 Editions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Configured Layers List */}
            <div className="lg:col-span-4 bg-slate-50 dark:bg-[#0f0b21] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Configured Trait Stack</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">6 Layers</span>
              </div>
              {[
                { name: "Backgrounds", count: "12 traits", active: false },
                { name: "Base Avatar Body", count: "8 traits", active: false },
                { name: "Visors & Helmets", count: "15 traits", active: true },
                { name: "Mouth Accessories", count: "10 traits", active: false },
                { name: "Headwear & Crowns", count: "14 traits", active: false },
                { name: "Aura Effects", count: "6 traits", active: false },
              ].map((layer) => (
                <div
                  key={layer.name}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                    layer.active
                      ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-white font-bold"
                      : "bg-white dark:bg-[#15102a] border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className={`w-3.5 h-3.5 ${layer.active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                    <span>{layer.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{layer.count}</span>
                </div>
              ))}
            </div>

            {/* Middle: Live Animated Canvas Stage showing Cycling Composited Editions */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#0f0b21] rounded-xl border border-slate-200 dark:border-slate-800/80 relative overflow-hidden min-h-[280px]">
              <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-2xl bg-slate-950 border border-indigo-500/30 relative overflow-hidden shadow-xl">
                {heroImages.map((img, i) => (
                  <img
                    key={img}
                    src={img}
                    alt={`Hero Render Edition #${i + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                      i === heroEditionIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
                    }`}
                  />
                ))}

                <div className="absolute top-3 right-3 z-20 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-cyan-400 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-md">
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" style={{ animationDuration: "3s" }} />
                  <span>Edition #0{heroEditionIndex + 1}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="px-2.5 py-1 bg-white dark:bg-[#181235] border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 rounded-md text-[11px] font-mono font-bold">
                  DNA: 8a4f91b2...
                </span>
                <span className="px-2.5 py-1 bg-white dark:bg-[#181235] border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 rounded-md text-[11px] font-mono font-bold">
                  ● 100% Unique
                </span>
              </div>
            </div>

            {/* Right: Live Rarity Matrix Breakdown */}
            <div className="lg:col-span-3 bg-slate-50 dark:bg-[#0f0b21] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Live Rarity Matrix</div>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>Laser Visor Cyan</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">4.2%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[20%] h-full bg-indigo-600 rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>Cyber City Night</span>
                      <span className="text-purple-600 dark:text-purple-400 font-mono font-bold">12.5%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[45%] h-full bg-purple-600 rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>Bionic Mohawk</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">1.8%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[10%] h-full bg-cyan-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLaunchStudio}
                className="w-full px-3 py-2.5 sleek-button text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap overflow-hidden"
              >
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Launch Studio</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Ticker Strip */}
      <section className="py-6 border-y border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0a0717]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>Ethereum ERC-721</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-500" />
              <span>Solana Metaplex</span>
            </div>
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-purple-500" />
              <span>Polygon Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>IPFS & Arweave Metadata</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>HTML5 Canvas Compositor</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Generative Perfection
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Everything you need to craft high-value NFT collections without touching code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#130e28] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Layer Compositor</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Drag-and-drop layer reordering, per-layer blend mode controls (Multiply, Screen, Overlay), and real-time canvas rendering.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#130e28] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">DNA Uniqueness Engine</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Automated DNA hashing prevents duplicate trait combinations across 10,000+ generated editions with configurable tolerance limits.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#130e28] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Dual-Chain Exporter</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate ready-to-deploy metadata standards for both Ethereum (ERC-721/1155) and Solana (Metaplex format) simultaneously.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Seed Collection Showcase (Exactly 5 Collections) */}
      <section id="showcase" className="py-20 border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-[#0a0717]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Featured Seed Collections
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Live animated preview of composited editions generated from actual seed layer traits.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Collections" },
                { id: "hashlips", label: "Hashlips Demo" },
                { id: "cyberpunk", label: "Cyberpunk" },
                { id: "space", label: "Space Explorer" },
                { id: "pets", label: "Crypto Pets" },
                { id: "fantasy", label: "Fantasy Quest" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeCategory === tab.id
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((col) => (
              <div
                key={col.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#130e28] border border-slate-200 dark:border-slate-800 shadow-xs group hover:border-indigo-500 transition-all cursor-pointer flex flex-col justify-between"
                onClick={handleLaunchStudio}
              >
                <div>
                  <div className="mb-4">
                    <AnimatedEditionCard images={col.images} title={col.title} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                    <span>{col.layers}</span>
                    <span>{col.elements}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {col.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Uniqueness {col.uniqueness}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Open Collection</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Mintrix Works Workflow */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How Mintrix Workflow Works
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Three simple steps from trait artwork uploads to 10,000+ generated NFT editions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#130e28] border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              1. Upload & Order Trait Layers
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Organize background, character body, clothing, and accessories. Set per-layer blend modes and stack ordering.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#130e28] border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              2. Configure Weighted Rarities
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Configure rarity weights using filename syntax (e.g. <code className="font-mono text-indigo-600 dark:text-indigo-400">Visor#10.png</code>) or visual sliders.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#130e28] border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              3. Batch Generate & Export
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Run the engine to generate artwork zip files and metadata JSONs ready for OpenSea, MagicEden, and launchpads.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-[#090616]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Start Generating Your NFT Collection Today
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Sign in to your Mintrix Studio workspace to build from scratch or test pre-loaded collections.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLaunchStudio}
              className="sleek-button px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs whitespace-nowrap"
            >
              <span>Launch Studio Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070512] text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Mintrix Logo" className="w-5 h-5 rounded object-cover" />
            <span className="font-bold text-slate-900 dark:text-white">Mintrix Studio</span>
          </div>
          <div>© {new Date().getFullYear()} Mintrix Engine. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
