export function ThreatLogs(): JSX.Element {
  return (
    <div className="lg:col-span-2 bg-wap-card border border-wap-card-border rounded-xl p-6 shadow-xl space-y-4">
      <h3 className="text-sm font-bold text-white tracking-wide uppercase">
        Real-Time Threat Detection Log
      </h3>
      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
        <div className="flex items-start justify-between text-xs border-b border-wap-card-border/50 pb-2">
          <span className="text-wap-text-secondary">Shield core telemetry sync successful.</span>
          <span className="text-wap-sky font-semibold">Just Now</span>
        </div>
        <div className="flex items-start justify-between text-xs border-b border-wap-card-border/50 pb-2">
          <span className="text-wap-text-secondary">
            Active process thread inspection complete. 0 threats detected.
          </span>
          <span className="text-slate-400">2 min ago</span>
        </div>
        <div className="flex items-start justify-between text-xs border-b border-wap-card-border/50 pb-2">
          <span className="text-wap-text-secondary">
            Established primary auth session for administrator account.
          </span>
          <span className="text-slate-400">10 min ago</span>
        </div>
        <div className="flex items-start justify-between text-xs pb-1">
          <span className="text-wap-text-secondary">
            Security shield engine v2.3.1 started successfully.
          </span>
          <span className="text-slate-400">12 min ago</span>
        </div>
      </div>
    </div>
  );
}
