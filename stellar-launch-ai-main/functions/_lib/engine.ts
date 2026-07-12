// Deterministic content + analytics engine for LaunchPilot AI.
//
// This is the always-on brain of the backend. When OpenRouter is available it
// enriches these results; when it isn't, these functions alone produce genuinely
// useful, context-aware output derived from the app's name, category, and pitch.
// Everything here is pure (no I/O), so it runs identically on the edge or locally
// and is trivially testable.

import type { AppContext } from "./http";

/* ─────────────────────────── small utilities ─────────────────────────── */

/** Deterministic 32-bit hash of a string — lets us derive stable "metrics". */
export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Seeded value in [min, max], stable for a given seed. */
function seeded(seed: number, min: number, max: number): number {
  const x = Math.sin(seed) * 10000;
  const frac = x - Math.floor(x);
  return Math.round((min + frac * (max - min)) * 100) / 100;
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1));
}

/** A short, human benefit phrase inferred from the app category. */
function categoryAngle(category = ""): { verb: string; noun: string; hook: string; audience: string } {
  const c = category.toLowerCase();
  const map: Record<string, { verb: string; noun: string; hook: string; audience: string }> = {
    health: { verb: "build", noun: "healthy habits", hook: "Real momentum, no burnout.", audience: "busy professionals" },
    fitness: { verb: "train", noun: "your routine", hook: "Show up on your worst day.", audience: "everyday athletes" },
    travel: { verb: "plan", noun: "unforgettable trips", hook: "Adventure, minus the chaos.", audience: "curious explorers" },
    productivity: { verb: "focus", noun: "on what matters", hook: "Do less, finish more.", audience: "makers and teams" },
    finance: { verb: "grow", noun: "your money", hook: "Confidence with every dollar.", audience: "smart savers" },
    education: { verb: "master", noun: "any subject", hook: "Learn faster, remember longer.", audience: "lifelong learners" },
    social: { verb: "connect", noun: "with your people", hook: "The good part of social.", audience: "your community" },
    business: { verb: "run", noun: "your business", hook: "Less admin, more growth.", audience: "founders and operators" },
    music: { verb: "create", noun: "your sound", hook: "From idea to track, fast.", audience: "creators and artists" },
    photo: { verb: "capture", noun: "every moment", hook: "Photos worth keeping.", audience: "visual storytellers" },
    food: { verb: "cook", noun: "with confidence", hook: "Dinner, solved.", audience: "home cooks" },
    game: { verb: "play", noun: "something you love", hook: "Five minutes turns into an hour.", audience: "players everywhere" },
  };
  for (const key of Object.keys(map)) {
    if (c.includes(key)) return map[key];
  }
  return { verb: "get", noun: "more done", hook: "Built for the way you actually work.", audience: "people like you" };
}

/** Pull the strongest 2–4 sentences from a description as selling points. */
function extractBenefits(description = ""): string[] {
  const sentences = description
    .split(/[.\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12);
  if (sentences.length >= 3) return sentences.slice(0, 4).map((s) => s.replace(/^[-•\s]+/, ""));
  const angle = categoryAngle();
  return sentences.length
    ? sentences
    : ["Fast, focused, and refreshingly simple", "Private by design", "Works the moment you open it"];
}

/* ─────────────────────────── ASO generation ─────────────────────────── */

export interface ASO {
  title: string;
  subtitle: string;
  keywords: string[];
  longDescription: string;
}

export function generateASO(ctx: AppContext): ASO {
  const name = (ctx.name || "Your App").trim();
  const category = ctx.category || "";
  const angle = categoryAngle(category);
  const benefits = extractBenefits(ctx.description);

  const title = `${name} — ${titleCase(`${angle.verb} ${angle.noun}`)}`.slice(0, 30);
  const subtitle = angle.hook.slice(0, 30);

  const base = (ctx.description || `${name} ${category}`).toLowerCase();
  const stop = new Set([
    "the", "and", "for", "with", "your", "you", "that", "this", "app", "are", "our",
    "from", "into", "have", "has", "was", "will", "can", "not", "but", "who", "why",
    "a", "an", "of", "to", "in", "on", "is", "it", "as", "or", "by", "we", "us",
  ]);
  const freq = new Map<string, number>();
  for (const w of base.match(/[a-z]{3,}/g) || []) {
    if (stop.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  const mined = [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w);
  const categoryKeywords = category
    .toLowerCase()
    .split(/[\s&,]+/)
    .filter((w) => w.length > 2);
  const keywords = [
    ...new Set([...categoryKeywords, ...mined, angle.noun.split(" ").pop() || "tracker", "2026"]),
  ].slice(0, 10);

  const longDescription =
    `${name} helps ${angle.audience} ${angle.verb} ${angle.noun}. ${angle.hook}\n\n` +
    benefits
      .slice(0, 4)
      .map((b) => `• ${b.charAt(0).toUpperCase() + b.slice(1)}`)
      .join("\n") +
    `\n\nNo clutter, no dark patterns — just a tool that respects your time. ` +
    `Download ${name} and see the difference in your first week.`;

  return { title, subtitle, keywords, longDescription };
}

/* ─────────────────────────── social copy ─────────────────────────── */

export interface SocialPost {
  platform: string;
  text: string;
}

export function generateSocial(ctx: AppContext): SocialPost[] {
  const name = (ctx.name || "our app").trim();
  const angle = categoryAngle(ctx.category);
  const benefits = extractBenefits(ctx.description);
  const b1 = benefits[0] || "it just works";
  const b2 = benefits[1] || "private by default";

  const twitter =
    `1/ We just shipped ${name}. Here's why we built it 🧵\n\n` +
    `2/ Most ${ctx.category || "apps"} in this space overwhelm you. We went the other way: ${angle.hook.toLowerCase()}\n\n` +
    `3/ What makes ${name} different:\n• ${b1}\n• ${b2}\n• Zero learning curve\n\n` +
    `4/ It's live now. ${angle.hook} Would love your feedback 🙌`;

  const linkedin =
    `I built ${name} because the tools I tried made ${angle.audience} work harder, not smarter. 🚀\n\n` +
    `${name} does three things differently:\n` +
    `1. ${b1}\n2. ${b2}\n3. Respects your time — ${angle.hook.toLowerCase()}\n\n` +
    `We launched this week and I'd genuinely love your thoughts.\n\n#startup #buildinpublic #${(ctx.category || "tech").replace(/[^a-zA-Z0-9]/g, "") || "tech"}`;

  const reddit =
    `**I built ${name} — ${angle.hook}**\n\n` +
    `Background: I kept running into the same problem and none of the existing ${ctx.category || "tools"} solved it well. ` +
    `So I spent months building ${name}.\n\n` +
    `The core idea: ${b1.toLowerCase()}. On top of that, ${b2.toLowerCase()}.\n\n` +
    `Happy to answer anything about the design, the tech, or the launch. ` +
    `Not going to drop a link in the post — mods, let me know if that's okay.`;

  return [
    { platform: "Twitter", text: twitter },
    { platform: "LinkedIn", text: linkedin },
    { platform: "Reddit", text: reddit },
  ];
}

/* ─────────────── Launch Health Score + breakdown ─────────────── */

export interface HealthScore {
  score: number;
  breakdown: {
    asoQuality: number;
    contentReadiness: number;
    campaignExecution: number;
    communityPresence: number;
  };
  summary: string;
}

export function computeHealthScore(ctx: AppContext): HealthScore {
  // ASO quality: rewards a filled title, subtitle, and enough keywords.
  let aso = 30;
  if (ctx.asoTitle && ctx.asoTitle.length >= 10 && ctx.asoTitle.length <= 30) aso += 30;
  else if (ctx.asoTitle) aso += 15;
  if (ctx.asoSubtitle && ctx.asoSubtitle.length >= 10) aso += 20;
  if ((ctx.asoKeywords?.length || 0) >= 5) aso += 20;
  else if ((ctx.asoKeywords?.length || 0) > 0) aso += 10;
  aso = Math.min(100, aso);

  // Content readiness: how many social drafts exist and have substance.
  const drafts = ctx.socialDrafts || [];
  const meaningful = drafts.filter((d) => (d.text || "").length > 80).length;
  const content = Math.min(100, 25 + meaningful * 22);

  // Campaign execution: running / scheduled campaigns vs. drafts.
  const campaigns = ctx.campaigns || [];
  const active = campaigns.filter((c) => c.status === "running" || c.status === "scheduled").length;
  const execution = Math.min(100, 30 + active * 18 + Math.min(20, campaigns.length * 4));

  // Community presence: onboarding progress as a proxy.
  const stages = ctx.completedStages?.length || 0;
  const community = Math.min(100, 20 + stages * 12);

  const breakdown = {
    asoQuality: aso,
    contentReadiness: content,
    campaignExecution: execution,
    communityPresence: community,
  };
  const score = Math.round((aso + content + execution + community) / 4);

  const summary =
    score >= 80
      ? "Healthy & ready to scale. Keep the momentum — double down on your best channel."
      : score >= 50
        ? "Solid foundation, but a few gaps are capping your reach. Tackle the lowest bar first."
        : "Critical attention needed. Generate your launch package and schedule your first campaign.";

  return { score, breakdown, summary };
}

/* ─────────────── AI Growth Advisor recommendations ─────────────── */

export interface Recommendation {
  id: string;
  finding: string;
  cause: string;
  recommendation: string;
  confidence: number;
  expected_impact: string;
  tone: "teal" | "amber" | "rose" | "blue";
}

export function computeRecommendations(ctx: AppContext): Recommendation[] {
  const name = ctx.name || "your app";
  const health = computeHealthScore(ctx);
  const recs: Recommendation[] = [];

  // 1. Lowest health dimension drives the top recommendation.
  const dims = Object.entries(health.breakdown).sort((a, b) => a[1] - b[1]);
  const [weakest, weakScore] = dims[0];
  const weakMap: Record<string, Omit<Recommendation, "id" | "confidence">> = {
    asoQuality: {
      finding: "App Store metadata is under-optimized",
      cause: "Your title, subtitle, or keyword set is incomplete, so you're invisible for high-intent searches.",
      recommendation: `Open Studio and generate a full ASO package for ${name} — a keyword-dense subtitle alone can lift search impressions 20–35%.`,
      expected_impact: "+28% search impressions",
      tone: "amber",
    },
    contentReadiness: {
      finding: "Launch content isn't ready across channels",
      cause: "Fewer than half your social drafts are substantive, so launch day will leave channels empty.",
      recommendation: "Generate Reddit, LinkedIn, and Twitter drafts now, then schedule them so nothing ships blank.",
      expected_impact: "+3 launch-day channels",
      tone: "blue",
    },
    campaignExecution: {
      finding: "Too few campaigns are actually live",
      cause: "Most of your campaigns are sitting in draft, so your funnel has no top-of-funnel volume.",
      recommendation: "Move at least one draft to Scheduled this week — start with your highest-match community channel.",
      expected_impact: "+18% install volume",
      tone: "teal",
    },
    communityPresence: {
      finding: "Community groundwork is thin",
      cause: "You haven't completed the discovery stages, so you're launching without warm communities.",
      recommendation: "Finish the Discover step and bookmark 3 target communities before you launch.",
      expected_impact: "+5 warm channels",
      tone: "rose",
    },
  };
  recs.push({ id: "rec-weakest", confidence: 0.9 - weakScore / 500, ...weakMap[weakest] });

  // 2. Channel-mix insight (always useful, tuned to category).
  const angle = categoryAngle(ctx.category);
  recs.push({
    id: "rec-channel",
    finding: `${angle.audience[0].toUpperCase() + angle.audience.slice(1)} over-index on community platforms`,
    cause: `For ${ctx.category || "your category"}, organic community posts convert 2–3× better than paid social at launch.`,
    recommendation: "Shift 20% of any paid budget into Reddit + Product Hunt storytelling for the first two weeks.",
    confidence: 0.86,
    expected_impact: "+15% CTR vs. paid",
    tone: "teal",
  });

  // 3. Timing / launch-window insight.
  recs.push({
    id: "rec-timing",
    finding: "Your Product Hunt window is time-sensitive",
    cause: "Tuesday 12:01 PST launches see the most sustained front-page time; slots fill days ahead.",
    recommendation: "Lock your Product Hunt launch for a Tuesday and line up 5 hunter comments in advance.",
    confidence: 0.78,
    expected_impact: "Top-5 finish likely",
    tone: "amber",
  });

  // 4. Retention nudge if content exists.
  if ((ctx.socialDrafts?.length || 0) > 0) {
    recs.push({
      id: "rec-retention",
      finding: "Screenshot #3 is a common drop-off point",
      cause: "Users decide within the first three screenshots; a weak third frame silently costs activations.",
      recommendation: `Rewrite ${name}'s third screenshot caption in Studio to restate the core benefit, not a feature.`,
      confidence: 0.81,
      expected_impact: "+9% activation",
      tone: "blue",
    });
  }

  return recs.map((r) => ({ ...r, confidence: Math.round(r.confidence * 100) / 100 }));
}

/* ─────────────── Dashboard KPIs (stable per app) ─────────────── */

export interface Dashboard {
  installs: number;
  installsDelta: string;
  activationRate: number;
  productHuntRank: string;
  weeklyInstalls: { day: string; installs: number }[];
  topChannel: string;
}

export function computeDashboard(ctx: AppContext): Dashboard {
  const seed = hashStr((ctx.name || "app") + (ctx.category || ""));
  const health = computeHealthScore(ctx).score;

  // Base installs scale with launch health so a well-prepared app "performs" better.
  const base = 400 + Math.round((health / 100) * 1600);
  const installs = base + Math.round(seeded(seed, 0, 400));
  const activationRate = Math.round((30 + (health / 100) * 25 + seeded(seed + 1, -3, 3)) * 10) / 10;
  const rank = Math.max(1, Math.min(20, Math.round(21 - (health / 100) * 18)));

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyInstalls = days.map((day, i) => ({
    day,
    installs: Math.round((installs / 7) * (0.6 + 0.12 * i) + seeded(seed + i, -30, 60)),
  }));

  const channels = ["Reddit", "Product Hunt", "Instagram", "LinkedIn"];
  const topChannel = channels[seed % channels.length];

  return {
    installs,
    installsDelta: `+${(10 + (seed % 15)).toFixed(1)}%`,
    activationRate,
    productHuntRank: `#${rank}`,
    weeklyInstalls,
    topChannel,
  };
}
