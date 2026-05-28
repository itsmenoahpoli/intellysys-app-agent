import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Key, HelpCircle, EyeOff, Eye, Info } from "lucide-react";
import { api } from "@renderer/utils/api";
import { useAppStore } from "@renderer/store/useAppStore";
import { Modal } from "@components";

interface SetupLicenseStepProps {
  licenseKey: string;
  setLicenseKey: (val: string) => void;
  formatLicenseKey: (val: string) => string;
  onValidSubmit: () => void;
  onValidationStateChange: (state: { isValid: boolean; isChecking: boolean }) => void;
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
  onValidationStateChange,
}: SetupLicenseStepProps): JSX.Element {
  const { serverUrl, showToast, setLicenseKey: setStoredLicenseKey } = useAppStore();
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLicenseValid, setIsLicenseValid] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LicenseSchemaType>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      licenseKey,
    },
  });

  const watchedLicenseKey = watch("licenseKey");
  const hasFormatError = useMemo(() => Boolean(errors.licenseKey), [errors.licenseKey]);
  const invalidHint = errors.licenseKey?.message || validationError;
  const inputBorderClass =
    isLicenseValid && !invalidHint
      ? "border-emerald-500/80 focus:border-emerald-400/90"
      : invalidHint
        ? "border-amber-400/80 focus:border-amber-300/90"
        : "border-wap-input-border";

  useEffect(() => {
    const formatted = watchedLicenseKey ?? "";
    const isComplete = formatted.length === 39 && !hasFormatError;

    if (!isComplete) {
      setIsLicenseValid(false);
      onValidationStateChange({ isValid: false, isChecking: false });
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setIsValidating(true);
      onValidationStateChange({ isValid: false, isChecking: true });
      try {
        const response = await api.get<{
          success: boolean;
          data?: {
            status: string;
            expiresAt?: string;
            expiry?: string;
            expires?: string;
          };
        }>(`/license-keys/${formatted}`, {
          customBaseUrl: serverUrl,
        });

        if (!response?.data) {
          throw new Error("No response received from the server");
        }
        if (response.data.status !== "unused") {
          throw new Error(`License key is ${response.data.status || "invalid"} (must be unused)`);
        }

        const expiryDateStr =
          response.data.expiresAt || response.data.expiry || response.data.expires;
        if (!expiryDateStr) {
          throw new Error("License key expiry date is missing");
        }
        if (new Date(expiryDateStr).getTime() <= Date.now()) {
          throw new Error("License key has expired");
        }

        if (!cancelled) {
          setValidationError(null);
          setIsLicenseValid(true);
          onValidationStateChange({ isValid: true, isChecking: false });
        }
      } catch (err: any) {
        if (!cancelled) {
          const message =
            err.message || "Failed to verify license key. Please check your server connection.";
          setValidationError(message);
          setIsLicenseValid(false);
          onValidationStateChange({ isValid: false, isChecking: false });
        }
      } finally {
        if (!cancelled) {
          setIsValidating(false);
        }
      }
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [watchedLicenseKey, hasFormatError, serverUrl, onValidationStateChange]);

  const consumeAndProceed = async (data: LicenseSchemaType) => {
    setIsValidating(true);
    setValidationError(null);
    try {
      const response = await api.post<{
        success: boolean;
        data?: {
          id: string;
          status: string;
          expiry?: string;
          expiresAt?: string;
          expires?: string;
        };
      }>(
        "/license-keys/validate",
        { code: data.licenseKey },
        {
        customBaseUrl: serverUrl,
        }
      );

      if (!response?.data) {
        throw new Error("No response received from the server");
      }

      const license = response.data;

      if (license.status !== "used") {
        throw new Error(`License key validation returned unexpected status: ${license.status || "unknown"}`);
      }

      setStoredLicenseKey(data.licenseKey);
      setLicenseKey(data.licenseKey);
      showToast("License key verified successfully!", "success");
      setIsConfirmOpen(false);
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
    <>
      <form
        id="license-form"
        onSubmit={handleSubmit(() => setIsConfirmOpen(true))}
        className="space-y-6 animate-fadeIn"
      >
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
              setLicenseKey(formatted);
              setIsLicenseValid(false);
              setValidationError(null);
              onValidationStateChange({ isValid: false, isChecking: false });
            }}
            className={`w-full bg-wap-input border outline-none rounded-lg pl-10 pr-10 py-3 text-xs text-white placeholder-wap-text-muted font-mono tracking-wider transition-colors duration-150 ${inputBorderClass}`}
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
        {invalidHint && (
          <p className="text-[10px] text-amber-300 font-semibold mt-1 animate-fadeIn">
            {invalidHint}
          </p>
        )}
        {isLicenseValid && !invalidHint && (
          <p className="text-[10px] text-emerald-300 font-semibold mt-1 animate-fadeIn">
            License key is valid and ready to activate.
          </p>
        )}
      </div>

      <div className="flex items-start gap-3 bg-wap-blue/5 border border-wap-blue/20 rounded-xl p-4">
        <Info className="h-4.5 w-4.5 text-wap-blue shrink-0 mt-0.5" />
        <p className="text-xs text-wap-text-secondary leading-relaxed">
          The license key is case-insensitive. Ensure you have an active subscription for the license
          key to work.
        </p>
      </div>
      </form>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirm License Activation"
        borderAccentClass="bg-wap-blue"
        maxWidthClass="max-w-md"
      >
        <p className="text-xs text-wap-text-secondary leading-relaxed mb-6">
          Confirm to activate this license key for this device. This action will mark the key as
          used.
        </p>
        <div className="w-full flex gap-3">
          <button
            type="button"
            onClick={() => setIsConfirmOpen(false)}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-800 hover:bg-slate-800/40 text-xs text-slate-300 font-bold transition-all duration-150 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isValidating || !isLicenseValid}
            onClick={handleSubmit(consumeAndProceed)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-wap-blue hover:bg-wap-blue-hover disabled:bg-wap-blue/50 text-xs text-white font-bold transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
          >
            {isValidating ? "Validating..." : "Confirm"}
          </button>
        </div>
      </Modal>
    </>
  );
}
