"use client";

import { useEffect } from "react";

/**
 * Route error boundary. Catches render-time errors anywhere in the app and
 * shows a branded retry screen instead of a blank "This page couldn't load",
 * keeping the site recoverable in production.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <div className="text-6xl font-bold tracking-tight mb-4">
        <span className="text-[#1e3a5f]">Inovasi</span>
        <span className="text-[#f97316]">in</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-3">
        Terjadi kendala memuat halaman
      </h1>
      <p className="text-[#475569] max-w-md mb-8">
        Maaf, ada yang tidak beres saat menampilkan halaman ini. Coba muat ulang
        — biasanya langsung pulih.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={reset}
          className="px-7 py-3 rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all">
          Coba lagi
        </button>
        {/* Intentional hard navigation: a full reload recovers from a broken
            client state better than client-side routing in an error boundary. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="px-7 py-3 rounded-full border-2 border-[#1e3a5f]/15 text-[#1e3a5f] font-medium hover:border-[#f97316] hover:text-[#c2410c] transition-all">
          Kembali ke beranda
        </a>
      </div>
    </div>
  );
}
