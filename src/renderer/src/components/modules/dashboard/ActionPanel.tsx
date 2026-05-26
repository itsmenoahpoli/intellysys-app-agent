import { Power } from "lucide-react";

interface ActionPanelProps {
  onConfigure: () => void;
  onDisconnect: () => void;
}

export function ActionPanel({ onConfigure, onDisconnect }: ActionPanelProps): JSX.Element {
  return (
    <div className="bg-wap-card border border-wap-card-border rounded-xl p-6 shadow-xl flex flex-col justify-between">
      <h3 className="text-sm font-bold text-white tracking-wide uppercase mb-4">Command Actions</h3>
      <div className="space-y-3">
        <button
          onClick={onConfigure}
          className="w-full bg-wap-input border border-wap-input-border hover:border-wap-text-secondary/40 text-slate-300 font-semibold text-xs py-3 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          Configure Shields
        </button>
        <button
          onClick={onDisconnect}
          className="w-full bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 hover:border-rose-500 text-rose-400 font-semibold text-xs py-3 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          <Power className="h-4 w-4" />
          Disconnect Node
        </button>
      </div>
    </div>
  );
}
