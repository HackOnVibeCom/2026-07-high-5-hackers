import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  Sparkles,
  Link2,
  CheckCircle,
  Activity,
  Terminal,
  TrendingUp,
  AlertTriangle,
  Award,
  Share2
} from "lucide-react";
import { useActiveWorkspace, useApp } from "../lib/store";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { toast } from "sonner";
import { chartTooltipStyle, CHART_AXIS, CHART_GRID, CHART_DOT_STROKE } from "../lib/chart-theme";

export const Route = createFileRoute("/simulator")({
  component: Simulator,
});

function Simulator() {
  const ws = useActiveWorkspace();
  const {
    simulator,
    socialAccounts,
    toggleSocialAccount,
    startSimulation,
    resetSimulation,
    updateSimulatorData,
    finishSimulation,
    campaigns,
    studioDrafts
  } = useApp();

  const [connecting, setConnecting] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [simulator.statsLog]);

  // Connect simulated accounts handler
  const handleConnect = (platform: string) => {
    setConnecting(platform);
    setTimeout(() => {
      toggleSocialAccount(platform);
      setConnecting(null);
      toast.success(`${platform} Account Linked`, {
        description: `Your simulator is now connected to publish drafts to ${platform}.`,
      });
    }, 1000);
  };

  // Run Simulation Logic
  useEffect(() => {
    if (!simulator.isRunning) return;

    let day = simulator.currentDay;
    const interval = setInterval(async () => {
      day += 1;
      
      // Calculate scores dynamically from store payloads
      const asoText = studioDrafts["app-store"]?.text || "";
      const hasAso = asoText.length > 50;
      const hasPhCampaign = campaigns.some(c => c.platforms && c.platforms.includes("Product Hunt"));
      const isTwitterLinked = socialAccounts.twitter;
      const isRedditLinked = socialAccounts.reddit;

      let dailyInstalls = 0;
      let dailyCtr = 2.4;
      let phRank = 15;
      let logMsg = "";

      switch (day) {
        case 1:
          dailyInstalls = hasAso ? 120 : 35;
          dailyCtr = hasAso ? 4.2 : 2.1;
          logMsg = `[Day 1 - Monday] Launching search crawlers. ${
            hasAso 
              ? "ASO metadata optimized, indexing organic keywords." 
              : "Generic metadata detected. High bounce rate observed in App Store."
          }`;
          break;
        case 2:
          dailyInstalls = isRedditLinked ? 280 : 40;
          dailyCtr = isRedditLinked ? 5.8 : 2.5;
          logMsg = `[Day 2 - Tuesday] Subreddit indexing. ${
            isRedditLinked 
              ? "Reddit founder post published to r/productivity. Thread received 45 upvotes!" 
              : "No Reddit account linked. Missing community traffic flow."
          }`;
          break;
        case 3:
          dailyInstalls = isTwitterLinked ? 180 : 50;
          dailyCtr = isTwitterLinked ? 4.9 : 2.3;
          logMsg = `[Day 3 - Wednesday] Social broadcast. ${
            isTwitterLinked 
              ? "Twitter thread launched. Influencer retweets boost organic ctr." 
              : "No Twitter broadcast. Growth restricted to default listings."
          }`;
          break;
        case 4:
          if (hasPhCampaign) {
            phRank = hasAso ? 4 : 9;
            dailyInstalls = hasAso ? 650 : 250;
            dailyCtr = hasAso ? 6.5 : 3.8;
            logMsg = `[Day 4 - Thursday] Product Hunt launch. Featured page live! Current Rank: #${phRank}. Upvotes: ${hasAso ? "280+" : "90+"}.`;
          } else {
            dailyInstalls = 60;
            dailyCtr = 2.4;
            logMsg = "[Day 4 - Thursday] Steady state. No major campaign live this day.";
          }
          break;
        case 5:
          dailyInstalls = hasAso ? 220 : 80;
          dailyCtr = hasAso ? 5.1 : 2.9;
          logMsg = `[Day 5 - Friday] Competitor checks. Streaks tracker reports rank change. ${
            hasAso ? "Custom keywords defend market share." : "Low keyword overlap causes temporary organic rank drop."
          }`;
          break;
        case 6:
          // Check if user bookmarks any influencers
          const creatorBost = campaigns.some(c => c.name.toLowerCase().includes("influencer")) ? 450 : 90;
          dailyInstalls = creatorBost;
          dailyCtr = creatorBost > 100 ? 7.2 : 3.1;
          logMsg = `[Day 6 - Saturday] Partner outreach. ${
            creatorBost > 100 
              ? "Micro-influencer posted a TikTok reel. Video views hit 12K. High download spike!" 
              : "No active influencer campaigns scheduled."
          }`;
          break;
        case 7:
          dailyInstalls = hasAso ? 190 : 70;
          dailyCtr = hasAso ? 4.5 : 2.6;
          logMsg = "[Day 7 - Sunday] Consolidating launch metrics. Running ASO indexing checks.";
          break;
      }

      updateSimulatorData(day, dailyInstalls, dailyCtr, phRank, logMsg);

      if (day >= 7) {
        clearInterval(interval);
        
        // Compute final score
        let cumulativeInstalls = simulator.simulatedDailyData.reduce((acc, curr) => acc + curr.installs, 0) + dailyInstalls;
        let grade = "C";
        if (cumulativeInstalls >= 1200) grade = "A+";
        else if (cumulativeInstalls >= 900) grade = "A";
        else if (cumulativeInstalls >= 600) grade = "B";
        else if (cumulativeInstalls >= 400) grade = "C";
        else grade = "D";

        finishSimulation(grade, cumulativeInstalls);
        toast.success("Launch Sandbox Run Complete!", {
          description: `Finished launch simulation with grade ${grade}.`,
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [simulator.isRunning, simulator.currentDay]);

  const handleLaunch = () => {
    startSimulation();
  };

  const handleReset = () => {
    resetSimulation();
  };

  const cumulativeInstalls = simulator.simulatedDailyData.reduce((acc, curr) => acc + curr.installs, 0);

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
            <Activity className="h-4 w-4" />
          </div>
          <p className="text-sm text-neutral-500">Launch Sandbox</p>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-900">
          Launch Sandbox Simulator
        </h1>
        <p className="mt-2 text-sm text-neutral-600 max-w-xl">
          Simulate a 7-day launch week for {ws.name}. Tweak ASO copy, toggle campaign accounts, and witness launch dynamics in real-time.
        </p>
      </motion.header>

      {/* Grid: Toggles & Launch Controller */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Connection Panel */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-amber-500" /> Connect Launch Accounts
          </h3>
          <p className="text-xs text-neutral-500">
            Link simulated accounts to deploy copy drafts and drive campaign loops during simulation.
          </p>

          <div className="space-y-3 pt-2">
            {["Reddit", "Twitter", "LinkedIn", "Product Hunt"].map((platform) => {
              const key = platform.toLowerCase().replace(" ", "");
              const isLinked = socialAccounts[key];
              const isConnecting = connecting === key;
              return (
                <div key={platform} className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${isLinked ? "bg-teal-500 animate-pulse" : "bg-neutral-300"}`} />
                    <span className="text-xs font-semibold text-neutral-800">{platform}</span>
                  </div>
                  <button
                    disabled={isLinked || simulator.isRunning}
                    onClick={() => handleConnect(key)}
                    className={`text-xs font-medium rounded-lg px-3 py-1.5 transition ${
                      isLinked 
                        ? "bg-teal-50 text-teal-700 cursor-default" 
                        : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-neutral-200"
                    }`}
                  >
                    {isConnecting ? "Linking..." : isLinked ? "Linked" : "Link Account"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Launch Control Panel */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col justify-between lg:col-span-2">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" /> Sandbox Controller
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Active configuration for {ws.name}.
            </p>
            
            <div className="grid gap-3 sm:grid-cols-3 mt-4 text-xs">
              <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
                <span className="text-neutral-500">App Name</span>
                <p className="font-bold text-neutral-800 mt-0.5">{ws.name}</p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
                <span className="text-neutral-500">ASO Copy</span>
                <p className="font-bold text-neutral-800 mt-0.5">
                  {studioDrafts["app-store"] ? "🌿 Ready (V1)" : "⚠️ Missing Title"}
                </p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
                <span className="text-neutral-500">Target Category</span>
                <p className="font-bold text-neutral-800 mt-0.5">{ws.category}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            {!simulator.isRunning && !simulator.finalGrade ? (
              <button
                onClick={handleLaunch}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-4 text-sm font-bold text-white shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" /> Run Launch Simulation
              </button>
            ) : (
              <>
                <button
                  disabled={simulator.isRunning}
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 disabled:opacity-50 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
                {simulator.isRunning && (
                  <div className="flex-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 flex items-center justify-center gap-3 text-sm font-semibold">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                    Simulating Day {simulator.currentDay}/7...
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Simulator Active Visualizer */}
      {(simulator.isRunning || simulator.simulatedDailyData.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Day Progression Chart */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Sandbox Installs Chart</h3>
                <p className="text-xs text-neutral-500">Launch week progression results.</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 uppercase font-semibold">Cumulative Installs</span>
                <h4 className="text-lg font-bold text-neutral-800 flex items-center gap-1.5 justify-end">
                  <TrendingUp className="h-4 w-4 text-teal-500" /> {cumulativeInstalls}
                </h4>
              </div>
            </div>

            <div className="h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulator.simulatedDailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_GRID} />
                  <XAxis dataKey="day" fontSize={11} stroke={CHART_AXIS} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke={CHART_AXIS} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="installs"
                    stroke="#DE8C21"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#DE8C21", strokeWidth: 2, stroke: CHART_DOT_STROKE }}
                    activeDot={{ r: 6, fill: "#DE8C21", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monospace Logging Console */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-3 flex flex-col h-[350px]">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <Terminal className="h-4 w-4 text-neutral-500" />
              <span className="text-xs font-mono font-bold text-neutral-400">Launch Sentinel Console</span>
            </div>
            
            <div className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-teal-400/90 space-y-2.5 pr-2 custom-scrollbar">
              {simulator.statsLog.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap">
                  <span className="text-neutral-500">&gt;</span> {log}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* Grade Card Summary */}
      {simulator.finalGrade && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-teal-200 bg-teal-50/50 p-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between shadow-sm"
        >
          <div className="flex items-center gap-5">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-teal-100 text-teal-700">
              <Award className="h-10 w-10" />
            </div>
            <div>
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Evaluation Complete</span>
              <h2 className="text-2xl font-bold text-neutral-900 mt-0.5">
                Your launch grade is: <span className="text-teal-600 font-extrabold">{simulator.finalGrade}</span>
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Launch finished with {simulator.finalInstalls} downloads in the first week sandbox!
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {simulator.finalGrade.startsWith("A") ? (
              <div className="bg-teal-500 text-white rounded-xl px-5 py-3 font-semibold text-sm shadow-md">
                🚀 Launch Ready
              </div>
            ) : (
              <div className="bg-amber-500 text-white rounded-xl px-5 py-3 font-semibold text-sm shadow-md flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Optimization Advised
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
