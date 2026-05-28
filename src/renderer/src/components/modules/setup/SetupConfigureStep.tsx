import { useEffect, useState } from "react";
import { Cpu, HardDrive, Info, Network, RefreshCw, Server } from "lucide-react";

type MetricsState = SystemMetrics | null;

interface SetupConfigureStepProps {
  onMetricsChange?: (metrics: MetricsState) => void;
}

export function SetupConfigureStep({ onMetricsChange }: SetupConfigureStepProps): JSX.Element {
  const [metrics, setMetrics] = useState<MetricsState>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const [value] = await Promise.all([
        window.api.metrics.get(),
        new Promise((resolve) => window.setTimeout(resolve, 1000)),
      ]);
      setMetrics(value);
      onMetricsChange?.(value);
      setLoadError(null);
    } catch {
      setLoadError("Unable to collect some device details");
      onMetricsChange?.(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMetrics();
  }, []);

  const memLabel =
    metrics ? `${metrics.usedMem} GB / ${metrics.totalMem} GB` : loading ? "Detecting memory usage..." : "Unavailable";
  const loadingIndicator = <div className="h-4 w-4 rounded-full border-2 border-wap-blue border-t-transparent animate-spin" />;
  const valueOrLoader = (value?: string | number | null) => {
    if (loading) {
      return loadingIndicator;
    }
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return <span className="text-white font-mono">{value}</span>;
    }
    return <span className="text-white/70 font-mono">Unavailable</span>;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-base font-bold text-white mb-2">4. Configure Agent Environment</h3>
        <p className="text-xs text-wap-text-secondary leading-relaxed">
          The agent automatically detects your hardware and network details. No manual input is
          required.
        </p>
        <button
          type="button"
          onClick={() => void loadMetrics()}
          disabled={loading}
          className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-wap-card-border text-xs font-semibold text-wap-text-secondary hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[#09111e]/40 border border-wap-card-border rounded-xl p-4">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-wap-text-secondary mb-3 flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5" />
            Hardware
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between gap-3">
              <span className="text-wap-text-secondary">CPU</span>
              <div className="text-right">{valueOrLoader(metrics?.cpuModel)}</div>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-wap-text-secondary">Cores</span>
              {valueOrLoader(metrics?.cpuCores)}
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-wap-text-secondary">Memory</span>
              {loading ? loadingIndicator : <span className="text-white font-mono">{memLabel}</span>}
            </div>
          </div>
        </div>

        <div className="bg-[#09111e]/40 border border-wap-card-border rounded-xl p-4">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-wap-text-secondary mb-3 flex items-center gap-2">
            <Network className="h-3.5 w-3.5" />
            Network
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between gap-3">
              <span className="text-wap-text-secondary">Hostname</span>
              {valueOrLoader(metrics?.hostname)}
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-wap-text-secondary">Interface</span>
              {valueOrLoader(metrics?.networkInterface)}
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-wap-text-secondary">Current IP</span>
              {valueOrLoader(metrics?.ipAddress)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#09111e]/40 border border-wap-card-border rounded-xl p-4">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-wap-text-secondary mb-3 flex items-center gap-2">
          <Server className="h-3.5 w-3.5" />
          Runtime
        </p>
        <div className="grid gap-2 md:grid-cols-2 text-xs">
          <div className="flex justify-between gap-3">
            <span className="text-wap-text-secondary">Platform</span>
            {valueOrLoader(metrics?.platform)}
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-wap-text-secondary">Architecture</span>
            {valueOrLoader(metrics?.arch)}
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-wap-text-secondary">Node</span>
            {valueOrLoader(metrics?.nodeVersion)}
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-wap-text-secondary">Electron</span>
            {valueOrLoader(metrics?.electronVersion)}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-wap-blue/5 border border-wap-blue/20 rounded-xl p-4">
        <Info className="h-4.5 w-4.5 text-wap-blue shrink-0 mt-0.5" />
        <p className="text-xs text-wap-text-secondary leading-relaxed">
          {loading
            ? "Collecting device and network information..."
            : loadError
              ? `${loadError}. You can still continue and retry after setup.`
              : "Review the detected details, then click Next to confirm and register this agent."}
        </p>
      </div>
    </div>
  );
}
