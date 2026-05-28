import { Check, Cpu, KeyRound, Laptop, Network, Server } from "lucide-react";

interface SetupCompleteStepProps {
  licenseKey: string;
  serverUrl: string;
  metrics: SystemMetrics | null;
}

const maskLicenseKey = (licenseKey: string): string => {
  if (!licenseKey) {
    return "Not available";
  }
  const parts = licenseKey.split("-");
  if (parts.length < 8) {
    return licenseKey;
  }
  return `${parts.slice(0, 2).join("-")}-****-****-****-****-${parts.slice(-2).join("-")}`;
};

const detailValue = (value?: string | number | null): string => {
  if (value === undefined || value === null || String(value).trim() === "") {
    return "Unavailable";
  }
  return String(value);
};

export function SetupCompleteStep({
  licenseKey,
  serverUrl,
  metrics,
}: SetupCompleteStepProps): JSX.Element {
  const memoryValue = metrics
    ? `${detailValue(metrics.usedMem)} GB / ${detailValue(metrics.totalMem)} GB`
    : "Unavailable";

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4 mb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wap-green/10 border border-wap-green/30 text-wap-green">
          <Laptop className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">5. Review and Confirm</h3>
          <p className="text-xs text-wap-text-secondary mt-0.5">
            Review your setup details before finalizing and launching the agent dashboard.
          </p>
        </div>
      </div>

      <div className="bg-[#09111e]/40 border border-wap-card-border rounded-xl p-4">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-wap-text-secondary mb-3 flex items-center gap-2">
          <KeyRound className="h-3.5 w-3.5" />
          License Details
        </p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between gap-3">
            <span className="text-wap-text-secondary">License Key</span>
            <span className="text-white font-mono">{maskLicenseKey(licenseKey)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-wap-text-secondary">Server URL</span>
            <span className="text-white font-mono text-right">{detailValue(serverUrl)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[#09111e]/40 border border-wap-card-border rounded-xl p-4">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-wap-text-secondary mb-3 flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5" />
            Hardware Summary
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between gap-3">
              <span className="text-wap-text-secondary">CPU</span>
              <span className="text-white font-mono text-right">{detailValue(metrics?.cpuModel)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-wap-text-secondary">Cores</span>
              <span className="text-white font-mono">{detailValue(metrics?.cpuCores)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-wap-text-secondary">Memory</span>
              <span className="text-white font-mono">{memoryValue}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#09111e]/40 border border-wap-card-border rounded-xl p-4">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-wap-text-secondary mb-3 flex items-center gap-2">
            <Network className="h-3.5 w-3.5" />
            Network Summary
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between gap-3">
              <span className="text-wap-text-secondary">Hostname</span>
              <span className="text-white font-mono text-right">{detailValue(metrics?.hostname)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-wap-text-secondary">Interface</span>
              <span className="text-white font-mono">{detailValue(metrics?.networkInterface)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-wap-text-secondary">Current IP</span>
              <span className="text-white font-mono">{detailValue(metrics?.ipAddress)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#09111e]/40 border border-wap-card-border rounded-xl p-4">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-wap-text-secondary mb-3 flex items-center gap-2">
          <Server className="h-3.5 w-3.5" />
          Runtime Summary
        </p>
        <div className="grid gap-2 md:grid-cols-2 text-xs">
          <div className="flex justify-between gap-3">
            <span className="text-wap-text-secondary">Platform</span>
            <span className="text-white font-mono">{detailValue(metrics?.platform)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-wap-text-secondary">Architecture</span>
            <span className="text-white font-mono">{detailValue(metrics?.arch)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-wap-text-secondary">Node</span>
            <span className="text-white font-mono">{detailValue(metrics?.nodeVersion)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-wap-text-secondary">Electron</span>
            <span className="text-white font-mono">{detailValue(metrics?.electronVersion)}</span>
          </div>
        </div>
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex gap-3">
        <Check className="h-5 w-5 text-wap-green flex-shrink-0 mt-0.5" />
        <p className="text-xs text-wap-text-secondary leading-relaxed">
          Click Confirm & Launch to register this machine with your selected license key and continue
          to the dashboard.
        </p>
      </div>
    </div>
  );
}
