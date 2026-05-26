import { ShieldCheck, Cpu, HardDrive, Activity } from "lucide-react";

interface MetricCardsProps {
  serverUrl: string;
  uptime: number | null;
  isConnected: boolean;
  userEmail?: string;
}

export function MetricCards({
  serverUrl,
  uptime,
  isConnected,
  userEmail,
}: MetricCardsProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-wap-card border border-wap-card-border rounded-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-wap-green to-transparent" />
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-wap-text-secondary uppercase tracking-wider">
              Engine Status
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-wap-green/10 border border-wap-green/30 text-wap-green">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Active & Protected</h3>
              <p className="text-xs text-wap-text-secondary mt-0.5">Secure shield link operating</p>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-wap-card-border flex justify-between items-center text-xs">
          <span className="text-wap-text-secondary">Host link:</span>
          <span className="text-wap-sky font-semibold font-mono truncate max-w-[150px]">
            {serverUrl}
          </span>
        </div>
      </div>

      <div className="bg-wap-card border border-wap-card-border rounded-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-wap-sky to-transparent" />
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-wap-text-secondary uppercase tracking-wider">
              Resource Node
            </span>
            <Cpu className="h-4 w-4 text-wap-sky" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-wap-sky/10 border border-wap-sky/30 text-wap-sky">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">System Metrics</h3>
              <p className="text-xs text-wap-text-secondary mt-0.5">
                Uptime: {uptime ? `${uptime.toFixed(1)}s` : "Unknown"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-wap-card-border flex justify-between items-center text-xs">
          <span className="text-wap-text-secondary">Platform Node:</span>
          <span className="text-slate-300 font-semibold">Local Agent Client</span>
        </div>
      </div>

      <div className="bg-wap-card border border-wap-card-border rounded-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-wap-purple to-transparent" />
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-wap-text-secondary uppercase tracking-wider">
              Telemetry Link
            </span>
            <Activity className="h-4 w-4 text-wap-purple" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-wap-purple/10 border border-wap-purple/30 text-wap-purple">
              <HardDrive className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {isConnected ? "Server Synced" : "Offline Buffer"}
              </h3>
              <p className="text-xs text-wap-text-secondary mt-0.5">Session: {userEmail}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-wap-card-border flex justify-between items-center text-xs">
          <span className="text-wap-text-secondary">Network Bridge:</span>
          <span className={`font-semibold ${isConnected ? "text-wap-green" : "text-rose-400"}`}>
            {isConnected ? "CONNECTED" : "DISCONNECTED"}
          </span>
        </div>
      </div>
    </div>
  );
}
