import { useEffect, useState } from 'react'

export default function TitleBar(): JSX.Element {
  const [isMac, setIsMac] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    setIsMac(navigator.userAgent.includes('Mac OS X'))
    
    if (window.api && window.api.metrics) {
      window.api.metrics.get().then((metrics) => {
        setIsMac(metrics.platform === 'darwin')
      }).catch(err => console.log('Error reading platform:', err))
    }
  }, [])

  const handleMinimize = (): void => {
    if (window.api && window.api.window) {
      window.api.window.minimize()
    }
  }

  const handleMaximize = (): void => {
    if (window.api && window.api.window) {
      window.api.window.maximize()
      setIsMaximized(!isMaximized)
    }
  }

  const handleClose = (): void => {
    if (window.api && window.api.window) {
      window.api.window.close()
    }
  }

  const MacWindowControls = (): JSX.Element => (
    <div className="titlebar-no-drag group flex items-center gap-[8px] pl-4 pr-3 py-2">
      {/* Close button (Red) */}
      <button
        onClick={handleClose}
        title="Close"
        className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f56] border-[0.5px] border-black/15 active:bg-[#bf4940] transition-colors"
      >
        <svg
          className="h-[6px] w-[6px] text-[#4c0002] opacity-0 group-hover:opacity-100 transition-opacity duration-100"
          viewBox="0 0 6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        >
          <path d="M1.5 1.5L4.5 4.5M4.5 1.5L1.5 4.5" />
        </svg>
      </button>

      {/* Minimize button (Yellow) */}
      <button
        onClick={handleMinimize}
        title="Minimize"
        className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#ffbd2e] border-[0.5px] border-black/15 active:bg-[#bf8e22] transition-colors"
      >
        <svg
          className="h-[6px] w-[6px] text-[#5c3e00] opacity-0 group-hover:opacity-100 transition-opacity duration-100"
          viewBox="0 0 6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        >
          <path d="M1 3h4" />
        </svg>
      </button>

      {/* Maximize button (Green) */}
      <button
        onClick={handleMaximize}
        title={isMaximized ? 'Restore' : 'Maximize'}
        className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#27c93f] border-[0.5px] border-black/15 active:bg-[#1d962f] transition-colors"
      >
        <svg
          className="h-[6px] w-[6px] text-[#024d00] opacity-0 group-hover:opacity-100 transition-opacity duration-100"
          viewBox="0 0 6 6"
          fill="currentColor"
        >
          <path d="M0 2.5L2.5 0H0v2.5zM6 3.5L3.5 6H6V3.5z" />
        </svg>
      </button>
    </div>
  )

  const WindowsWindowControls = (): JSX.Element => (
    <div className="titlebar-no-drag flex h-full items-center">
      {/* Minimize */}
      <button
        onClick={handleMinimize}
        title="Minimize"
        className="flex h-full w-[46px] items-center justify-center text-slate-400 hover:bg-white/10 hover:text-slate-100 active:bg-white/5 transition-colors duration-100"
      >
        <svg className="h-[10px] w-[10px]" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
          <line x1="1" y1="5" x2="9" y2="5" />
        </svg>
      </button>

      {/* Maximize / Restore */}
      <button
        onClick={handleMaximize}
        title={isMaximized ? 'Restore' : 'Maximize'}
        className="flex h-full w-[46px] items-center justify-center text-slate-400 hover:bg-white/10 hover:text-slate-100 active:bg-white/5 transition-colors duration-100"
      >
        {isMaximized ? (
          <svg className="h-[10px] w-[10px]" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M3 1h6v6H7" />
            <rect x="1" y="3" width="6" height="6" />
          </svg>
        ) : (
          <svg className="h-[10px] w-[10px]" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="1" y="1" width="8" height="8" />
          </svg>
        )}
      </button>

      {/* Close */}
      <button
        onClick={handleClose}
        title="Close"
        className="flex h-full w-[46px] items-center justify-center text-slate-400 hover:bg-[#e81123] hover:text-white active:bg-[#f1707a] transition-colors duration-100"
      >
        <svg className="h-[10px] w-[10px]" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M1 1l8 8M9 1L1 9" />
        </svg>
      </button>
    </div>
  )

  const TitleLabel = (): JSX.Element => (
    <div className="flex items-center gap-2 pl-4 pr-3 titlebar-drag select-none">
      <svg className="h-4 w-4 text-wap-blue animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8v5M9 11h6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="13" r="1" fill="currentColor"/>
        <circle cx="12" cy="8" r="1" fill="currentColor"/>
        <circle cx="9" cy="11" r="1" fill="currentColor"/>
        <circle cx="15" cy="11" r="1" fill="currentColor"/>
      </svg>
      <span className="font-sans text-xs font-normal tracking-wide text-slate-400">
        WAP Intellysys Agent
      </span>
    </div>
  )

  return (
    <div className="relative titlebar-drag flex h-9 w-full items-center border-b border-wap-status-border bg-wap-status-bg select-none z-50">
      {isMac ? (
        <>
          {/* macOS Layout */}
          <MacWindowControls />
          
          {/* Centered Title */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
            <svg className="h-4 w-4 text-wap-blue animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8v5M9 11h6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="1" fill="currentColor"/>
              <circle cx="12" cy="8" r="1" fill="currentColor"/>
              <circle cx="9" cy="11" r="1" fill="currentColor"/>
              <circle cx="15" cy="11" r="1" fill="currentColor"/>
            </svg>
            <span className="font-sans text-xs font-normal tracking-wide text-slate-300">
              WAP Intellysys Agent
            </span>
          </div>
          
          {/* Draggable remaining space */}
          <div className="flex-1 titlebar-drag h-full" />
        </>
      ) : (
        <>
          {/* Windows / default Layout */}
          <TitleLabel />
          
          {/* Draggable remaining space */}
          <div className="flex-1 titlebar-drag h-full" />
          
          <WindowsWindowControls />
        </>
      )}
    </div>
  )
}
