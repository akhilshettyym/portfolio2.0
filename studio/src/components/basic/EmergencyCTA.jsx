"use client";

import Image from "next/image";
import "@/styles/emergency_cta.css";
import { goToTop } from "@/utils/funct";
import { useRouter } from "next/navigation";
import { useDeviceType } from "@/hooks/useDeviceType";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

export default function EmergencyCTA() {
  const router = useRouter();
  const { isMobile } = useDeviceType();
  const { isTier2 } = usePerformanceTier();

  const handleRedirection = () => {
    router.push("/work");
    goToTop();
  };

  const renderMobile = () => {
    return (
      <div className="relative z-10">
        <div className="relative flex flex-row items-center overflow-hidden w-full bg-white px-10">
          <div className="flex-1 rounded-lg text-sm px-4 overflow-hidden min-w-0 flex items-center">
            <button
              onClick={handleRedirection}
              className="group block w-full cursor-pointer"
            >
              {isTier2 ? (
                <>
                  <div className="flex whitespace-nowrap">
                    <span className="text-sm uppercase tracking-normal font-medium text-black transition-colors duration-200 group-hover:text-indigo-600 group-hover:underline decoration-2 underline-offset-4 pointer-events-none">
                      PLEASE GO BACK AND VIEW ALL PROJECTS
                    </span>
                  </div>
                </>
              ) : (
                <div className="animate-marquee flex whitespace-nowrap">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span
                      key={i}
                      className="mx-8 text-sm uppercase tracking-normal font-medium text-black transition-colors duration-200 group-hover:text-indigo-600 group-hover:underline decoration-2 underline-offset-4 pointer-events-none"
                    >
                      IN CASE OF EMERGENCY. PLEASE GO BACK AND VIEW ALL PROJECTS
                    </span>
                  ))}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDesktop = () => {
    return (
      <div className="relative z-10">
        <div className="flex flex-row items-center overflow-hidden w-full bg-white px-10">
          <div className="flex-1 rounded-lg text-sm px-4 flex items-center justify-start min-w-0">
            <Image
              src="/footer/animated_qr_border.gif"
              alt="animated qr border"
              width={200}
              height={56}
              priority
              unoptimized
              style={{ width: "auto" }}
              className="w-auto h-auto z-10 object-contain mix-blend-multiply"
            />
          </div>

          <div className="flex-1 rounded-lg text-sm px-4 overflow-hidden min-w-0 flex items-center">
            <button
              onClick={handleRedirection}
              className="group block w-full cursor-pointer"
            >
              {isTier2 ? (
                <>
                  <div className="flex whitespace-nowrap">
                    <span className="mx-8 text-xs md:text-sm uppercase tracking-normal font-medium text-black transition-colors duration-200 group-hover:text-indigo-600 group-hover:underline decoration-2 underline-offset-4 pointer-events-none">
                      PLEASE GO BACK AND VIEW ALL PROJECTS
                    </span>
                  </div>
                </>
              ) : (
                <div className="animate-marquee flex whitespace-nowrap">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span
                      key={i}
                      className="mx-8 text-xs md:text-sm uppercase tracking-normal font-medium text-black transition-colors duration-200 group-hover:text-indigo-600 group-hover:underline decoration-2 underline-offset-4 pointer-events-none"
                    >
                      IN CASE OF EMERGENCY. PLEASE GO BACK AND VIEW ALL PROJECTS
                    </span>
                  ))}
                </div>
              )}
            </button>
          </div>

          <div className="flex-1 rounded-lg text-sm px-4 flex items-center justify-end min-w-0">
            <Image
              src="/footer/animated_qr_border.gif"
              alt="animated qr border"
              width={200}
              height={56}
              priority
              unoptimized
              style={{ width: "auto" }}
              className="w-auto h-auto z-10 object-contain mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    );
  };

  const render = () => {
    return isMobile ? renderMobile() : renderDesktop();
  };

  return render();
}
