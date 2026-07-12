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

type State = {
  onboarded: boolean;
  activeStage: OnboardingStage;
  completedStages: OnboardingStage[];
  workspaces: Workspace[];
  activeWorkspaceId: string;
  campaigns: Campaign[];
  notifications: Notification[];
  savedInfluencers: string[];
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
    launchDate: "2026-07-14",
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

      // API Actions
      fetchDashboard: async () => {
        set({ dashboardLoading: true });
        try {
          const res = await fetch("/api/dashboard");
          if (res.ok) {
            const data = await res.json();
            set({ dashboardData: data, campaigns: data.campaigns || [] });
          }
        } catch (e) {
          console.error("fetchDashboard failed", e);
        } finally {
          set({ dashboardLoading: false });
        }
      },
      fetchRecommendations: async () => {
        const state = get();
        const ws = state.workspaces.find((w) => w.id === state.activeWorkspaceId) || state.workspaces[0];
        try {
          const res = await fetch("/api/recommendations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: ws.name,
              description: ws.description,
              installsTrend: state.dashboardData?.installsTrend || [82, 214, 168, 242, 198, 158, 222],
              ctr: state.dashboardData?.ctr || 4.6
            })
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
        const state = get();
        const runningCampaigns = state.campaigns.filter((c) => c.status === "running").length;
        const completedStages = state.completedStages.length;
        const hasAso = Object.keys(state.studioDrafts).length > 0;
        try {
          const res = await fetch("/api/launch-health-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              runningCampaigns,
              completedStages,
              hasAso
            })
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
        const state = get();
        const draft = state.studioDrafts[slug];
        if (!draft) return;

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

        const newCampaign: Campaign = {
          id: `c-api-${Date.now()}`,
          name: `Approved: ${platform} Launch Draft`,
          platforms: [platform],
          status: "running",
          launchDate: new Date().toISOString().split("T")[0],
          budget: 0,
          spark: [10, 15, 25, 30, 28, 45, 52],
          audience: "Live audience engaged",
          asset: draft.text
        };

        set((st) => ({
          campaigns: [newCampaign, ...st.campaigns]
        }));
        
        await get().fetchHealthScore();
      },
    }),
    { name: "launchpilot-state" },
  ),
);

export const useActiveWorkspace = () => {
  const ws = useApp((s) => s.workspaces);
  const id = useApp((s) => s.activeWorkspaceId);
  return ws.find((w) => w.id === id) ?? ws[0];
};
