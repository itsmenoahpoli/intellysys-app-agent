import { ArrowLeft } from "lucide-react";

interface SettingsHeaderProps {
  onBack: () => void;
}

export function SettingsHeader({ onBack }: SettingsHeaderProps): JSX.Element {
  return (
    <div className="flex items-center gap-4 border-b border-wap-card-border pb-4">
      <button
        onClick={onBack}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-wap-card-border bg-[#09111e] hover:bg-slate-800/50 text-slate-300 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Agent Preferences</h2>
        <p className="text-xs text-wap-text-secondary mt-1">
          Fine-tune active defense and network telemetry settings
        </p>
      </div>
    </div>
  );
}
