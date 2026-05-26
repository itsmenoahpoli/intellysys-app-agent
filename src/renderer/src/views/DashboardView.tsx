import { useNavigate } from "react-router-dom";
import { Settings, RefreshCw } from "lucide-react";
import { useAuth } from "@renderer/services/auth";
import { useAgent } from "@renderer/services/agent";
import { useAppStore } from "@renderer/store/useAppStore";
import { MetricCards, ThreatLogs, ActionPanel } from "@components";

export default function DashboardView(): JSX.Element {
  const navigate = useNavigate();
  const { serverUrl, uptime } = useAppStore();
  const { user, logout } = useAuth();
  const { isConnected, isChecking, checkHealth } = useAgent(serverUrl);

  const handleDisconnect = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex-1 flex flex-col px-8 md:px-16 lg:px-24 py-8 z-10 overflow-y-auto w-full space-y-6">
      <div className="flex items-center justify-between border-b border-wap-card-border pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Agent Command Center
          </h2>
          <p className="text-xs text-wap-text-secondary mt-1">
            Real-time local machine defense node
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => checkHealth(serverUrl)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-wap-card-border bg-[#09111e] hover:bg-slate-800/50 text-slate-300 font-semibold text-xs transition-colors duration-150 cursor-pointer"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isChecking ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-wap-blue/40 bg-wap-blue/10 hover:bg-wap-blue/20 text-wap-blue font-semibold text-xs transition-colors duration-150 cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </button>
        </div>
      </div>

      <MetricCards
        serverUrl={serverUrl || ""}
        uptime={uptime}
        isConnected={isConnected}
        userEmail={user?.email}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ThreatLogs />
        <ActionPanel
          onConfigure={() => navigate("/settings")}
          onDisconnect={handleDisconnect}
        />
      </div>
    </div>
  );
}
