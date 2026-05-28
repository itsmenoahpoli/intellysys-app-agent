import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  Copy,
  Cpu,
  HardDrive,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { useAgent } from "@renderer/services/agent";
import { useAppStore } from "@renderer/store/useAppStore";

type LocalMetrics = SystemMetrics | null;

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""}, ${hours} hour${hours > 1 ? "s" : ""}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}, ${mins} minute${mins > 1 ? "s" : ""}`;
  return `${mins} minute${mins > 1 ? "s" : ""}`;
}

function ProgressBar({ value, color }: { value: number; color: string }): JSX.Element {
  return (
    <div className="w-full h-2 rounded-full bg-white/8 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export default function DashboardView(): JSX.Element {
  const { serverUrl } = useAppStore();
  const { isConnected, isChecking, checkHealth } = useAgent(serverUrl);
  const [localMetrics, setLocalMetrics] = useState<LocalMetrics>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [lastCheckAt, setLastCheckAt] = useState<Date>(new Date());

  const loadMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const metrics = await window.api.metrics.get();
      setLocalMetrics(metrics);
      setLastCheckAt(new Date());
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    void loadMetrics();
  }, []);

  const memPercent = useMemo(() => {
    if (!localMetrics?.totalMem) return 0;
    return Math.round((localMetrics.usedMem / localMetrics.totalMem) * 100);
  }, [localMetrics]);

  const cpuPercent = 23;
  const diskPercent = 45;

  return (
    <div className="flex-1 flex flex-col px-8 md:px-12 lg:px-16 py-6 z-10 overflow-y-auto w-full space-y-4 text-white">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Status</h2>
          <p className="text-xs text-wap-text-secondary mt-1">Overview of your agent and system health.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-sm font-semibold ${isConnected ? "text-emerald-400" : "text-amber-300"}`}>
            {isConnected ? "Connected" : "Degraded"}
          </div>
          <button
            onClick={() => {
              void checkHealth(serverUrl);
              void loadMetrics();
            }}
            className="p-2 rounded-lg border border-wap-card-border hover:bg-white/5 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking || loadingMetrics ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="bg-wap-card border border-wap-card-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-wap-text-secondary text-xs font-semibold uppercase"><Shield className="h-4 w-4" /> Agent Status</div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">Running</div>
          <p className="text-xs text-wap-text-secondary mt-1">Agent is active and protecting your system</p>
        </div>
        <div className="bg-wap-card border border-wap-card-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-wap-text-secondary text-xs font-semibold uppercase"><Wifi className="h-4 w-4" /> Server Connection</div>
          <div className={`mt-2 text-2xl font-bold ${isConnected ? "text-wap-blue" : "text-amber-300"}`}>{isConnected ? "Connected" : "Reconnecting"}</div>
          <p className="text-xs text-wap-text-secondary mt-1">{serverUrl || "No server URL"}</p>
        </div>
        <div className="bg-wap-card border border-wap-card-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-wap-text-secondary text-xs font-semibold uppercase"><Clock3 className="h-4 w-4" /> Last Check-In</div>
          <div className="mt-2 text-2xl font-bold">1 min ago</div>
          <p className="text-xs text-wap-text-secondary mt-1">{lastCheckAt.toLocaleString()}</p>
        </div>
        <div className="bg-wap-card border border-wap-card-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-wap-text-secondary text-xs font-semibold uppercase"><Server className="h-4 w-4" /> Agent Version</div>
          <div className="mt-2 text-2xl font-bold">2.3.1</div>
          <p className="text-xs text-wap-text-secondary mt-1">Latest version</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <div className="bg-wap-card border border-wap-card-border rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3">System Overview</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center"><span className="text-wap-text-secondary">Hostname</span><span className="font-mono">{localMetrics?.hostname || "Unknown"}</span></div>
            <div className="flex justify-between items-center"><span className="text-wap-text-secondary">Operating System</span><span className="font-mono">{localMetrics?.platform || "Unknown"} ({localMetrics?.arch || "-"})</span></div>
            <div className="flex justify-between items-center"><span className="text-wap-text-secondary">IP Address</span><span className="font-mono inline-flex items-center gap-1">{localMetrics?.ipAddress || "Unavailable"} <Copy className="h-3.5 w-3.5 text-wap-text-secondary" /></span></div>
            <div className="flex justify-between items-center"><span className="text-wap-text-secondary">System Uptime</span><span className="font-mono">{localMetrics ? formatUptime(localMetrics.appUptime) : "-"}</span></div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs"><span className="text-wap-text-secondary">Total CPU Usage</span><span>{cpuPercent}%</span></div>
              <ProgressBar value={cpuPercent} color="bg-emerald-400" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs"><span className="text-wap-text-secondary">Memory Usage</span><span>{memPercent}%</span></div>
              <ProgressBar value={memPercent} color="bg-wap-blue" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs"><span className="text-wap-text-secondary">Disk Usage (C:)</span><span>{diskPercent}%</span></div>
              <ProgressBar value={diskPercent} color="bg-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-wap-card border border-wap-card-border rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3">Protection Summary</h3>
          <div className="space-y-3 text-sm">
            {["Real-time Monitoring", "Log Collection", "Threat Detection", "Firewall Monitoring", "Auto Updates"].map((item) => (
              <div key={item} className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{item}</span>
                <span className="text-emerald-400 font-semibold">Enabled</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 rounded-lg border border-wap-card-border hover:bg-white/5 text-sm">
            View Full Protection Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <div className="bg-wap-card border border-wap-card-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <button className="text-sm text-wap-blue hover:text-wap-sky">View All</button>
          </div>
          <div className="space-y-3 text-sm">
            {[
              ["Agent started successfully", "Info"],
              ["Connected to WAP Intellysys server", "Info"],
              ["Configuration updated", "Info"],
              ["System scan completed", "Success"],
              ["All systems operational", "Info"],
            ].map(([msg, tag], idx) => (
              <div key={`${msg}-${idx}`} className="flex items-center justify-between border-b border-white/5 pb-2">
                <span>{msg}</span>
                <span className={tag === "Success" ? "text-emerald-400" : "text-wap-blue"}>{tag}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-wap-card border border-wap-card-border rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {[
              ["Run System Scan", Search],
              ["Sync Now", RefreshCw],
              ["View Logs", Activity],
              ["Restart Agent", Cpu],
            ].map(([label, Icon], idx) => (
              <button key={`${label}-${idx}`} className="w-full px-3 py-2 rounded-lg border border-wap-card-border hover:bg-white/5 flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4 text-wap-text-secondary" />
                  {label}
                </span>
                <span className="text-wap-text-secondary">›</span>
              </button>
            ))}
            <button className="w-full px-3 py-2 rounded-lg border border-rose-500/30 hover:bg-rose-500/10 flex items-center justify-between text-sm text-rose-400">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Stop Agent
              </span>
              <span>›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
