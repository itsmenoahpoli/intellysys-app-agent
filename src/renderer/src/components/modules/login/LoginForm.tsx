import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, Key, X } from "lucide-react";
import { useAuth } from "@renderer/services/auth";
import { useAppStore } from "@renderer/store/useAppStore";
import { getApiUrl } from "@renderer/utils/env";

interface LoginFormProps {
  onSuccess: () => void;
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  serverUrl: z.string().url("Please select or enter a valid URL"),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export function LoginForm({ onSuccess }: LoginFormProps): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const { serverUrl, setServerUrl, isConnected } = useAppStore();
  const { login, loading, error: authError } = useAuth();

  const defaultUrl = getApiUrl();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "employee@intellysys.local",
      password: "Intellysys@123",
      serverUrl: serverUrl || defaultUrl,
    },
  });

  useEffect(() => {
    if (serverUrl) {
      setValue("serverUrl", serverUrl, { shouldValidate: true });
    } else {
      setValue("serverUrl", defaultUrl, { shouldValidate: true });
    }
  }, [serverUrl, defaultUrl, setValue]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (authError) {
      setLocalError(authError);

      timer = setTimeout(() => {
        setLocalError(null);
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [authError]);

  const handleFormSubmit = async (data: LoginSchemaType) => {
    try {
      setServerUrl(data.serverUrl);
      await login(data.email, data.password, data.serverUrl);
      onSuccess();
    } catch (err) {
      console.error("Authentication failed:", err);
    }
  };

  return (
    <div className="flex-1 flex justify-center md:justify-end w-full max-w-md py-4 md:py-0">
      <div className="w-full bg-wap-card border border-wap-card-border rounded-xl p-7 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-wap-blue to-transparent" />

        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Login to your account
          </h3>
          <p className="text-xs text-wap-text-secondary mt-1">
            Enter your credentials to continue
          </p>
        </div>

        {localError && (
          <div className="bg-rose-500/25 border border-rose-500 text-rose-100 text-xs px-3.5 py-2.5 rounded-lg mb-4 text-center font-semibold shadow-[0_0_15px_rgba(244,63,94,0.3)] relative pr-8">
            <span>Failed to authenticate, please try again</span>
            <button
              type="button"
              onClick={() => setLocalError(null)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-rose-300 hover:text-white transition-colors cursor-pointer p-0.5 hover:bg-rose-500/20 rounded focus:outline-none"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-wap-text-secondary tracking-wider uppercase">
              Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-wap-text-secondary" />
              <input
                type="email"
                disabled={loading}
                {...register("email")}
                className={`w-full bg-wap-input border focus:border-wap-input-focus outline-none rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-wap-text-muted transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.email
                    ? "border-rose-500 focus:border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                    : "border-wap-input-border"
                }`}
                placeholder="admin@wapintellysys.com"
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-rose-300 font-bold mt-1 tracking-wide">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-wap-text-secondary tracking-wider uppercase">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-wap-text-secondary" />
              <input
                type={showPassword ? "text" : "password"}
                disabled={loading}
                {...register("password")}
                className={`w-full bg-wap-input border focus:border-wap-input-focus outline-none rounded-lg pl-10 pr-10 py-2.5 text-xs text-white placeholder-wap-text-muted tracking-wider transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.password
                    ? "border-rose-500 focus:border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                    : "border-wap-input-border"
                }`}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-wap-text-secondary hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[10px] text-rose-300 font-bold mt-1 tracking-wide">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                disabled={loading}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-wap-input-border bg-wap-input text-wap-blue focus:ring-0 w-4 h-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-wap-text-secondary font-medium">
                Remember me
              </span>
            </label>
            <a
              href="#"
              className="text-wap-blue hover:text-wap-sky transition-colors font-medium"
            >
              Forgot password?
            </a>
          </div>

          <div className="relative group w-full">
            <button
              type="submit"
              disabled={loading || !isConnected}
              className="w-full bg-wap-blue hover:bg-wap-blue-hover active:bg-wap-blue-dark disabled:bg-wap-blue/50 disabled:hover:scale-100 disabled:cursor-not-allowed text-white font-semibold text-xs py-3 rounded-lg shadow-lg shadow-wap-blue/20 hover:shadow-wap-blue/30 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </button>

            {!isConnected && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3.5 py-2 bg-rose-600 border border-rose-700 text-white text-[11px] font-bold rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.35)] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap z-50">
                <div className="relative flex flex-col items-center">
                  <span>App is offline. Not connected to server.</span>
                  <div className="absolute top-[22px] border-[5px] border-transparent border-t-rose-600 w-0 h-0" />
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="flex items-center my-5 text-[10px] text-wap-text-muted font-bold tracking-widest uppercase">
          <div className="flex-1 h-[1px] bg-wap-card-border" />
          <span className="px-3">or</span>
          <div className="flex-1 h-[1px] bg-wap-card-border" />
        </div>

        <button
          type="button"
          disabled={loading || !isConnected}
          className="w-full border border-wap-blue/40 hover:border-wap-blue hover:bg-wap-blue/5 text-wap-blue hover:text-wap-sky font-semibold text-xs py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
        >
          <Key className="h-4 w-4" />
          Use API Token
        </button>

        <div className="text-center mt-6 text-xs text-wap-text-secondary">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-wap-blue hover:text-wap-sky transition-colors font-semibold"
          >
            Contact your administrator
          </a>
        </div>
      </div>
    </div>
  );
}
