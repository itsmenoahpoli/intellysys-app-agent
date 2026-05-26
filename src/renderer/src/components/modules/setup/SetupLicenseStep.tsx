import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Key, HelpCircle, EyeOff, Eye, Info } from "lucide-react";
import { api } from "@renderer/utils/api";
import { useAppStore } from "@renderer/store/useAppStore";

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
  const { serverUrl, showToast } = useAppStore();
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  const onSubmit = async (data: LicenseSchemaType) => {
    setIsValidating(true);
    setValidationError(null);
    try {
      const response = await api.get<{
        id: string;
        status: string;
        expiry?: string;
        expiresAt?: string;
        expires?: string;
      }>(`/license-keys/${data.licenseKey}`, {
        customBaseUrl: serverUrl,
      });

      if (!response) {
        throw new Error("No response received from the server");
      }

      if (response.status !== "unused") {
        throw new Error(`License key is ${response.status || "invalid"} (must be unused)`);
      }

      const expiryDateStr = response.expiry || response.expiresAt || response.expires;
      if (!expiryDateStr) {
        throw new Error("License response is missing expiry date");
      }

      const expiryDate = new Date(expiryDateStr);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      if (expiryDate.getTime() <= todayStart.getTime()) {
        throw new Error("License key has expired");
      }

      setLicenseKey(data.licenseKey);
      showToast("License key verified successfully!", "success");
      onValidSubmit();
    } catch (err: any) {
      console.error("License key validation failed:", err);
      const message = err.message || "Failed to verify license key. Please check your server connection.";
      setValidationError(message);
      showToast(message, "error");
    } finally {
      setIsValidating(false);
    }
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
          {isValidating ? (
            <div className="absolute left-3.5 animate-spin h-4 w-4 border-2 border-wap-blue border-t-transparent rounded-full" />
          ) : (
            <Key className="absolute left-3.5 h-4 w-4 text-wap-text-secondary" />
          )}
          <input
            type={showKey ? "text" : "password"}
            disabled={isValidating}
            {...register("licenseKey")}
            onChange={(e) => {
              const formatted = formatLicenseKey(e.target.value);
              setValue("licenseKey", formatted, { shouldValidate: true });
              setValidationError(null);
            }}
            className={`w-full bg-wap-input border focus:border-wap-input-focus outline-none rounded-lg pl-10 pr-10 py-3 text-xs text-white placeholder-wap-text-muted font-mono tracking-wider transition-colors duration-150 ${
              errors.licenseKey || validationError ? "border-rose-500/80 focus:border-rose-500/80" : "border-wap-input-border"
            }`}
            placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
          />
          <button
            type="button"
            disabled={isValidating}
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3.5 text-wap-text-secondary hover:text-white transition-colors focus:outline-none disabled:opacity-50"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.licenseKey && (
          <p className="text-[10px] text-rose-400 font-semibold mt-1 animate-fadeIn">
            {errors.licenseKey.message}
          </p>
        )}
        {validationError && (
          <p className="text-[10px] text-rose-400 font-semibold mt-1 animate-fadeIn">
            {validationError}
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
