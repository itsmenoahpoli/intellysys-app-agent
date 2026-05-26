import { Info } from "lucide-react";

export function SetupConfigureStep(): JSX.Element {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-base font-bold text-white mb-2">4. Configure Connection Settings</h3>
        <p className="text-xs text-wap-text-secondary leading-relaxed">
          Select and confirm the secure background bridge parameters.
        </p>
      </div>

      <div className="bg-[#09111e]/40 border border-wap-card-border rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-wap-text-secondary">Default Node Link:</span>
          <span className="text-white font-mono font-semibold">https://app.wapintellysys.com</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-wap-text-secondary">Adapter Interface:</span>
          <span className="text-white font-mono">en0 (Wi-Fi)</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-wap-text-secondary">Security Protocol:</span>
          <span className="text-wap-green font-semibold">TLSv1.3 (Encrypted)</span>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-wap-blue/5 border border-wap-blue/20 rounded-xl p-4">
        <Info className="h-4.5 w-4.5 text-wap-blue flex-shrink-0 mt-0.5" />
        <p className="text-xs text-wap-text-secondary leading-relaxed">
          The agent defaults to outbound port 443. Outbound bridges do not require active firewalls
          triggers open.
        </p>
      </div>
    </div>
  );
}
