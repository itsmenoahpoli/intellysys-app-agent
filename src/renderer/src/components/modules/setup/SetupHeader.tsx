import { BookOpen, ExternalLink } from "lucide-react";

interface SetupHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SetupHeader({ activeTab, setActiveTab }: SetupHeaderProps): JSX.Element {
  const tabs = ["Overview", "Installation", "Settings"];

  return (
    <>
      <div className="flex items-center justify-between border-b border-wap-card-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Agent</h1>
          <p className="text-xs text-wap-text-secondary mt-1">
            Install and manage the WAP Intellysys Agent on your devices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-wap-card-border bg-[#09111e] hover:bg-slate-800/50 text-xs text-slate-300 transition-colors cursor-pointer">
            <BookOpen className="h-3.5 w-3.5 text-wap-blue" />
            Agent Documentation
            <ExternalLink className="h-3 w-3 text-wap-text-secondary" />
          </button>
        </div>
      </div>

      <div className="flex gap-6 border-b border-wap-card-border/50 text-xs font-semibold py-3 select-none">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer pb-2 transition-all relative ${
              activeTab === tab
                ? "text-wap-blue font-bold"
                : "text-wap-text-secondary hover:text-white"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-wap-blue" />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
