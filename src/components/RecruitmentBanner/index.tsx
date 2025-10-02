"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

function RecruitmentBannerContent() {
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check for query param first - this takes priority
    if (searchParams.has("recruitment-drive")) {
      setIsVisible(true);
      sessionStorage.setItem("recruitment-banner-enabled", "true");
      sessionStorage.removeItem("recruitment-banner-disabled");

      // Remove the query param from URL
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("recruitment-drive");
      const newUrl = newSearchParams.toString()
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname;
      router.replace(newUrl, { scroll: false });
      return;
    }

    // Check if banner is disabled in session storage
    const bannerDisabled = sessionStorage.getItem(
      "recruitment-banner-disabled",
    );
    if (bannerDisabled === "true") {
      setIsVisible(false);
      return;
    }

    // Check if it was previously enabled
    const bannerEnabled = sessionStorage.getItem("recruitment-banner-enabled");
    setIsVisible(bannerEnabled === "true");
  }, [searchParams, pathname, router]);

  const handleDisable = () => {
    setIsVisible(false);
    sessionStorage.setItem("recruitment-banner-disabled", "true");
    sessionStorage.removeItem("recruitment-banner-enabled");
  };

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-[110] relative w-full bg-[#932f2f] text-white py-3 px-4 text-center">
      {/* Invisible button in top left to disable */}
      <button
        onClick={handleDisable}
        className="absolute top-0 left-0 w-12 h-12 opacity-0 cursor-pointer"
        aria-label="Disable recruitment banner"
      />

      <p className="text-sm sm:text-base">
        Come Build Canada with us! Join us on discord{" "}
        <a
          href="https://buildcanada.com/discord"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-200"
        >
          buildcanada.com/get-involved
        </a>
        !
      </p>
    </div>
  );
}

export function RecruitmentBanner() {
  return (
    <Suspense fallback={null}>
      <RecruitmentBannerContent />
    </Suspense>
  );
}
