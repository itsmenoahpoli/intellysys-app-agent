import { Check, FileText, Wrench, PhoneCall, ExternalLink } from "lucide-react";

interface SetupSidebarProps {
  currentStep: number;
}

export function SetupSidebar({ currentStep }: SetupSidebarProps): JSX.Element {
  return (
    <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
      <div className="bg-wap-card border border-wap-card-border rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-wap-blue to-transparent" />
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-white mb-2">
          Installation Overview
        </h3>
        <span className="text-[11px] text-wap-text-secondary block mb-4">Estimated time: 2–3 minutes</span>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-wap-green text-white">
              <Check className="h-3 w-3 stroke-[3]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Download Installer</span>
              <span className="text-[10px] text-wap-green font-medium">Completed</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-wap-green text-white">
              <Check className="h-3 w-3 stroke-[3]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Run Installer</span>
              <span className="text-[10px] text-wap-green font-medium">Completed</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full text-white font-bold text-[10px] ${
                currentStep > 3 ? "bg-wap-green" : "bg-wap-blue"
              }`}
            >
              {currentStep > 3 ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : "3"}
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">License Key</span>
              <span
                className={`text-[10px] font-medium ${
                  currentStep > 3 ? "text-wap-green" : "text-wap-blue"
                }`}
              >
                {currentStep > 3 ? "Completed" : "Enter your license key"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full font-bold text-[10px] ${
                currentStep > 4
                  ? "bg-wap-green text-white"
                  : currentStep === 4
                  ? "bg-wap-blue text-white"
                  : "bg-[#0a1424] border border-wap-card-border text-wap-text-muted"
              }`}
            >
              {currentStep > 4 ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : "4"}
            </div>
            <div>
              <span
                className={`text-xs font-semibold block ${
                  currentStep >= 4 ? "text-white" : "text-wap-text-secondary"
                }`}
              >
                Configure Agent
              </span>
              <span
                className={`text-[10px] font-medium ${
                  currentStep > 4
                    ? "text-wap-green"
                    : currentStep === 4
                    ? "text-wap-blue"
                    : "text-wap-text-muted"
                }`}
              >
                {currentStep > 4
                  ? "Completed"
                  : currentStep === 4
                  ? "Set up connection settings"
                  : "Pending"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full font-bold text-[10px] ${
                currentStep === 5
                  ? "bg-wap-blue text-white"
                  : "bg-[#0a1424] border border-wap-card-border text-wap-text-muted"
              }`}
            >
              5
            </div>
            <div>
              <span
                className={`text-xs font-semibold block ${
                  currentStep === 5 ? "text-white" : "text-wap-text-secondary"
                }`}
              >
                Complete
              </span>
              <span
                className={`text-[10px] font-medium ${
                  currentStep === 5 ? "text-wap-blue" : "text-wap-text-muted"
                }`}
              >
                {currentStep === 5 ? "Agent is ready to use" : "Pending"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-wap-card border border-wap-card-border rounded-xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Need Help?</h3>

        <div className="space-y-3">
          <a
            href="#"
            className="flex items-center justify-between p-3 rounded-lg border border-wap-card-border/50 bg-[#09111e]/40 hover:bg-[#09111e]/90 transition-all group"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-4.5 w-4.5 text-wap-blue group-hover:scale-105 transition-transform" />
              <div>
                <span className="text-xs font-bold text-white block">Installation Guide</span>
                <span className="text-[10px] text-wap-text-secondary">Step-by-step instructions</span>
              </div>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-wap-text-muted group-hover:text-white transition-colors" />
          </a>

          <a
            href="#"
            className="flex items-center justify-between p-3 rounded-lg border border-wap-card-border/50 bg-[#09111e]/40 hover:bg-[#09111e]/90 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Wrench className="h-4.5 w-4.5 text-wap-amber group-hover:scale-105 transition-transform" />
              <div>
                <span className="text-xs font-bold text-white block">Troubleshooting</span>
                <span className="text-[10px] text-wap-text-secondary">Common issues and solutions</span>
              </div>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-wap-text-muted group-hover:text-white transition-colors" />
          </a>

          <a
            href="#"
            className="flex items-center justify-between p-3 rounded-lg border border-wap-card-border/50 bg-[#09111e]/40 hover:bg-[#09111e]/90 transition-all group"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="h-4.5 w-4.5 text-wap-purple group-hover:scale-105 transition-transform" />
              <div>
                <span className="text-xs font-bold text-white block">Contact Support</span>
                <span className="text-[10px] text-wap-text-secondary">Our team is available 24/7</span>
              </div>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-wap-text-muted group-hover:text-white transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}
