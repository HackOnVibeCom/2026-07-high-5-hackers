import { create } from "zustand";
import { persist } from "zustand/middleware";
import { notifications as defaultNotifications } from "./mock-data";

export type Workspace = {
  id: string;
  name: string;
  category: string;
  platform: "iOS" | "Android" | "Both";
  emoji: string;
  color: string;
  description: string;
  logo?: string; // data-url from uploaded image
};

export type OnboardingStage =
  "app-info" | "audience" | "competitors" | "assets" | "launch-plan" | "launch-campaign" | "growth";

export const ONBOARDING_STAGES: { id: OnboardingStage; label: string }[] = [
  { id: "app-info", label: "App Information" },
  { id: "audience", label: "Target Audience" },
  { id: "competitors", label: "Competitor Analysis" },
  { id: "assets", label: "Marketing Assets" },
  { id: "launch-plan", label: "Launch Plan" },
  { id: "launch-campaign", label: "Launch Campaign" },
  { id: "growth", label: "Growth Monitoring" },
];

export type Campaign = {
  id: string;
  name: string;
  platforms: string[];
  status: "draft" | "scheduled" | "running" | "completed";
  launchDate: string;
  budget: number;
  spark: number[];
  audience?: string;
  asset?: string;
};

export type Notification = {
  id: string;
  day: string;
  text: string;
  unread: boolean;
  to: string;
  tone: "teal" | "amber" | "rose" | "blue";
};

export type StudioDraft = {
  text: string;
  history: { id: string; label: string; text: string; ts: number }[];
};

export type AssistantMessage = {
  role: "user" | "ai";
  text: string;
  action?: { label: string; to: string };
};

export type QueueItem = {
  id: string;
  platform: string;
  status: "checking" | "formatting" | "publishing" | "done" | "error";
  text: string;
  ts: number;
};

export type SimulatorData = {
  isRunning: boolean;
  currentDay: number;
  statsLog: string[];
  simulatedDailyData: { day: string; installs: number; ctr: number; rank: number }[];
  finalGrade: string;
  finalInstalls: number;
};

type State = {
  onboarded: boolean;
  activeStage: OnboardingStage;
  completedStages: OnboardingStage[];
  workspaces: Workspace[];
  activeWorkspaceId: string;
  campaigns: Campaign[];
  notifications: Notification[];
  savedInfluencers: string[];
  savedCommunities: string[];
  appliedRecommendations: string[];
  ignoredRecommendations: string[];
  savedRecommendations: string[];
  studioDrafts: Record<string, StudioDraft>;
  roadmapDone: Record<string, boolean>;
  assistantMessages: AssistantMessage[];

  // Backend state
  dashboardLoading: boolean;
  dashboardData: any;
  recommendations: any[];
  healthScore: any;
  competitorsData: any[];
  communitiesData: any[];
  influencersData: any[];
  generatingPackage: boolean;

  // Connected Social Accounts
  socialAccounts: Record<string, boolean>;
  toggleSocialAccount: (platform: string) => void;

  // Publishing Queue
  publishingQueue: QueueItem[];
  publishAssetViaQueue: (slug: string) => Promise<void>;

  // Live Sandbox Launch Simulator
  simulator: SimulatorData;
  startSimulation: () => void;
  resetSimulation: () => void;
  updateSimulatorData: (day: number, installs: number, ctr: number, rank: number, logMessage: string) => void;
  finishSimulation: (grade: string, finalInstalls: number) => void;

  // Onboarding & workspace
  setOnboarded: (v: boolean) => void;
  completeStage: (s: OnboardingStage) => void;
  setActiveStage: (s: OnboardingStage) => void;
  setActiveWorkspace: (id: string) => void;
  updateWorkspace: (w: Partial<Workspace>) => void;

  // Campaigns
  addCampaign: (c: Campaign) => void;
  updateCampaign: (id: string, patch: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;

  // Notifications
  markNotificationsRead: () => void;
  addNotification: (n: Notification) => void;

  // Discover
  toggleInfluencerBookmark: (handle: string) => void;
  toggleCommunityBookmark: (name: string) => void;
  applyRecommendation: (id: string) => void;
  ignoreRecommendation: (id: string) => void;
  saveRecommendation: (id: string) => void;

  // Studio
  saveStudioDraft: (type: string, draft: StudioDraft) => void;

  // Strategy
  setRoadmapDone: (taskId: string, done: boolean) => void;

  // Assistant
  setAssistantMessages: (msgs: AssistantMessage[]) => void;

  // API Actions
  fetchDashboard: () => Promise<void>;
  fetchRecommendations: () => Promise<void>;
  fetchHealthScore: () => Promise<void>;
  fetchCompetitors: () => Promise<void>;
  fetchCommunities: () => Promise<void>;
  fetchInfluencers: () => Promise<void>;
  generateBrandLaunchPackage: (name: string, category: string, description: string) => Promise<void>;
  approveAndPublishAsset: (slug: string) => Promise<void>;
};

const defaultWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Fernly",
    category: "Health & Fitness",
    platform: "Both",
    emoji: "🌿",
    color: "#26AD87",
    description: "A calm, science-backed habit tracker for busy professionals.",
  },
  {
    id: "ws-2",
    name: "Trailhead",
    category: "Travel",
    platform: "iOS",
    emoji: "🏔️",
    color: "#3564CA",
    description: "Curated hiking routes with offline maps and trail reports.",
  },
  {
    id: "ws-3",
    name: "Studioflow",
    category: "Productivity",
    platform: "Android",
    emoji: "🎛️",
    color: "#DE8C21",
    description: "A minimalist project OS for solo designers.",
  },
];

const defaultCampaigns: Campaign[] = [
  {
    id: "c-1",
    name: "Product Hunt Launch Week",
    platforms: ["Product Hunt", "Twitter", "LinkedIn"],
    status: "running",
    launchDate: new Date().toISOString().split("T")[0],
    budget: 800,
    spark: [12, 18, 22, 31, 28, 42, 51, 47, 62, 71],
    audience: "Indie hackers and productivity enthusiasts, 25–40",
    asset: "Product Hunt Description",
  },
  {
    id: "c-2",
    name: "r/getdisciplined Founder Story",
    platforms: ["Reddit"],
    status: "completed",
    launchDate: "2026-07-02",
    budget: 0,
    spark: [4, 9, 14, 22, 19, 25, 30, 28, 33, 29],
    audience: "Reddit self-improvement community",
    asset: "Reddit Launch Post",
  },
  {
    id: "c-3",
    name: "Instagram Reels — 7 Habits",
    platforms: ["Instagram", "TikTok"],
    status: "scheduled",
    launchDate: "2026-07-20",
    budget: 450,
    spark: [],
    audience: "Health-conscious millennials on social media",
    asset: "Instagram Caption",
  },
  {
    id: "c-4",
    name: "Micro-influencer Wave",
    platforms: ["Instagram", "TikTok"],
    status: "draft",
    launchDate: "2026-07-25",
    budget: 1200,
    spark: [],
    audience: "Gen-Z wellness and productivity audience",
  },
];

// Helper to bundle active app ASO/Copy metadata to send to Stateless backend
const getContextPayload = (state: any) => {
  const ws = state.workspaces.find((w: any) => w.id === state.activeWorkspaceId) || state.workspaces[0];
  
  // Extract ASO details
  const asoText = state.studioDrafts["app-store"]?.text || "";
  const lines = asoText.split("\n").filter((l: string) => l.trim().length > 0);
  const asoTitle = lines[0] || "";
  const asoSubtitle = lines[1] || "";
  const asoKeywords = asoText.includes("Keywords: ") 
    ? asoText.split("Keywords: ")[1]?.split(",").map((k: string) => k.trim()) 
    : [];

  const socialDrafts = Object.entries(state.studioDrafts)
    .filter(([key]) => ["reddit", "twitter", "linkedin", "instagram", "tiktok"].includes(key))
    .map(([key, val]: any) => ({ platform: key, text: val.text }));

  return {
    name: ws.name,
    description: ws.description,
    category: ws.category,
    asoTitle,
    asoSubtitle,
    asoKeywords,
    socialDrafts,
    campaigns: state.campaigns,
    completedStages: state.completedStages
  };
};

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      onboarded: false,
      activeStage: "app-info",
      completedStages: [],
      workspaces: defaultWorkspaces,
      activeWorkspaceId: "ws-1",
      campaigns: defaultCampaigns,
      notifications: defaultNotifications.map((n) => ({ ...n })),
      savedInfluencers: [],
      savedCommunities: [],
      appliedRecommendations: [],
      ignoredRecommendations: [],
      savedRecommendations: [],
      studioDrafts: {},
      roadmapDone: {},
      assistantMessages: [],

      // Backend initial state
      dashboardLoading: false,
      dashboardData: null,
      recommendations: [],
      healthScore: null,
      competitorsData: [],
      communitiesData: [],
      influencersData: [],
      generatingPackage: false,

      // Social Accounts linkages
      socialAccounts: { reddit: false, twitter: false, linkedin: false, producthunt: false },
      toggleSocialAccount: (platform) =>
        set((st) => ({
          socialAccounts: {
            ...st.socialAccounts,
            [platform]: !st.socialAccounts[platform]
          }
        })),

      // Publishing queue implementations (Simulated concurrency loops)
      publishingQueue: [],
      publishAssetViaQueue: async (slug) => {
        const platformMap: Record<string, string> = {
          "app-store": "App Store",
          "google-play": "Google Play",
          "instagram": "Instagram",
          "linkedin": "LinkedIn",
          "twitter": "Twitter",
          "reddit": "Reddit",
          "email": "Email",
          "landing": "Landing Page",
          "producthunt": "Product Hunt"
        };
        const platform = platformMap[slug] || "Social";
        const draft = get().studioDrafts[slug];
        if (!draft) return;

        const queueId = `q-${Date.now()}`;
        const newQueueItem: QueueItem = {
          id: queueId,
          platform,
          status: "checking",
          text: draft.text,
          ts: Date.now()
        };

        set((st) => ({
          publishingQueue: [newQueueItem, ...st.publishingQueue]
        }));

        // Day 1 check logic
        await new Promise((res) => setTimeout(res, 800));
        set((st) => ({
          publishingQueue: st.publishingQueue.map((item) =>
            item.id === queueId ? { ...item, status: "formatting" as const } : item
          )
        }));

        // Format checks
        await new Promise((res) => setTimeout(res, 800));
        set((st) => ({
          publishingQueue: st.publishingQueue.map((item) =>
            item.id === queueId ? { ...item, status: "publishing" as const } : item
          )
        }));

        // Send api payloads
        await new Promise((res) => setTimeout(res, 800));
        set((st) => ({
          publishingQueue: st.publishingQueue.map((item) =>
            item.id === queueId ? { ...item, status: "done" as const } : item
          )
        }));

        // Add campaign
        const newCampaign: Campaign = {
          id: `c-api-${Date.now()}`,
          name: `Published: ${platform} Post`,
          platforms: [platform],
          status: "running",
          launchDate: new Date().toISOString().split("T")[0],
          budget: 0,
          spark: [10, 22, 18, 32, 45, 56],
          audience: "Live community distribution",
          asset: draft.text
        };

        set((st) => ({
          campaigns: [newCampaign, ...st.campaigns]
        }));

        get().addNotification({
          id: `n-pub-${Date.now()}`,
          day: "Today",
          text: `Success: content asset published successfully on ${platform}!`,
          unread: true,
          to: "/campaigns",
          tone: "teal"
        });

        await get().fetchDashboard();
        await get().fetchHealthScore();
      },

      // Launch simulator implementations
      simulator: {
        isRunning: false,
        currentDay: 0,
        statsLog: ["Simulator ready. Tweak ASO copy and schedule campaigns, then click launch."],
        simulatedDailyData: [],
        finalGrade: "",
        finalInstalls: 0
      },
      startSimulation: () =>
        set((st) => ({
          simulator: {
            ...st.simulator,
            isRunning: true,
            currentDay: 0,
            statsLog: ["Simulation initiated: starting launch week sequence..."],
            simulatedDailyData: []
          }
        })),
      resetSimulation: () =>
        set((st) => ({
          simulator: {
            isRunning: false,
            currentDay: 0,
            statsLog: ["Simulator ready. Tweak ASO copy and schedule campaigns, then click launch."],
            simulatedDailyData: [],
            finalGrade: "",
            finalInstalls: 0
          }
        })),
      updateSimulatorData: (day, installs, ctr, rank, logMessage) =>
        set((st) => {
          const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          const newDayData = {
            day: daysOfWeek[day - 1] || `Day ${day}`,
            installs,
            ctr,
            rank
          };
          return {
            simulator: {
              ...st.simulator,
              currentDay: day,
              statsLog: [...st.simulator.statsLog, logMessage],
              simulatedDailyData: [...st.simulator.simulatedDailyData, newDayData]
            }
          };
        }),
      finishSimulation: (grade, finalInstalls) =>
        set((st) => ({
          simulator: {
            ...st.simulator,
            isRunning: false,
            finalGrade: grade,
            finalInstalls: finalInstalls,
            statsLog: [
              ...st.simulator.statsLog,
              `Simulation completed! Grade: ${grade}. Cumulative installations: ${finalInstalls}.`
            ]
          }
        })),

      // Onboarding & workspace
      setOnboarded: (v) => set({ onboarded: v }),
      completeStage: (s) =>
        set((st) => ({
          completedStages: st.completedStages.includes(s)
            ? st.completedStages
            : [...st.completedStages, s],
        })),
      setActiveStage: (s) => set({ activeStage: s }),
      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
      updateWorkspace: (w) =>
        set((st) => ({
          workspaces: st.workspaces.map((x) =>
            x.id === st.activeWorkspaceId ? { ...x, ...w } : x,
          ),
        })),

      // Campaigns
      addCampaign: (c) => set((st) => ({ campaigns: [c, ...st.campaigns] })),
      updateCampaign: (id, patch) =>
        set((st) => ({
          campaigns: st.campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteCampaign: (id) =>
        set((st) => ({
          campaigns: st.campaigns.filter((c) => c.id !== id),
        })),

      // Notifications
      markNotificationsRead: () =>
        set((st) => ({
          notifications: st.notifications.map((n) => ({ ...n, unread: false })),
        })),
      addNotification: (n) => set((st) => ({ notifications: [n, ...st.notifications] })),

      // Discover
      toggleInfluencerBookmark: (handle) =>
        set((st) => ({
          savedInfluencers: st.savedInfluencers.includes(handle)
            ? st.savedInfluencers.filter((h) => h !== handle)
            : [...st.savedInfluencers, handle],
        })),
      toggleCommunityBookmark: (name) =>
        set((st) => ({
          savedCommunities: st.savedCommunities.includes(name)
            ? st.savedCommunities.filter((n) => n !== name)
            : [...st.savedCommunities, name],
        })),
      applyRecommendation: (id) =>
        set((st) => ({
          appliedRecommendations: [...st.appliedRecommendations, id]
        })),
      ignoreRecommendation: (id) =>
        set((st) => ({
          ignoredRecommendations: [...st.ignoredRecommendations, id]
        })),
      saveRecommendation: (id) =>
        set((st) => ({
          savedRecommendations: st.savedRecommendations.includes(id)
            ? st.savedRecommendations.filter((x) => x !== id)
            : [...st.savedRecommendations, id]
        })),

      // Studio
      saveStudioDraft: (type, draft) =>
        set((st) => ({
          studioDrafts: { ...st.studioDrafts, [type]: draft },
        })),

      // Strategy
      setRoadmapDone: (taskId, done) =>
        set((st) => ({
          roadmapDone: { ...st.roadmapDone, [taskId]: done },
        })),

      // Assistant
      setAssistantMessages: (msgs) => set({ assistantMessages: msgs }),

      // API Actions (Connected to Dynamic Serverless Endpoints)
      fetchDashboard: async () => {
        set({ dashboardLoading: true });
        try {
          const payload = getContextPayload(get());
          const res = await fetch("/api/dashboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const data = await res.json();
            set({ dashboardData: data });
          }
        } catch (e) {
          console.error("fetchDashboard failed", e);
        } finally {
          set({ dashboardLoading: false });
        }
      },
      fetchRecommendations: async () => {
        try {
          const payload = getContextPayload(get());
          const res = await fetch("/api/recommendations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const data = await res.json();
            set({ recommendations: data });
          }
        } catch (e) {
          console.error("fetchRecommendations failed", e);
        }
      },
      fetchHealthScore: async () => {
        try {
          const payload = getContextPayload(get());
          const res = await fetch("/api/launch-health-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const data = await res.json();
            set({ healthScore: data });
          }
        } catch (e) {
          console.error("fetchHealthScore failed", e);
        }
      },
      fetchCompetitors: async () => {
        try {
          const res = await fetch("/api/competitors");
          if (res.ok) {
            const data = await res.json();
            set({ competitorsData: data });
          }
        } catch (e) {
          console.error("fetchCompetitors failed", e);
        }
      },
      fetchCommunities: async () => {
        try {
          const res = await fetch("/api/communities");
          if (res.ok) {
            const data = await res.json();
            set({ communitiesData: data });
          }
        } catch (e) {
          console.error("fetchCommunities failed", e);
        }
      },
      fetchInfluencers: async () => {
        try {
          const res = await fetch("/api/influencers");
          if (res.ok) {
            const data = await res.json();
            set({ influencersData: data });
          }
        } catch (e) {
          console.error("fetchInfluencers failed", e);
        }
      },
      generateBrandLaunchPackage: async (name: string, category: string, description: string) => {
        set({ generatingPackage: true });
        try {
          const res = await fetch("/api/generate-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, category, description })
          });
          if (res.ok) {
            const data = await res.json();
            const newStudioDrafts = { ...get().studioDrafts };
            
            if (data.aso) {
              const asoText = `${data.aso.title}\n\n${data.aso.subtitle}\n\nKeywords: ${data.aso.keywords.join(", ")}`;
              newStudioDrafts["app-store"] = {
                text: asoText,
                history: [{ id: `app-store-${Date.now()}`, label: "v1 — AI Generated ASO", text: asoText, ts: Date.now() }]
              };
              newStudioDrafts["google-play"] = {
                text: asoText,
                history: [{ id: `google-play-${Date.now()}`, label: "v1 — AI Generated ASO", text: asoText, ts: Date.now() }]
              };
            }
            
            if (data.social) {
              data.social.forEach((s: any) => {
                const slug = s.platform.toLowerCase() === "twitter" ? "twitter" : s.platform.toLowerCase() === "linkedin" ? "linkedin" : "reddit";
                newStudioDrafts[slug] = {
                  text: s.text,
                  history: [{ id: `${slug}-${Date.now()}`, label: "v1 — AI Generated Draft", text: s.text, ts: Date.now() }]
                };
              });
            }

            set({ studioDrafts: newStudioDrafts });
            await get().fetchRecommendations();
            await get().fetchHealthScore();
          }
        } catch (e) {
          console.error("generateBrandLaunchPackage failed", e);
        } finally {
          set({ generatingPackage: false });
        }
      },
      approveAndPublishAsset: async (slug: string) => {
        // Redirect to the simulated background publishing worker queue
        await get().publishAssetViaQueue(slug);
      },
    }),
    { name: "launchpilot-state-v2" },
  ),
);

export const useActiveWorkspace = () => {
  const ws = useApp((s) => s.workspaces);
  const id = useApp((s) => s.activeWorkspaceId);
  return ws.find((w) => w.id === id) ?? ws[0];
};
