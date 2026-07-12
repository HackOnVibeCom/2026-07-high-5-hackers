import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  MessageSquare,
  Plus,
  Compass,
  Search,
  Filter,
  TrendingUp,
  Activity,
  ArrowRight,
  Target,
  Sparkles,
  Info,
  CheckCircle2,
  X,
  Eye,
  Calendar,
  AlertTriangle,
  Award,
  Sliders,
  Play,
  HelpCircle,
  ChevronRight,
  BookOpen,
  ArrowDown,
  ArrowDownRight
} from "lucide-react";
import { toast } from "sonner";
import { useApp, useActiveWorkspace } from "../lib/store";

export const Route = createFileRoute("/discover")({
  component: DiscoverHub,
});

type DiscoverSubTab = "directory-communities" | "directory-influencers";

// Mock Platforms dataset for Heatmap
interface PlatformMetrics {
  name: string;
  audienceMatch: number;
  competition: number; // 0-100 (lower is better, shown inversely)
  engagement: number;
  downloads: number;
  conversionProb: number;
  difficulty: number;
  score: number;
  reason: string;
}

const PLATFORMS_HEATMAP: PlatformMetrics[] = [
  { name: "Reddit", audienceMatch: 95, competition: 40, engagement: 88, downloads: 350, conversionProb: 84, difficulty: 45, score: 94, reason: "r/productivity and r/getdisciplined have direct user overlap. Non-salesy storytelling yields 12%+ installs conversion." },
  { name: "Product Hunt", audienceMatch: 90, competition: 70, engagement: 94, downloads: 850, conversionProb: 75, difficulty: 80, score: 92, reason: "Excellent validation launchpad. Highly saturated but drives immediate global tech traffic spikes." },
  { name: "Instagram", audienceMatch: 85, competition: 55, engagement: 79, downloads: 420, conversionProb: 68, difficulty: 50, score: 86, reason: "Visual reels focused on wellness/routine aesthetics correlate with strong CTR." },
  { name: "LinkedIn", audienceMatch: 75, competition: 30, engagement: 82, downloads: 220, conversionProb: 78, difficulty: 60, score: 84, reason: "Growth hacking, startup transparency posts, and creator routines see high reach amplification." },
  { name: "TikTok", audienceMatch: 80, competition: 60, engagement: 85, downloads: 580, conversionProb: 65, difficulty: 55, score: 82, reason: "High viral coefficient but requires dynamic fast-paced video reviews." },
  { name: "Hacker News", audienceMatch: 70, competition: 80, engagement: 90, downloads: 450, conversionProb: 55, difficulty: 90, score: 78, reason: "Hard to trend, highly critical, but Show HN posts drive direct tech early adopters." },
  { name: "Indie Hackers", audienceMatch: 75, competition: 20, engagement: 72, downloads: 150, conversionProb: 70, difficulty: 30, score: 76, reason: "Friendly community of makers. Good for feedback, minor initial download boosts." },
  { name: "Facebook", audienceMatch: 50, competition: 65, engagement: 45, downloads: 90, conversionProb: 40, difficulty: 40, score: 55, reason: "Low organic reach. Paid acquisition works, but organic yields minimal return." }
];

// Timeline actions
const TIMELINE_TASKS = [
  { day: "Today", task: "Publish Reddit founder story", priority: "Critical", downloads: 350, effort: "Medium (1 hr)", confidence: 91 },
  { day: "Tomorrow", task: "Warm up Product Hunt hunters", priority: "High", downloads: 850, effort: "High (3 hrs)", confidence: 85 },
  { day: "Day 3", task: "Pitch TikTok creator Devon Park", priority: "High", downloads: 450, effort: "Low (20 min)", confidence: 88 },
  { day: "Day 5", task: "Publish LinkedIn transparency logs", priority: "Medium", downloads: 120, effort: "Medium (45 min)", confidence: 80 },
  { day: "Day 7", task: "Refine App Store keyword index", priority: "High", downloads: 280, effort: "High (2 hrs)", confidence: 94 }
];

// Recommendation Feed initial cards
const INITIAL_FEED = [
  { id: "feed-1", title: "Reddit r/productivity Traffic Spike", reason: "Sunday evening traffic is up 18% in your category tags.", impact: "+250 organic installs", confidence: 92, action: "Publish your 'shame loop' story draft to r/productivity", type: "Reddit" },
  { id: "feed-2", title: "Optimal Creator Match Spotted", reason: "Micro-influencer @mayabuilds fits your wellness niche with 92% audience match.", impact: "+450 downloads", confidence: 89, action: "Send outreach pitch proposing visual story integration", type: "Influencer" },
  { id: "feed-3", title: "Competitor Vulnerability Detected", reason: "Competitor 'Streaks' has updated their ASO keywords, leaving 'routine tracking' vacant.", impact: "+15% keyword search CTR", confidence: 84, action: "Incorporate 'routine tracking' in ASO description", type: "ASO" },
  { id: "feed-4", title: "Product Hunt Mid-Week Opening", reason: "Product Hunt launcher competition forecast drops on Wednesday.", impact: "High Frontpage Probability", confidence: 78, action: "Schedule your Product Hunt Launch Week campaign for Wednesday", type: "Launch" }
];

function DiscoverHub() {
  const [subTab, setSubTab] = useState<DiscoverSubTab>("directory-communities");
  const [drawerOpen, setDrawerOpen] = useState<any | null>(null);
  const [contactOpen, setContactOpen] = useState<any | null>(null);

  // Recommendation engine state
  const {
    appliedRecommendations,
    ignoredRecommendations,
    savedRecommendations,
    applyRecommendation,
    ignoreRecommendation,
    saveRecommendation,
    socialAccounts,
    toggleSocialAccount,
    campaigns,
    studioDrafts
  } = useApp();

  const ws = useActiveWorkspace();
  const communities = useApp((s) => s.communitiesData);
  const influencers = useApp((s) => s.influencersData);

  const fetchCommunities = useApp((s) => s.fetchCommunities);
  const fetchInfluencers = useApp((s) => s.fetchInfluencers);

  useEffect(() => {
    fetchCommunities();
    fetchInfluencers();
  }, [fetchCommunities, fetchInfluencers]);

  // AI What-If Simulator state variables
  const [simBudget, setSimBudget] = useState(250);
  const [phFirst, setPhFirst] = useState(false);
  const [redditOnly, setRedditOnly] = useState(false);
  const [delayLaunch, setDelayLaunch] = useState(false);

  // Calculate What-If outputs dynamically
  const runWhatIfSimulation = () => {
    let installs = 450;
    let ctr = 3.2;
    let reach = 120000;
    let risk = "Medium";
    let score = 72;

    // Budget effect
    if (simBudget > 0) {
      installs += Math.round((simBudget / 100) * 120);
      ctr += parseFloat(((simBudget / 500) * 0.8).toFixed(1));
      reach += Math.round((simBudget / 200) * 45000);
      score += Math.round(simBudget / 300);
    }

    if (redditOnly) {
      installs = Math.round(installs * 0.7);
      reach = Math.round(reach * 0.45);
      ctr = parseFloat((ctr * 1.35).toFixed(1)); // Reddit has high CTR but smaller reach compared to global multi-channel
      risk = "Low (Highly Targeted)";
      score -= 5;
    }

    if (phFirst) {
      installs += 400;
      reach += 180000;
      ctr = parseFloat((ctr * 1.15).toFixed(1));
      score += 10;
      risk = "High (Vulnerable to launch timing)";
    }

    if (delayLaunch) {
      installs = Math.round(installs * 1.15); // more ASO prep
      score += 5;
      risk = "Low (Highly prepared)";
    }

    // Caps
    score = Math.min(100, Math.max(30, score));
    ctr = parseFloat(Math.min(9.5, Math.max(1.5, ctr)).toFixed(1));

    return { installs, ctr, reach, risk, score };
  };

  const simResult = runWhatIfSimulation();

  // AI Discovery Chat state variables
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: `Hi! I am your AI Discovery Advisor. Ask me anything about communities, creator partnerships, and marketing ROI benchmarks for ${ws.name}.` }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleChatSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { role: "user", text: userText }]);
    setChatInput("");

    // Simulate AI response based on Discover data
    setTimeout(() => {
      let reply = "";
      const textNorm = userText.toLowerCase();

      if (textNorm.includes("reddit") || textNorm.includes("productivity")) {
        reply = `r/productivity is your strongest community vector with a 92% audience match. We forecast +280 downloads from a narrative founder story there, ideally published Sunday evening PST.`;
      } else if (textNorm.includes("creators") || textNorm.includes("influencer") || textNorm.includes("roi")) {
        reply = `Devon Park (@devonpark on TikTok) has the highest projected ROI (2.6x) and will yield around +1,350 downloads for a campaign budget of $1,400.`;
      } else if (textNorm.includes("where should i launch") || textNorm.includes("first")) {
        reply = `You should launch on Product Hunt first if your ASO score is high, as it yields the highest reach (+850 expected installs). Make sure to secure hunter upvotes beforehand.`;
      } else {
        reply = `Based on your category (${ws.category}), I recommend prioritizing targeted Reddit stories followed by an Instagram Reels campaign with Maya Okafor to optimize initial installs CTR.`;
      }

      setChatMessages(prev => [...prev, { role: "ai", text: reply }]);
    }, 800);
  };

  // Recommendation engine functions
  const handleApplyRec = (id: string, actionText: string) => {
    applyRecommendation(id);
    toast.success("Applied Growth Opportunity", {
      description: `Task: '${actionText}' is now added to strategy timelines.`,
    });
  };

  // Filter listings for the directory tab
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCommunities = communities.filter((c: any) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInfluencers = influencers.filter((i: any) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Compass className="h-4 w-4" />
          </div>
          <p className="text-sm text-neutral-500">Discover OS</p>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-900">
          AI Growth Intelligence Center
        </h1>
        <p className="mt-1 text-sm text-neutral-600 max-w-xl">
          Continuous AI intelligence identifying optimal launch channels, creator ROI projections, competitor analytics, and what-if marketing forecasts.
        </p>
      </motion.header>

      {/* 14. Executive Summary Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-950 to-neutral-900 p-6 flex flex-col sm:flex-row items-center justify-between shadow-xl shadow-teal-500/5 relative overflow-hidden"
      >
        {/* Background glow overlay */}
        <div className="absolute right-0 top-0 h-48 w-48 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 border border-teal-500/30 px-3 py-1 text-xs font-bold text-teal-400">
            <Sparkles className="h-3.5 w-3.5" /> Today's Growth Intelligence Summary
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
            Your highest growth opportunity today is <span className="text-teal-400">Reddit r/productivity</span>.
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Organic storytelling in niche productivity forums is yielding +12% conversion rates this week. Recommend publishing your completed ASO launch story draft between 9 AM and 11 AM PST for optimal upvote reach.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
            <div>
              <span className="text-neutral-500 font-semibold block">Estimated Reach</span>
              <span className="text-white font-mono font-bold text-sm">250,000 users</span>
            </div>
            <div>
              <span className="text-neutral-500 font-semibold block">Expected Installs</span>
              <span className="text-teal-400 font-mono font-bold text-sm">+1,400 downloads</span>
            </div>
            <div>
              <span className="text-neutral-500 font-semibold block">AI Confidence</span>
              <span className="text-white font-mono font-bold text-sm">91%</span>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-0 sm:pl-6 shrink-0 flex flex-col gap-3">
          <Link
            to="/studio"
            className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3.5 text-xs font-bold text-white text-center hover:scale-[1.03] transition shadow-lg shadow-amber-500/25"
          >
            Review ASO story draft
          </Link>
          <button
            onClick={() => setChatOpen(true)}
            className="rounded-xl border border-neutral-700 bg-neutral-900/60 px-5 py-3 text-xs font-semibold text-neutral-300 text-center hover:bg-neutral-800 transition"
          >
            Ask growth advisor
          </button>
        </div>
      </motion.section>

      {/* Grid: Heatmap + Timeline */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 1. Opportunity Heatmap Table */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">AI Platform Opportunity Heatmap</h3>
              <p className="text-[11px] text-neutral-500">Cross-channel growth vector scores.</p>
            </div>
            <span className="bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded text-[10px] font-mono animate-pulse">
              Reddit: Top Pick
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-neutral-400 font-semibold">
                  <th className="py-2.5">Platform</th>
                  <th className="py-2.5 text-center">Match</th>
                  <th className="py-2.5 text-center">Competition</th>
                  <th className="py-2.5 text-center">Downloads</th>
                  <th className="py-2.5 text-center">Conv. %</th>
                  <th className="py-2.5 text-center">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {PLATFORMS_HEATMAP.map((p) => {
                  const isTop = p.name === "Reddit";
                  return (
                    <tr
                      key={p.name}
                      onClick={() => setDrawerOpen({ type: "heatmap", data: p })}
                      className={`hover:bg-neutral-50 cursor-pointer transition ${isTop ? "bg-teal-50/20 font-bold" : ""}`}
                    >
                      <td className="py-3 flex items-center gap-1.5 text-neutral-800">
                        {p.name} {isTop && <Sparkles className="h-3 w-3 text-teal-600 animate-spin" />}
                      </td>
                      <td className="py-3 text-center font-mono">{p.audienceMatch}%</td>
                      <td className="py-3 text-center text-neutral-500 font-mono">{p.competition}%</td>
                      <td className="py-3 text-center font-mono text-neutral-700">+{p.downloads}</td>
                      <td className="py-3 text-center font-mono">{p.conversionProb}%</td>
                      <td className="py-3 text-center font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded ${
                          p.score >= 90 ? "bg-teal-100 text-teal-800" : p.score >= 75 ? "bg-amber-100 text-amber-800" : "bg-neutral-100 text-neutral-600"
                        }`}>
                          {p.score}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Growth Opportunity Timeline */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Recommended Marketing Timeline</h3>
            <p className="text-[11px] text-neutral-500">Suggested launch week actions.</p>
          </div>

          <div className="relative border-l border-neutral-100 pl-4 space-y-4 ml-1">
            {TIMELINE_TASKS.map((t, idx) => (
              <div key={idx} className="relative text-xs">
                {/* Dot */}
                <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-amber-500 border-2 border-white ring-4 ring-amber-500/10" />
                
                <span className="text-[10px] text-neutral-400 font-bold font-mono uppercase block">{t.day}</span>
                <span className="font-bold text-neutral-800 block mt-0.5">{t.task}</span>
                
                <div className="flex gap-2 mt-1.5 text-[9px] font-mono text-neutral-500">
                  <span className="bg-neutral-100 px-1.5 py-0.5 rounded">{t.priority}</span>
                  <span className="bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-bold">+{t.downloads} installs</span>
                  <span className="bg-neutral-100 px-1.5 py-0.5 rounded">{t.effort}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: What-If + Gap Analysis */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 3. AI What-If Simulator */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">AI What-If Launch Simulator</h3>
            <p className="text-[11px] text-neutral-500">Forecast results from strategic changes.</p>
          </div>

          {/* Controls */}
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-neutral-500">
                <span>Influencer Sponsorships</span>
                <span className="font-mono text-neutral-800">${simBudget}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="100"
                value={simBudget}
                onChange={(e) => setSimBudget(parseInt(e.target.value))}
                className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold">Strategic Adjustments</span>
              
              {[
                { checked: phFirst, setter: setPhFirst, label: "Launch Product Hunt wave first" },
                { checked: redditOnly, setter: setRedditOnly, label: "Only deploy Reddit organic story" },
                { checked: delayLaunch, setter: setDelayLaunch, label: "Delay launch 1 week for ASO prep" }
              ].map((opt, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer text-neutral-700">
                  <input
                    type="checkbox"
                    checked={opt.checked}
                    onChange={(e) => opt.setter(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Results Comparison Grid */}
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase">Simulated downloads</span>
              <span className="text-teal-600 font-bold font-mono text-sm">+{simResult.installs}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase">Simulated CTR</span>
              <span className="text-neutral-800 font-bold font-mono text-sm">{simResult.ctr}%</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase">Audience Reach</span>
              <span className="text-neutral-800 font-bold font-mono text-sm">{simResult.reach.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase">Growth Index</span>
              <span className="text-amber-500 font-bold font-mono text-sm">{simResult.score}%</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-neutral-200">
              <span className="text-neutral-500 block text-[9px] uppercase">Risk Level</span>
              <span className="text-neutral-800 font-semibold font-mono">{simResult.risk}</span>
            </div>
          </div>
        </div>

        {/* 4. Growth Gap Analysis Widget */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Launch Gap Analysis</h3>
            <p className="text-[11px] text-neutral-500">Current strategy vs optimal benchmark.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 text-xs">
            {/* Score Comparison */}
            <div className="space-y-3">
              <span className="text-neutral-500 font-semibold block uppercase text-[10px]">Strategic Readiness Index</span>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-600">Current Readiness Score</span>
                  <span className="font-bold text-amber-500 font-mono">68%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: "68%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-600">Optimal Readiness Index</span>
                  <span className="font-bold text-teal-600 font-mono">94%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-100 animate-pulse">
                  <div className="h-full rounded-full bg-teal-500" style={{ width: "94%" }} />
                </div>
              </div>
            </div>

            {/* Gap List */}
            <div className="space-y-2.5">
              <span className="text-neutral-500 font-semibold block uppercase text-[10px]">Identified Gaps</span>
              
              {[
                { label: "Missing Communities", val: "Indie Hackers, Hacker News", tone: "rose" },
                { label: "Missing Influencers", val: "TikTok sponsorships unscheduled", tone: "amber" },
                { label: "ASO Keyword Gaps", val: "Missing terms: 'routine', 'forgive'", tone: "rose" },
                { label: "Expected Improvement", val: "+35% installs lift if resolved", tone: "teal" }
              ].map((gap, idx) => (
                <div key={idx} className="flex justify-between items-start border-b border-neutral-100 pb-1.5">
                  <span className="text-neutral-700 font-medium">{gap.label}</span>
                  <span className={`font-semibold font-mono text-[10px] text-right ${
                    gap.tone === "rose" ? "text-rose-500" : gap.tone === "teal" ? "text-teal-600" : "text-amber-500"
                  }`}>{gap.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-end">
            <Link
              to="/strategy"
              className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1"
            >
              Optimize Launch Checklist <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 10. Interactive Growth Map Node Chart */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4 overflow-hidden"
      >
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Ecosystem Interactive Growth Map</h3>
          <p className="text-[11px] text-neutral-500">Visual mapping of targeted launch conversions.</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100 text-xs">
          {/* Node 1: App */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-center shrink-0 w-32 shadow-sm">
            <span className="text-neutral-400 block text-[9px] uppercase font-bold">App</span>
            <span className="font-bold text-neutral-800 block mt-0.5">{ws.name}</span>
          </div>

          <ChevronRight className="h-5 w-5 text-neutral-300 hidden md:block" />

          {/* Node 2: Audience */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-center shrink-0 w-36 shadow-sm">
            <span className="text-neutral-400 block text-[9px] uppercase font-bold">Target Audience</span>
            <span className="font-bold text-neutral-800 block mt-0.5">Wellness Seekers</span>
          </div>

          <ChevronRight className="h-5 w-5 text-neutral-300 hidden md:block" />

          {/* Node 3: Communities */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-center shrink-0 w-36 shadow-sm">
            <span className="text-neutral-400 block text-[9px] uppercase font-bold">Niche Communities</span>
            <span className="font-bold text-neutral-800 block mt-0.5">r/productivity</span>
          </div>

          <ChevronRight className="h-5 w-5 text-neutral-300 hidden md:block" />

          {/* Node 4: Influencers */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-center shrink-0 w-36 shadow-sm">
            <span className="text-neutral-400 block text-[9px] uppercase font-bold">Micro-creators</span>
            <span className="font-bold text-neutral-800 block mt-0.5">Maya Okafor</span>
          </div>

          <ChevronRight className="h-5 w-5 text-neutral-300 hidden md:block" />

          {/* Node 5: Outcomes */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-center shrink-0 w-36 shadow-sm">
            <span className="text-teal-600 block text-[9px] uppercase font-bold">Est. Downloads</span>
            <span className="font-bold text-teal-700 block mt-0.5 font-mono">+1,400 downloads</span>
          </div>
        </div>
      </motion.section>

      {/* 9. AI Opportunity Feed */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">AI Growth Opportunity Feed</h3>
          <p className="text-[11px] text-neutral-500">Live recommendation cards generated from diagnostic signals.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {INITIAL_FEED.filter(c => !ignoredRecommendations.includes(c.id)).map((c) => {
            const isApplied = appliedRecommendations.includes(c.id);
            const isSaved = savedRecommendations.includes(c.id);
            return (
              <motion.div
                key={c.id}
                layoutId={c.id}
                className={`rounded-xl border p-5 flex flex-col justify-between transition bg-white ${
                  isApplied ? "border-teal-200 bg-teal-50/10" : "border-neutral-200"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">
                        {c.type} Recommendation
                      </span>
                      <h4 className="font-bold text-neutral-800 text-sm mt-2">{c.title}</h4>
                    </div>
                    <span className="text-neutral-500 font-mono text-[10px]">{c.confidence}% confidence</span>
                  </div>

                  <p className="text-xs text-neutral-600 mt-2.5">
                    <strong>Cause:</strong> {c.reason}
                  </p>
                  <p className="text-xs text-neutral-800 mt-1 font-semibold">
                    <strong>Expected Impact:</strong> {c.impact}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      saveRecommendation(c.id);
                      toast(isSaved ? "Unsaved Recommendation" : "Saved Recommendation", {
                        description: `Card updated in saved list.`
                      });
                    }}
                    className={`text-neutral-600 hover:text-amber-500 font-semibold ${isSaved ? "text-amber-500" : ""}`}
                  >
                    {isSaved ? "Saved" : "Save for later"}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => ignoreRecommendation(c.id)}
                      className="text-neutral-400 hover:text-rose-500 font-semibold px-2 py-1"
                    >
                      Ignore
                    </button>
                    <button
                      disabled={isApplied}
                      onClick={() => handleApplyRec(c.id, c.action)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                        isApplied 
                          ? "bg-teal-50 text-teal-700 cursor-default" 
                          : "bg-amber-500 text-white hover:bg-amber-600"
                      }`}
                    >
                      {isApplied ? "Applied" : "Apply suggestion"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Directory Section (Tabs for Communities/Influencers) */}
      <section className="space-y-4 pt-6 border-t border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Ecosystem Directories</h3>
            <p className="text-[11px] text-neutral-500">Search and browse individual community assets and creator databases.</p>
          </div>

          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setSubTab("directory-communities")}
              className={`px-3 py-1.5 rounded-lg border transition ${
                subTab === "directory-communities" ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-700 border-neutral-200"
              }`}
            >
              Communities ({filteredCommunities.length})
            </button>
            <button
              onClick={() => setSubTab("directory-influencers")}
              className={`px-3 py-1.5 rounded-lg border transition ${
                subTab === "directory-influencers" ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-700 border-neutral-200"
              }`}
            >
              Creators ({filteredInfluencers.length})
            </button>
          </div>
        </div>

        {/* Directory Listings */}
        {subTab === "directory-communities" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCommunities.map((c: any) => (
              <div key={c.name} className="rounded-xl border border-neutral-200 bg-white p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded font-mono">{c.platform}</span>
                  <h4 className="font-bold text-neutral-800 text-xs mt-1.5">{c.name}</h4>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">{c.description}</p>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex justify-between items-center mt-4">
                  <span className="font-mono text-[10px] text-neutral-700">{c.size}</span>
                  <button
                    onClick={() => setDrawerOpen({ type: "community", data: c })}
                    className="text-[11px] text-amber-500 font-semibold hover:underline"
                  >
                    View intelligence &gt;
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInfluencers.map((i: any) => (
              <div key={i.handle} className="rounded-xl border border-neutral-200 bg-white p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono">{i.platform}</span>
                  <h4 className="font-bold text-neutral-800 text-xs mt-1.5">{i.name}</h4>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">{i.description}</p>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex justify-between items-center mt-4">
                  <span className="font-mono text-[10px] text-neutral-700">{i.followers} followers</span>
                  <button
                    onClick={() => setDrawerOpen({ type: "influencer", data: i })}
                    className="text-[11px] text-amber-500 font-semibold hover:underline"
                  >
                    View intelligence &gt;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Slide-out Drawer Panel (Enhanced Intelligence Metrics) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(null)}
              className="fixed inset-0 z-40 bg-neutral-900"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[440px] bg-white border-l border-neutral-200 shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="font-bold text-neutral-900 text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-amber-500" /> Advanced Growth Intelligence
                  </h3>
                  <button onClick={() => setDrawerOpen(null)} className="p-1 hover:bg-neutral-100 rounded-lg">
                    <X className="h-5 w-5 text-neutral-500" />
                  </button>
                </div>

                {drawerOpen.type === "heatmap" && (
                  <div className="space-y-4 text-xs leading-relaxed text-neutral-700">
                    <h2 className="text-xl font-bold text-neutral-800">{drawerOpen.data.name} Channel Profile</h2>
                    
                    <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-100 font-mono">
                      <div>
                        <span className="text-neutral-500 font-sans block text-[9px] uppercase font-bold">Opportunity Rating</span>
                        <span className="text-teal-600 font-bold text-sm">{drawerOpen.data.score}%</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-sans block text-[9px] uppercase font-bold">Conversion Prob.</span>
                        <span className="text-neutral-800 font-bold text-sm">{drawerOpen.data.conversionProb}%</span>
                      </div>
                    </div>

                    <p className="mt-4 font-semibold text-neutral-800">Why it is recommended:</p>
                    <p className="bg-amber-50 text-amber-900 p-3 rounded-lg border border-amber-200">{drawerOpen.data.reason}</p>
                  </div>
                )}

                {drawerOpen.type === "community" && (
                  <div className="space-y-4 text-xs leading-relaxed text-neutral-700">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase font-semibold">Community Profile</span>
                      <h2 className="text-xl font-bold text-neutral-800 mt-0.5">{drawerOpen.data.name}</h2>
                      <p className="text-neutral-600 mt-1.5">{drawerOpen.data.description}</p>
                    </div>

                    {/* Community Metrics Block */}
                    <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-100 font-mono text-center">
                      <div>
                        <span className="text-neutral-500 font-sans block text-[9px] uppercase font-bold">Opportunity</span>
                        <span className="text-teal-600 font-bold text-xs">{drawerOpen.data.opportunityScore}%</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-sans block text-[9px] uppercase font-bold">Sentiment</span>
                        <span className="text-neutral-800 font-bold text-xs">{drawerOpen.data.sentiment}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-sans block text-[9px] uppercase font-bold">Activity Trend</span>
                        <span className="text-teal-600 font-bold text-xs">{drawerOpen.data.activityTrend}</span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-neutral-100 pt-3 text-[11px]">
                      <span className="text-neutral-500 font-bold block uppercase text-[9px]">Advanced Post Metrics</span>
                      <p>🕒 <strong>Best Post Time:</strong> {drawerOpen.data.bestDay} at {drawerOpen.data.best}</p>
                      <p>📢 <strong>Recommended Format:</strong> {drawerOpen.data.contentType}</p>
                      <p>🎯 <strong>Estimated Installs Impact:</strong> {drawerOpen.data.installsForecast || "+350 downloads"}</p>
                      <p>🔥 <strong>Successful Headline Example:</strong> <span className="italic text-neutral-800">{drawerOpen.data.successfulPostExample}</span></p>
                      <p className="text-rose-600 font-medium">⚠️ <strong>Common Mistake:</strong> {drawerOpen.data.commonMistake}</p>
                    </div>
                  </div>
                )}

                {drawerOpen.type === "influencer" && (
                  <div className="space-y-4 text-xs leading-relaxed text-neutral-700">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase font-semibold">Creator Profile</span>
                      <h2 className="text-xl font-bold text-neutral-800 mt-0.5">{drawerOpen.data.name}</h2>
                      <p className="font-mono text-neutral-500">{drawerOpen.data.handle} · {drawerOpen.data.platform}</p>
                      <p className="text-neutral-600 mt-1.5">{drawerOpen.data.description}</p>
                    </div>

                    {/* Influencer Metrics Block */}
                    <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-100 font-mono text-center">
                      <div>
                        <span className="text-neutral-500 font-sans block text-[9px] uppercase font-bold">Expected ROI</span>
                        <span className="text-teal-600 font-bold text-xs">{drawerOpen.data.roiPrediction}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-sans block text-[9px] uppercase font-bold">Fake Follower Risk</span>
                        <span className="text-neutral-800 font-bold text-xs">{drawerOpen.data.fakeFollowerRisk}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-sans block text-[9px] uppercase font-bold">Growth Rating</span>
                        <span className="text-teal-600 font-bold text-xs">{drawerOpen.data.growthScore}/100</span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-neutral-100 pt-3 text-[11px]">
                      <span className="text-neutral-500 font-bold block uppercase text-[9px]">Advanced Sponsor Parameters</span>
                      <p>👥 <strong>Follower count:</strong> {drawerOpen.data.followers}</p>
                      <p>📈 <strong>Engagement rate:</strong> {drawerOpen.data.engagement}</p>
                      <p>💵 <strong>Campaign Cost:</strong> {drawerOpen.data.price}</p>
                      <p>🤝 <strong>Past Collaborations:</strong> {drawerOpen.data.collaborationsCount} sponsors</p>
                      <p>📢 <strong>Best Collab Format:</strong> {drawerOpen.data.collaborationType}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <button
                  onClick={() => setDrawerOpen(null)}
                  className="w-full rounded-xl bg-neutral-900 text-white font-bold text-xs py-3.5 hover:bg-neutral-800"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 12. Contextual AI Discovery Assistant Chat Sidebar Drawer */}
      <AnimatePresence>
        {chatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setChatOpen(false)}
              className="fixed inset-0 z-40 bg-neutral-900"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[420px] bg-neutral-900 text-white border-l border-neutral-800 shadow-2xl p-5 overflow-hidden flex flex-col justify-between"
            >
              <div className="flex-1 flex flex-col min-h-0 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <h3 className="font-bold text-white text-md flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" /> AI Growth Advisor
                  </h3>
                  <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-neutral-800 rounded-lg">
                    <X className="h-5 w-5 text-neutral-500" />
                  </button>
                </div>

                {/* Preconfigured prompt tags */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold font-mono block">Preset Advisor Prompts</span>
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    {[
                      { text: "Where should I launch first?", val: "Where should I launch first?" },
                      { text: "Find communities with low competition.", val: "Find communities with low competition." },
                      { text: "Find creators with high ROI.", val: "Find creators with high ROI." }
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setChatInput(p.val);
                        }}
                        className="bg-neutral-800 border border-neutral-700 hover:border-amber-400 text-neutral-300 px-2 py-1 rounded"
                      >
                        {p.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages view */}
                <div className="flex-1 overflow-y-auto space-y-3 pt-2 pr-2 custom-scrollbar">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-lg p-2.5 text-xs ${
                        msg.role === "user" ? "bg-amber-500 text-white" : "bg-neutral-800 text-neutral-300"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleChatSubmit} className="pt-3 border-t border-neutral-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask advisor..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="bg-amber-500 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-amber-600"
                >
                  Ask
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Pitch Modal */}
      <AnimatePresence>
        {contactOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4"
            onClick={() => setContactOpen(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-5 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                <h3 className="font-bold text-neutral-900 text-sm">Message {contactOpen.name}</h3>
                <button onClick={() => setContactOpen(null)} className="p-1 hover:bg-neutral-100 rounded-lg">
                  <X className="h-4 w-4 text-neutral-500" />
                </button>
              </div>

              <textarea
                key={contactOpen.handle}
                defaultValue={`Hi ${contactOpen.name.split(" ")[0]},\n\nWe're launching ${ws.name} — ${ws.description}.\n\nBased on your profile, we predict a ${contactOpen.roiPrediction} ROI correlation. Would love to send you an early build details to test out a sponsorship campaign. Let us know if you're open to it!\n\nThanks!`}
                rows={7}
                className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />

              <div className="flex justify-end gap-2 text-xs">
                <button
                  onClick={() => setContactOpen(null)}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-neutral-800 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const name = contactOpen.name.split(" ")[0];
                    setContactOpen(null);
                    toast.success(`Outreach message dispatched to ${name}!`, {
                      description: "Simulated message sent. Replies will show in Notifications panel.",
                    });
                  }}
                  className="rounded-md bg-amber-500 px-3 py-1.5 font-medium text-white hover:bg-amber-600"
                >
                  Send Outreach Pitch
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
