import { Check, Laptop } from "lucide-react";

export function SetupCompleteStep(): JSX.Element {
  return (
    <div className="space-y-6 animate-fadeIn flex flex-col justify-center">
      <div className="flex items-center gap-4 mb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wap-green/10 border border-wap-green/30 text-wap-green">
          <Laptop className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">5. Setup Complete!</h3>
          <p className="text-xs text-wap-text-secondary mt-0.5">
            Your machine node is ready for defense deployment.
          </p>
        </div>
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex gap-3">
        <Check className="h-5 w-5 text-wap-green flex-shrink-0 mt-0.5" />
        <p className="text-xs text-wap-text-secondary leading-relaxed">
          The local service daemon has registered successfully. You can inspect telemetry nodes and
          activate shields in the Command Center.
        </p>
      </div>
    </div>
  );
}
