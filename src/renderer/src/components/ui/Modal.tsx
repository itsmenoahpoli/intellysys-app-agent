import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  borderAccentClass?: string; // e.g. "bg-rose-600" or "bg-wap-blue"
  maxWidthClass?: string; // e.g. "max-w-sm"
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  borderAccentClass = "bg-wap-blue",
  maxWidthClass = "max-w-sm",
}: ModalProps): JSX.Element | null {
  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 animate-fadeIn pointer-events-auto">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className={`bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.65)] p-6 w-full ${maxWidthClass} animate-scaleIn relative overflow-hidden flex flex-col items-center text-center z-10`}>
        {borderAccentClass && (
          <div className={`absolute top-0 left-0 right-0 h-[3px] ${borderAccentClass}`} />
        )}
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-colors p-1 hover:bg-slate-800/50 rounded-lg cursor-pointer focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-base font-bold text-white tracking-tight mb-2 pr-6">
          {title}
        </h3>
        
        {children}
      </div>
    </div>
  );
}
