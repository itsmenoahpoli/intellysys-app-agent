import { useState, useEffect, useRef } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Info as InfoIcon,
  X,
  User as UserIcon,
  CreditCard,
  LogOut,
  ChevronUp,
} from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TitleBar from "@components/TitleBar";
import { Modal } from "@components";
import { useAuth } from "@renderer/services/auth";
import { useAgent } from "@renderer/services/agent";
import { useAppStore, Toast } from "@renderer/store/useAppStore";
import LoginView from "@renderer/views/LoginView";
import SetupView from "@renderer/views/SetupView";
import DashboardView from "@renderer/views/DashboardView";
import SettingsView from "@renderer/views/SettingsView";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }): JSX.Element {
  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-emerald-600/90 border-emerald-500/50 shadow-emerald-950/30",
          text: "text-white",
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-100 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" />,
          closeBtn: "text-emerald-200 hover:text-white hover:bg-emerald-700/50",
        };
      case "error":
        return {
          bg: "bg-rose-600/90 border-rose-500/50 shadow-rose-950/30",
          text: "text-white",
          icon: <XCircle className="h-5 w-5 text-rose-100 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" />,
          closeBtn: "text-rose-200 hover:text-white hover:bg-rose-700/50",
        };
      case "info":
        return {
          bg: "bg-sky-600/95 border-sky-500/50 shadow-sky-950/30",
          text: "text-white",
          icon: <InfoIcon className="h-5 w-5 text-sky-100 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" />,
          closeBtn: "text-sky-200 hover:text-white hover:bg-sky-700/50",
        };
      case "warning":
      default:
        return {
          bg: "bg-amber-600/95 border-amber-500/50 shadow-amber-950/30",
          text: "text-white",
          icon: <InfoIcon className="h-5 w-5 text-amber-100 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" />,
          closeBtn: "text-amber-200 hover:text-white hover:bg-amber-700/50",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`flex items-center justify-between w-80 backdrop-blur-md border rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-slideInRight pointer-events-auto transition-all duration-300 hover:scale-[1.02] ${styles.bg}`}
    >
      <div className="flex items-center gap-3.5">
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="flex flex-col">
          <span className={`text-xs font-semibold leading-snug ${styles.text}`}>
            {toast.message}
          </span>
        </div>
      </div>
      <button
        onClick={onClose}
        className={`flex-shrink-0 ml-3 transition-colors p-1 rounded-lg cursor-pointer focus:outline-none ${styles.closeBtn}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function MainLayout(): JSX.Element {
  const { serverUrl, toasts, removeToast, showToast } = useAppStore();
  const { user, isLoggedIn, logout } = useAuth();
  const { isConnected, isChecking } = useAgent(serverUrl);
  const location = useLocation();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isLoginPage = location.pathname === "/";
  const isSetupPage = location.pathname === "/setup";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex flex-1 flex-col h-screen overflow-hidden bg-wap-bg text-wap-text select-none font-sans">
      <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[50%] rounded-full bg-wap-blue/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[45%] rounded-full bg-wap-sky/10 blur-[130px] pointer-events-none" />

      {/* Toast Container */}
      <div className="absolute top-16 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      <TitleBar />

      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/setup" element={<SetupView />} />
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/settings" element={<SettingsView />} />
      </Routes>

      <div className="absolute bottom-10 left-0 right-0 h-40 pointer-events-none opacity-40 z-0">
        <svg
          className="w-full h-full text-wap-blue"
          viewBox="0 0 1440 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120C120 125 240 140 360 145C480 150 600 130 720 115C840 100 960 90 1080 100C1200 110 1320 140 1440 160V200H0V120Z"
            fill="url(#wave-gradient)"
          />
          <path
            d="M0 130C200 110 400 160 600 150C800 140 1000 100 1200 120C1300 130 1380 150 1440 160"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.25"
            strokeDasharray="5 5"
          />
          <path
            d="M0 160C150 130 300 180 450 180C600 180 750 130 900 140C1050 150 1200 170 1350 160C1380 158 1410 155 1440 150"
            stroke="#38bdf8"
            strokeWidth="1"
            strokeOpacity="0.2"
          />
          <defs>
            <linearGradient
              id="wave-gradient"
              x1="720"
              y1="90"
              x2="720"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="currentColor" stopOpacity="0" />
              <stop offset="0.5" stopColor="currentColor" stopOpacity="0.05" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.12" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute bottom-13 left-8 text-[11px] text-wap-text-secondary font-medium tracking-wide z-10">
        Version 2.3.1
      </div>

      <div className="flex h-10 w-full items-center justify-between border-t border-wap-status-border bg-wap-status-bg px-5 text-xs text-wap-text-secondary z-20">
        <div className="flex items-center gap-2">
          {!isLoginPage && isLoggedIn && user?.email && (
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-slate-800/40 px-2 py-1 rounded-md transition-all duration-150 cursor-pointer focus:outline-none"
              >
                <ShieldCheck className="h-4 w-4 text-wap-green filter drop-shadow-[0_0_6px_rgba(16,185,129,0.4)] animate-pulse" />
                <span className="font-medium text-slate-300">
                  Logged in as {user.email}
                </span>
                <ChevronUp className="h-3 w-3 text-slate-400" />
              </button>

              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute bottom-full left-0 mb-2 w-56 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-[0_-8px_32px_rgba(0,0,0,0.6)] p-1.5 z-50 animate-fadeInUp flex flex-col gap-0.5"
                >
                  <div className="px-2.5 py-1.5 border-b border-slate-800/80 mb-1">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">User Options</p>
                    <p className="text-xs font-medium text-slate-300 truncate mt-0.5">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      showToast("Account details are managed by your administrator", "info");
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all duration-150 cursor-pointer text-left w-full focus:outline-none"
                  >
                    <UserIcon className="h-4 w-4 text-slate-400" />
                    <span>My Account</span>
                  </button>

                  <button
                    disabled={isSetupPage}
                    onClick={() => {
                      if (!isSetupPage) {
                        showToast("Redirecting to subscription management...", "info");
                        setIsDropdownOpen(false);
                      }
                    }}
                    className={`flex items-center justify-between px-2.5 py-2 text-xs font-semibold rounded-lg transition-all duration-150 text-left w-full focus:outline-none ${
                      isSetupPage
                        ? "opacity-35 cursor-not-allowed text-slate-500"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                      <span>Manage Subscription</span>
                    </div>
                    {isSetupPage && (
                      <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                        Locked
                      </span>
                    )}
                  </button>

                  <div className="h-[1px] bg-slate-800/80 my-1" />

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all duration-150 cursor-pointer text-left w-full focus:outline-none"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-400">
            {isChecking
              ? "Checking server..."
              : isConnected
                ? "Connected to server"
                : "Not connected to server"}
          </span>
          <span className="relative flex h-2 w-2">
            {isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </>
            )}
          </span>
        </div>
      </div>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Sign Out"
        borderAccentClass="bg-rose-600"
        maxWidthClass="max-w-sm"
      >
        <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-4 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.25)]">
          <LogOut className="h-6 w-6 animate-pulse" style={{ animationDuration: '3s' }} />
        </div>

        <p className="text-xs text-wap-text-secondary leading-relaxed mb-6">
          Are you sure you want to end your active session? You will be redirected to the login page and need to enter your credentials to sign in again.
        </p>

        <div className="flex w-full gap-3">
          <button
            onClick={() => setIsLogoutModalOpen(false)}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-800 hover:bg-slate-800/40 text-xs text-slate-300 font-bold transition-all duration-150 cursor-pointer focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              logout();
              showToast("Logged out successfully", "info");
              setIsLogoutModalOpen(false);
              navigate("/");
            }}
            className="flex-1 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold shadow-lg shadow-rose-600/20 hover:shadow-rose-600/30 transition-all duration-150 cursor-pointer focus:outline-none"
          >
            Sign Out
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <MainLayout />
      </Router>
    </QueryClientProvider>
  );
}
