import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TitleBar from "@components/TitleBar";
import { useAuth } from "@renderer/services/auth";
import { useAgent } from "@renderer/services/agent";
import { useAppStore } from "@renderer/store/useAppStore";
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

function MainLayout(): JSX.Element {
  const { serverUrl } = useAppStore();
  const { user, isLoggedIn } = useAuth();
  const { isConnected, isChecking } = useAgent(serverUrl);
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  return (
    <div className="relative flex flex-1 flex-col h-screen overflow-hidden bg-wap-bg text-wap-text select-none font-sans">
      <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[50%] rounded-full bg-wap-blue/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[45%] rounded-full bg-wap-sky/10 blur-[130px] pointer-events-none" />

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
            <>
              <ShieldCheck className="h-4 w-4 text-wap-green filter drop-shadow-[0_0_6px_rgba(16,185,129,0.4)] animate-pulse" />
              <span className="font-medium text-slate-300">
                Logged in as {user.email}
              </span>
            </>
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
