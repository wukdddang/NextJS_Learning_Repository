"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleBundleLoaded = () => {
      setIsLoading(false);
    };

    window.addEventListener("bundleLoaded", handleBundleLoaded);

    return () => {
      window.removeEventListener("bundleLoaded", handleBundleLoaded);
    };
  }, []);

  return (
    <>
      {!isLoading ? (
        <div className="absolute bg-white w-[300px] h-[300px] top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] rounded-lg border-purple-600 border-4">
          <Link href="/good">Google Login</Link>
        </div>
      ) : (
        <div className="loader">Loading...</div> // 여기에 커스텀 로더를 넣으세요.
      )}
      <Script src="/bundle.js" />
    </>
  );
}
