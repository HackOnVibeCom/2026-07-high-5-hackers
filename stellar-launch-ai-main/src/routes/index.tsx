import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Rocket,
  Zap,
  BarChart3,
  Target,
  Shield,
  Globe,
  Brain,
  ChevronRight,
} from "lucide-react";
import { useApp, useActiveWorkspace } from "../lib/store";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Interactive3DScene() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-280, 280], [25, -25]);
  const rotateY = useTransform(mouseXSpring, [-280, 280], [-25, 25]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className="perspective-container stay-dark relative h-[560px] w-full max-w-[560px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="preserve-3d-scene relative h-full w-full"
        style={{ rotateX, rotateY }}
      >
        {/* Base grid */}
        <div className="layer-grid absolute inset-6 rounded-3xl border border-white/5 bg-slate-900/40 shadow-2xl" />

        {/* Card: ASO Package */}
        <motion.div
          className="layer-card-1 absolute -left-4 top-12 w-64 rounded-2xl border border-white/10 bg-slate-950/85 p-5 shadow-2xl backdrop-blur-sm"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-400">
              Store Metadata
            </span>
          </div>
          <p className="mt-3 font-display text-sm font-semibold text-white">
            ASO Launch Package
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500 w-10">Title</span>
              <div className="h-2 flex-1 rounded-full bg-amber-500/50" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500 w-10">Sub</span>
              <div className="h-2 w-4/5 rounded-full bg-amber-500/30" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500 w-10">Keys</span>
              <div className="h-2 w-3/5 rounded-full bg-amber-500/20" />
            </div>
          </div>
          <div className="mt-4 flex gap-1.5">
            {["Reddit", "LinkedIn", "Twitter"].map((p) => (
              <span
                key={p}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] text-neutral-400"
              >
                {p}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Card: Health Score */}
        <motion.div
          className="layer-card-2 absolute right-0 top-6 w-52 rounded-2xl border border-white/10 bg-slate-950/85 p-5 shadow-2xl backdrop-blur-sm"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-400">
            Health Score
          </span>
          <div className="mt-3 flex items-center justify-center">
            <svg className="h-20 w-20" viewBox="0 0 36 36">
              <path
                strokeWidth="3"
                stroke="rgba(255,255,255,0.06)"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                strokeDasharray="78, 100"
                strokeWidth="3"
                strokeLinecap="round"
                stroke="#DE8C21"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: "78, 100" }}
                transition={{ duration: 2, delay: 1, ease: "easeOut" }}
              />
              <text
                x="18"
                y="20.5"
                textAnchor="middle"
                fill="white"
                fontSize="8"
                fontWeight="bold"
                fontFamily="var(--font-display)"
              >
                78
              </text>
            </svg>
          </div>
        </motion.div>

        {/* Card: Growth Analytics */}
        <motion.div
          className="absolute -right-2 bottom-16 w-64 rounded-2xl border border-white/10 bg-slate-950/85 p-5 shadow-2xl backdrop-blur-sm"
          animate={{ y: [0, -4, 0], x: [0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(90px)" }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-400">
              Growth Analytics
            </span>
            <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-400">
              +18.4%
            </span>
          </div>
          <div className="mt-4 flex items-end gap-1.5 h-16">
            {[28, 35, 42, 38, 55, 62, 78, 85].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-amber-600/80 to-amber-400/60"
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.08, ease: "easeOut" }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[9px] text-neutral-500">
            <span>Mon</span>
            <span>Today</span>
          </div>
        </motion.div>

        {/* Card: AI Recommendation */}
        <motion.div
          className="absolute -left-2 bottom-8 w-56 rounded-2xl border border-teal-500/20 bg-slate-950/85 p-4 shadow-2xl backdrop-blur-sm"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(120px)" }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-400">
              AI Advisor
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-neutral-300">
            "Your Reddit CTR is 3× higher than paid Meta. Shift 20% budget to organic community posts."
          </p>
          <div className="mt-2 flex gap-2">
            <span className="rounded bg-teal-500/15 px-1.5 py-0.5 text-[9px] text-teal-400">
              92% confidence
            </span>
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] text-amber-400">
              +15% CTR
            </span>
          </div>
        </motion.div>

        {/* Rocket Core */}
        <div className="layer-rocket absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="glow-pulse grid h-20 w-20 place-items-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 shadow-2xl shadow-amber-500/30"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Rocket className="h-10 w-10 text-white" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

const toneMap: Record<string, string> = {
  teal: "border-teal-200 bg-teal-50",
  amber: "border-amber-200 bg-amber-50",
  blue: "border-blue-200 bg-blue-50",
  rose: "border-rose-200 bg-rose-50",
};
const toneText: Record<string, string> = {
  teal: "text-teal-800",
  amber: "text-amber-800",
  blue: "text-blue-800",
  rose: "text-rose-800",
};

/* ─── Stagger Helpers ─── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const fadeScale = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ─── Feature Items ─── */
const features = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: "AI Growth Advisor™",
    desc: "Analyzes your metrics and tells you exactly what to do next — not just charts, but actions.",
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "Launch Health Score™",
    desc: "A real-time readiness index combining ASO quality, content freshness, and campaign execution.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Cross-Platform Analytics",
    desc: "Unified metrics from App Store, Play Store, Reddit, LinkedIn, Twitter, and Product Hunt.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Human-in-the-Loop",
    desc: "Every AI draft stays locked until you approve. No rogue publishing, ever.",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Community Discovery",
    desc: "AI identifies the exact subreddits, forums, and communities where your users live.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "One-Click ASO",
    desc: "Generate optimized App Store titles, subtitles, and keyword sets in seconds.",
  },
];

const stats = [
  { value: "10K+", label: "Users Launched" },
  { value: "94%", label: "ASO Accuracy" },
  { value: "3.2×", label: "Avg. Growth Lift" },
  { value: "<2s", label: "Generation Time" },
];

function Home() {
  const onboarded = useApp((s) => s.onboarded);
  const nav = useNavigate();
  const ws = useActiveWorkspace();
  const campaigns = useApp((s) => s.campaigns);

  const fetchDashboard = useApp((s) => s.fetchDashboard);
  const fetchRecommendations = useApp((s) => s.fetchRecommendations);
  const fetchHealthScore = useApp((s) => s.fetchHealthScore);
  const recommendations = useApp((s) => s.recommendations);
  const healthScore = useApp((s) => s.healthScore);
  const dashboardData = useApp((s) => s.dashboardData);

  useEffect(() => {
    if (onboarded) {
      fetchDashboard();
      fetchRecommendations();
      fetchHealthScore();
    }
  }, [onboarded, fetchDashboard, fetchRecommendations, fetchHealthScore]);

  /* ═══════════════════════════════════════════════════════════
     LANDING BOARD — shown before onboarding
     ═══════════════════════════════════════════════════════════ */
  if (!onboarded) {
    return (
      <div className="landing-board relative -mx-6 -mt-6 overflow-hidden">
        {/* ── Ambient Background Effects ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/8 blur-[120px]" />
          <div className="absolute top-60 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-500/6 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[500px] rounded-full bg-teal-500/5 blur-[100px]" />
        </div>

        {/* ════════════════════════════════════════════════
            SECTION 1: HERO
            ════════════════════════════════════════════════ */}
        <section className="relative mx-auto flex min-h-[92vh] max-w-7xl items-center px-6">
          <div className="grid w-full items-center gap-16 lg:grid-cols-12">
            {/* Left — Text Column */}
            <motion.div
              className="flex flex-col items-start lg:col-span-5"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-400"
              >
                <Sparkles className="h-3.5 w-3.5 glow-pulse" /> AI Growth OS
              </motion.span>

              <motion.h1
                variants={fadeUp}
                className="mt-8 font-display text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[4.2rem]"
              >
                Launch your app.
                <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  Scale with AI.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-md text-lg leading-relaxed text-neutral-400"
              >
                From zero to 10,000 users — LaunchPilot AI generates your ASO,
                writes your marketing copy, plans your campaigns, and tells you
                exactly what to do next.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4">
                <button
                  onClick={() => nav({ to: "/onboarding" })}
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-amber-500/25 transition-all hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <span className="text-xs text-neutral-500">No credit card required</span>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                variants={fadeUp}
                className="mt-12 flex items-center gap-6 border-t border-white/5 pt-8"
              >
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-[11px] text-neutral-500">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — Interactive 3D Dashboard Visual */}
            <motion.div
              className="relative hidden lg:col-span-7 lg:flex items-center justify-center"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            >
              <Interactive3DScene />
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            SECTION 2: FEATURES GRID
            ════════════════════════════════════════════════ */}
        <section className="relative mx-auto max-w-7xl px-6 py-32">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-6">
              Platform Capabilities
            </span>
            <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
                launch & grow
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-neutral-500">
              Six core capabilities that replace your entire growth stack.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeScale}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-7 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-amber-500/5"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-amber-500/5 blur-2xl transition-all group-hover:bg-amber-500/10" />
                <div className="relative">
                  <div className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/5 p-3 text-amber-400 transition-colors group-hover:border-amber-500/30 group-hover:bg-amber-500/10">
                    {f.icon}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════
            SECTION 3: HOW IT WORKS
            ════════════════════════════════════════════════ */}
        <section className="relative mx-auto max-w-7xl px-6 py-32">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
              Three steps to{" "}
              <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
                liftoff
              </span>
            </h2>
          </motion.div>

          <motion.div
            className="grid gap-8 lg:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {[
              {
                step: "01",
                title: "Describe your app",
                desc: "Complete a 2-minute onboarding. Tell us your app name, category, audience, and goals.",
                gradient: "from-amber-500/20 to-amber-600/5",
              },
              {
                step: "02",
                title: "AI generates everything",
                desc: "Store metadata, social copy, community targets, competitor analysis, and launch checklists — instantly.",
                gradient: "from-teal-500/20 to-teal-600/5",
              },
              {
                step: "03",
                title: "Approve, publish, grow",
                desc: "Review AI drafts, approve what you like, and watch your Growth Advisor optimize in real time.",
                gradient: "from-blue-500/20 to-blue-600/5",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-8"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${item.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative">
                  <span className="font-display text-5xl font-black text-white/5">{item.step}</span>
                  <h3 className="mt-4 font-display text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════
            SECTION 4: CTA
            ════════════════════════════════════════════════ */}
        <section className="relative mx-auto max-w-7xl px-6 py-32">
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-600/5 p-16 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-amber-500/15 blur-[80px]" />
            <h2 className="relative font-display text-4xl font-bold text-white sm:text-5xl">
              Ready to launch?
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-neutral-400">
              Join hundreds of indie developers and startups using LaunchPilot AI to
              accelerate their mobile app growth.
            </p>
            <button
              onClick={() => nav({ to: "/onboarding" })}
              className="relative mt-10 inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-amber-500/25 transition-all hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              Start Building Your Launch Plan
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </section>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     DASHBOARD — shown after onboarding
     ═══════════════════════════════════════════════════════════ */
  const running = campaigns.filter((c) => c.status === "running").length;
  const drafts = campaigns.filter((c) => c.status === "draft").length;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-10">
      {/* Dashboard Header */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">Growth report — {dateLabel}</p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-neutral-900">
              {greeting}. Here's what {ws?.name} should do next.
            </h1>
          </div>
          <Link
            to="/campaigns"
            className="hidden shrink-0 rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-100 sm:inline-block"
          >
            View all campaigns
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Health Score Card */}
          <motion.div
            className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm lg:col-span-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h3 className="text-sm font-medium text-neutral-500">Launch Health Score</h3>
            {healthScore ? (
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="font-display text-4xl font-semibold tracking-tight text-neutral-900">
                    {healthScore.score}%
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    {healthScore.score >= 80
                      ? "Healthy & ready to scale"
                      : healthScore.score >= 50
                        ? "Needs optimization"
                        : "Critical attention needed"}
                  </p>
                </div>
                <div className="relative h-16 w-16">
                  <svg className="h-full w-full" viewBox="0 0 36 36">
                    <path
                      className="text-neutral-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <motion.path
                      className="text-amber-500"
                      strokeDasharray={`${healthScore.score}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${healthScore.score}, 100` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-sm text-neutral-400">Loading health score...</div>
            )}

            {healthScore?.breakdown && (
              <div className="mt-4 border-t border-neutral-100 pt-3 space-y-2 text-[11px]">
                {Object.entries(healthScore.breakdown).map(([key, val]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-neutral-500 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="font-mono text-neutral-800">{val as number}%</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 lg:col-span-2">
            {[
              { label: "New installs (7d)", value: dashboardData ? String(dashboardData.installs) : "1,284", delta: "+18.2%", positive: true },
              { label: "Activation rate", value: dashboardData ? `${dashboardData.activationRate}%` : "42.6%", delta: "-2.1%", positive: false },
              { label: "Running campaigns", value: String(running), delta: `${drafts} drafts`, positive: false },
              { label: "Product Hunt rank", value: dashboardData ? dashboardData.productHuntRank : "#4", delta: "Top 5 today", positive: true },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
              >
                <MiniStat {...s} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Growth Advisor */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-amber-500 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">Growth Advisor</h2>
          <span className="ml-1 text-sm text-neutral-500">— ranked by impact this week</span>
        </div>
        <div className="grid gap-3">
          {recommendations.length > 0 ? (
            recommendations.map((i: any, idx: number) => {
              const isStudio =
                i.finding.toLowerCase().includes("screenshot") ||
                i.recommendation.toLowerCase().includes("studio");
              const to = isStudio ? "/studio" : "/campaigns";
              const actionLabel = isStudio ? "Optimize in Studio" : "Adjust Campaigns";
              return (
                <motion.div
                  key={i.id || idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.06 }}
                  className={`flex flex-col gap-4 rounded-xl border ${toneMap[i.tone || "teal"]} p-5 sm:flex-row sm:items-center`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/80 ${toneText[i.tone || "teal"]}`}
                      >
                        Finding
                      </span>
                      <p className={`text-sm font-semibold ${toneText[i.tone || "teal"]}`}>
                        {i.finding}
                      </p>
                    </div>
                    <p className="text-xs text-neutral-600 pl-0 sm:pl-16">
                      <strong className="text-neutral-700">Cause:</strong> {i.cause}
                    </p>
                    <p className="text-xs text-neutral-800 pl-0 sm:pl-16 font-medium">
                      <strong className="text-neutral-900">Recommendation:</strong>{" "}
                      {i.recommendation}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 pl-0 sm:pl-16">
                      <span className="rounded-full bg-white/60 px-2 py-0.5 font-mono text-[11px] text-neutral-700">
                        {Math.round((i.confidence || 0.8) * 100)}% confidence
                      </span>
                      <span className="rounded-full bg-white/60 px-2 py-0.5 font-mono text-[11px] text-neutral-700">
                        {i.expected_impact || i.impact}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={to}
                    className="shrink-0 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-100 self-start sm:self-center"
                  >
                    {actionLabel}
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
              Generating Growth Advisor insights...
            </div>
          )}
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section
        className="grid gap-3 sm:grid-cols-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <QuickCard
          icon={<Rocket className="h-4 w-4" />}
          title="Launch checklist"
          body="4 of 7 items ready for your Product Hunt push."
          to="/strategy"
        />
        <QuickCard
          icon={<Users className="h-4 w-4" />}
          title="Influencer shortlist"
          body="6 creators at 84%+ audience match."
          to="/discover"
        />
        <QuickCard
          icon={<TrendingUp className="h-4 w-4" />}
          title="Analytics"
          body="Reddit is out-performing paid Meta 3:1."
          to="/analytics"
        />
      </motion.section>
    </div>
  );
}

function MiniStat({
  label,
  value,
  delta,
  positive,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold text-neutral-900">{value}</div>
      <div
        className={`mt-1 inline-flex rounded px-1.5 py-0.5 font-mono text-[11px] ${
          positive ? "bg-teal-100 text-teal-800" : "bg-neutral-100 text-neutral-600"
        }`}
      >
        {delta}
      </div>
    </div>
  );
}

function QuickCard({
  icon,
  title,
  body,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-neutral-100 text-neutral-700 group-hover:bg-amber-50 group-hover:text-amber-800">
          {icon}
        </span>
        {title}
      </div>
      <p className="mt-2 text-sm text-neutral-600">{body}</p>
    </Link>
  );
}
