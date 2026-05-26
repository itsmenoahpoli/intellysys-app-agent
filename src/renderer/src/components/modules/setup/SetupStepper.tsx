import { Check } from "lucide-react";

interface SetupStepperProps {
  currentStep: number;
}

export function SetupStepper({ currentStep }: SetupStepperProps): JSX.Element {
  return (
    <div className="relative flex items-center justify-between w-full max-w-2xl mb-8">
      <div className="absolute left-4 right-4 top-4 h-[1px] bg-wap-card-border z-0" />

      <div className="relative z-10 flex flex-col items-center gap-2 group cursor-default">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-wap-green text-white shadow-lg">
          <Check className="h-4.5 w-4.5 stroke-[3]" />
        </div>
        <span className="text-[10px] font-bold text-wap-green uppercase tracking-wide">Download</span>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2 group cursor-default">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-wap-green text-white shadow-lg">
          <Check className="h-4.5 w-4.5 stroke-[3]" />
        </div>
        <span className="text-[10px] font-bold text-wap-green uppercase tracking-wide">Run Installer</span>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2 group cursor-default">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full shadow-lg font-bold text-xs ${
            currentStep > 3 ? "bg-wap-green text-white" : "bg-wap-blue text-white"
          }`}
        >
          {currentStep > 3 ? <Check className="h-4 w-4 stroke-[3]" /> : "3"}
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wide ${
            currentStep > 3 ? "text-wap-green" : "text-wap-blue"
          }`}
        >
          License Key
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2 group cursor-default">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs transition-colors duration-150 ${
            currentStep === 4
              ? "bg-wap-blue text-white"
              : currentStep > 4
              ? "bg-wap-green text-white shadow-lg"
              : "bg-[#0a1424] border border-wap-card-border text-wap-text-muted"
          }`}
        >
          {currentStep > 4 ? <Check className="h-4 w-4 stroke-[3]" /> : "4"}
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wide transition-colors duration-150 ${
            currentStep === 4
              ? "text-wap-blue"
              : currentStep > 4
              ? "text-wap-green"
              : "text-wap-text-muted"
          }`}
        >
          Configure
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2 group cursor-default">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs transition-colors duration-150 ${
            currentStep === 5
              ? "bg-wap-blue text-white shadow-lg"
              : "bg-[#0a1424] border border-wap-card-border text-wap-text-muted"
          }`}
        >
          5
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wide transition-colors duration-150 ${
            currentStep === 5 ? "text-wap-blue" : "text-wap-text-muted"
          }`}
        >
          Complete
        </span>
      </div>
    </div>
  );
}
