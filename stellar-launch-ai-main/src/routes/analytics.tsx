import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "../lib/store";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from "recharts";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  component: Analytics,
});

const installsData = [
  { day: "Mon", installs: 82 }, { day: "Tue", installs: 214 }, { day: "Wed", installs: 168 },
  { day: "Thu", installs: 242 }, { day: "Fri", installs: 198 }, { day: "Sat", installs: 158 }, { day: "Sun", installs: 222 },
];
const sources = [
  { name: "Organic", value: 46, color: "#26AD87" },
  { name: "Product Hunt", value: 22, color: "#DE8C21" },
  { name: "Reddit", value: 18, color: "#3564CA" },
  { name: "Paid Meta", value: 14, color: "#BF4057" },
];
const platforms = [
  { name: "Reddit", installs: 512 },
  { name: "Product Hunt", installs: 468 },
  { name: "Instagram", installs: 302 },
  { name: "LinkedIn", installs: 148 },
  { name: "TikTok", installs: 132 },
];

function Analytics() {
  const campaigns = useApp((s) => s.campaigns);
  const unlocked = campaigns.some((c) => c.status === "running" || c.status === "completed");
  const [filter, setFilter] = useState<string | null>(null);

  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-100 text-neutral-500">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold text-neutral-900">Analytics is warming up.</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Once a campaign is running or completed, this page fills with what worked and what didn't.
        </p>
        <Link
          to="/campaigns"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          Go to campaigns
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-neutral-500">Analytics</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-900">
          What worked, why, and what to do next.
        </h1>
        {filter && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-900">
            Filtered by: <span className="font-mono">{filter}</span>
            <button onClick={() => setFilter(null)} className="text-amber-800 hover:underline">clear</button>
          </div>
        )}
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Metric label="Downloads" value="4,286" delta="+22.4%" positive />
        <Metric label="Retention (D7)" value="38.1%" delta="+1.8%" positive />
        <Metric label="CTR" value="4.6%" delta="-14.2%" />
        <Metric label="Conversion" value="12.3%" delta="+3.4%" positive />
        <Metric label="Campaign ROI" value="2.7×" delta="+0.4×" positive />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 lg:col-span-2">
          <h3 className="text-sm font-medium text-neutral-900">Installs — last 7 days</h3>
          <p className="text-xs text-neutral-500">Total 1,284 · Tuesday was your Product Hunt spike.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <LineChart data={installsData}>
                <CartesianGrid stroke="#E3E5E8" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="#7B828E" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#7B828E" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ stroke: "#CDD0D5" }} contentStyle={{ borderRadius: 8, border: "1px solid #E3E5E8", fontSize: 12 }} />
                <Line type="monotone" dataKey="installs" stroke="#3564CA" strokeWidth={2.5} dot={{ r: 3, fill: "#3564CA" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h3 className="text-sm font-medium text-neutral-900">Traffic sources</h3>
          <p className="text-xs text-neutral-500">Click a slice to drill down.</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={sources}
                  dataKey="value"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  onClick={(d: { name?: string }) => d?.name && setFilter(d.name)}
                >
                  {sources.map((s) => (
                    <Cell key={s.name} fill={s.color} stroke="none" style={{ cursor: "pointer" }} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E3E5E8", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1">
            {sources.map((s) => (
              <li key={s.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="flex-1 text-neutral-700">{s.name}</span>
                <span className="font-mono text-neutral-500">{s.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="text-sm font-medium text-neutral-900">Top-performing platforms</h3>
        <p className="text-xs text-neutral-500">Reddit is out-performing paid Meta 3:1 this week.</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer>
            <BarChart data={platforms} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid stroke="#E3E5E8" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke="#7B828E" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke="#7B828E" fontSize={12} tickLine={false} axisLine={false} width={100} />
              <Tooltip cursor={{ fill: "#F1F2F3" }} contentStyle={{ borderRadius: 8, border: "1px solid #E3E5E8", fontSize: 12 }} />
              <Bar dataKey="installs" fill="#DE8C21" radius={[0, 6, 6, 0]} onClick={(d: { name?: string }) => d?.name && setFilter(d.name)} style={{ cursor: "pointer" }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, delta, positive }: { label: string; value: string; delta: string; positive?: boolean }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold text-neutral-900">{value}</div>
      <div className={`mt-1 inline-flex rounded px-1.5 py-0.5 font-mono text-[11px] ${positive ? "bg-teal-100 text-teal-800" : "bg-rose-100 text-rose-800"}`}>
        {delta}
      </div>
    </div>
  );
}
