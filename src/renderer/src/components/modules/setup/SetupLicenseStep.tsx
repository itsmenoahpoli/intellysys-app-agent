import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Key, HelpCircle, EyeOff, Eye, Info } from "lucide-react";

interface SetupLicenseStepProps {
  licenseKey: string;
  setLicenseKey: (val: string) => void;
  formatLicenseKey: (val: string) => string;
  onValidSubmit: () => void;
}

const licenseSchema = z.object({
  licenseKey: z
    .string()
    .regex(
      /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
      "License key must be exactly 32 characters in XXXX-XXXX-... format"
    ),
});

type LicenseSchemaType = z.infer<typeof licenseSchema>;

export function SetupLicenseStep({
  licenseKey,
  setLicenseKey,
  formatLicenseKey,
  onValidSubmit,
}: SetupLicenseStepProps): JSX.Element {
  const [showKey, setShowKey] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LicenseSchemaType>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      licenseKey,
    },
  });

  const onSubmit = (data: LicenseSchemaType) => {
    setLicenseKey(data.licenseKey);
    onValidSubmit();
  };

  return (
    <form id="license-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-base font-bold text-white mb-2">3. Enter License Key</h3>
        <p className="text-xs text-wap-text-secondary leading-relaxed">
          Enter your license key to activate the agent. You can find your license key in the WAP
          Intellysys Console under Subscriptions.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-semibold text-wap-text-secondary tracking-wider uppercase">
            License Key
          </label>
          <a
            href="#"
            className="text-[11px] text-wap-blue hover:text-wap-sky transition-colors font-semibold flex items-center gap-1"
          >
            Where do I find my license key?
            <HelpCircle className="h-3 w-3" />
          </a>
        </div>

        <div className="relative flex items-center">
          <Key className="absolute left-3.5 h-4 w-4 text-wap-text-secondary" />
          <input
            type={showKey ? "text" : "password"}
            {...register("licenseKey")}
            onChange={(e) => {
              const formatted = formatLicenseKey(e.target.value);
              setValue("licenseKey", formatted, { shouldValidate: true });
            }}
            className={`w-full bg-wap-input border focus:border-wap-input-focus outline-none rounded-lg pl-10 pr-10 py-3 text-xs text-white placeholder-wap-text-muted font-mono tracking-wider transition-colors duration-150 ${
              errors.licenseKey ? "border-rose-500/80 focus:border-rose-500/80" : "border-wap-input-border"
            }`}
            placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3.5 text-wap-text-secondary hover:text-white transition-colors focus:outline-none"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.licenseKey && (
          <p className="text-[10px] text-rose-400 font-semibold mt-1">
            {errors.licenseKey.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-3 bg-wap-blue/5 border border-wap-blue/20 rounded-xl p-4">
        <Info className="h-4.5 w-4.5 text-wap-blue flex-shrink-0 mt-0.5" />
        <p className="text-xs text-wap-text-secondary leading-relaxed">
          The license key is case-insensitive. Ensure you have an active subscription for the license
          key to work.
        </p>
      </div>
    </form>
  );
}
