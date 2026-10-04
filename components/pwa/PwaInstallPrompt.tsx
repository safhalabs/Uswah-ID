"use client";

import { useState, useEffect } from "react";
import { Download, X, Sparkles, Smartphone, Monitor } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in this session
    if (typeof window !== "undefined" && sessionStorage.getItem("uswah_pwa_dismissed")) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("uswah_pwa_dismissed", "true");
    }
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-16 md:bottom-5 left-4 right-4 md:left-auto md:right-5 z-40 max-w-sm rounded-2xl bg-white dark:bg-[#071d13] p-3.5 border border-emerald-500/30 shadow-2xl text-slate-900 dark:text-slate-100 flex items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
          <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="text-left">
          <h5 className="font-bold text-xs tracking-tight">
            Pasang Aplikasi Uswah.id
          </h5>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Akses offline instan di desktop / layar HP
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstall}
          type="button"
          className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
        >
          Pasang
        </button>
        <button
          onClick={handleDismiss}
          type="button"
          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
