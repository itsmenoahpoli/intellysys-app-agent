import { Shield, Monitor, Cloud, FileText } from "lucide-react";

export function LoginHeader(): JSX.Element {
  return (
    <div className="flex-1 max-w-xl pr-0 md:pr-12 lg:pr-16 flex flex-col justify-center h-full py-8 md:py-0">
      <div className="flex items-center gap-5 mb-8">
        <div className="relative flex items-center justify-center w-[76px] h-[86px]">
          <svg
            className="w-full h-full text-wap-blue filter drop-shadow-[0_0_8px_rgba(13,110,253,0.3)]"
            viewBox="0 0 100 115"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 2L95 27.5V79.5L50 113L5 79.5V27.5L50 2Z"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(13, 110, 253, 0.05)"
            />
            <path
              d="M50 15L83 34V74L50 100L17 74V34L50 15Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeOpacity="0.4"
            />
            <circle cx="50" cy="22" r="5" fill="#38bdf8" />
            <circle cx="23" cy="71" r="5" fill="currentColor" />
            <circle cx="77" cy="71" r="5" fill="currentColor" />
            <line
              x1="50"
              y1="22"
              x2="50"
              y2="55"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <line
              x1="50"
              y1="55"
              x2="23"
              y2="71"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="50"
              y1="55"
              x2="77"
              y2="71"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="55"
              r="7"
              fill="currentColor"
              className="animate-ping"
              style={{ animationDuration: "3s" }}
            />
            <circle cx="50" cy="55" r="5" fill="#f8fafc" />
            <path
              d="M32 45L42 78L50 60L58 78L68 45"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.85"
            />
          </svg>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-wap-blue filter drop-shadow-[0_0_12px_rgba(13,110,253,0.2)]">
              WAP
            </span>
            <span className="text-3xl font-bold tracking-tight text-white">
              INTELLYSYS
            </span>
          </div>
          <div className="mt-1">
            <span className="inline-flex items-center justify-center px-3 py-0.5 rounded text-[10px] font-extrabold tracking-widest bg-wap-blue text-white uppercase shadow-md shadow-wap-blue/30 border border-wap-blue/50">
              AGENT
            </span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
        Security. Monitoring. Protection.
      </h2>
      <p className="text-sm text-wap-text-secondary mb-8">
        All in one lightweight agent.
      </p>

      <div className="space-y-5">
        <div className="flex items-start gap-4 group">
          <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-wap-green/10 border border-wap-green/30 text-wap-green transition-all duration-300 group-hover:scale-105 group-hover:bg-wap-green/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Real-time Protection
            </h4>
            <p className="text-xs text-wap-text-secondary mt-0.5 leading-relaxed">
              Protects your device against threats in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 group">
          <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-wap-sky/10 border border-wap-sky/30 text-wap-sky transition-all duration-300 group-hover:scale-105 group-hover:bg-wap-sky/20">
            <Monitor className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">
              System Monitoring
            </h4>
            <p className="text-xs text-wap-text-secondary mt-0.5 leading-relaxed">
              Monitors system health and performance 24/7.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 group">
          <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-wap-purple/10 border border-wap-purple/30 text-wap-purple transition-all duration-300 group-hover:scale-105 group-hover:bg-wap-purple/20">
            <Cloud className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Centralized Management
            </h4>
            <p className="text-xs text-wap-text-secondary mt-0.5 leading-relaxed">
              Managed and configured remotely from the WAP Intellysys Console.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 group">
          <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-wap-amber/10 border border-wap-amber/30 text-wap-amber transition-all duration-300 group-hover:scale-105 group-hover:bg-wap-amber/20">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Logs & Reporting
            </h4>
            <p className="text-xs text-wap-text-secondary mt-0.5 leading-relaxed">
              Collects logs and sends data securely to the server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
