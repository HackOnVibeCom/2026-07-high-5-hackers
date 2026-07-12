import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Workspace = {
  id: string;
  name: string;
  category: string;
  platform: "iOS" | "Android" | "Both";
  emoji: string;
  color: string;
  description: string;
};

export type OnboardingStage =
  | "app-info"
  | "audience"
  | "competitors"
  | "assets"
  | "launch-plan"
  | "launch-campaign"
  | "growth";

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
};

type State = {
  onboarded: boolean;
  activeStage: OnboardingStage;
  completedStages: OnboardingStage[];
  workspaces: Workspace[];
  activeWorkspaceId: string;
  campaigns: Campaign[];
  setOnboarded: (v: boolean) => void;
  completeStage: (s: OnboardingStage) => void;
  setActiveStage: (s: OnboardingStage) => void;
  addCampaign: (c: Campaign) => void;
  setActiveWorkspace: (id: string) => void;
  updateWorkspace: (w: Partial<Workspace>) => void;
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
  },
  {
    id: "c-2",
    name: "r/getdisciplined Founder Story",
    platforms: ["Reddit"],
    status: "completed",
    launchDate: "2026-07-02",
    budget: 0,
    spark: [4, 9, 14, 22, 19, 25, 30, 28, 33, 29],
  },
  {
    id: "c-3",
    name: "Instagram Reels — 7 Habits",
    platforms: ["Instagram", "TikTok"],
    status: "scheduled",
    launchDate: "2026-07-20",
    budget: 450,
    spark: [],
  },
  {
    id: "c-4",
    name: "Micro-influencer Wave",
    platforms: ["Instagram", "TikTok"],
    status: "draft",
    launchDate: "2026-07-25",
    budget: 1200,
    spark: [],
  },
];

export const useApp = create<State>()(
  persist(
    (set) => ({
      onboarded: false,
      activeStage: "app-info",
      completedStages: [],
      workspaces: defaultWorkspaces,
      activeWorkspaceId: "ws-1",
      campaigns: defaultCampaigns,
      setOnboarded: (v) => set({ onboarded: v }),
      completeStage: (s) =>
        set((st) => ({
          completedStages: st.completedStages.includes(s)
            ? st.completedStages
            : [...st.completedStages, s],
        })),
      setActiveStage: (s) => set({ activeStage: s }),
      addCampaign: (c) => set((st) => ({ campaigns: [c, ...st.campaigns] })),
      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
      updateWorkspace: (w) =>
        set((st) => ({
          workspaces: st.workspaces.map((x) =>
            x.id === st.activeWorkspaceId ? { ...x, ...w } : x,
          ),
        })),
    }),
    { name: "launchpilot-state" },
  ),
);

export const useActiveWorkspace = () => {
  const ws = useApp((s) => s.workspaces);
  const id = useApp((s) => s.activeWorkspaceId);
  return ws.find((w) => w.id === id) ?? ws[0];
};
