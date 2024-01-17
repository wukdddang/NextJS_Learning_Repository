"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleEverythingLoaded = () => {
      setOpacity(1);
      setLoaded(true);
    };

    window.addEventListener("everythingLoaded", handleEverythingLoaded);

    return () => {
      window.removeEventListener("everythingLoaded", handleEverythingLoaded);
    };
  }, []);

  return (
    <>
      {!loaded ? (
        <div className="loader bg-white">Loading...</div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute bg-white w-[300px] h-[300px] top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] rounded-lg border-purple-600 border-4"
        >
          <Link href="/good">Google Login</Link>
        </motion.div>
      )}
      <Script src="/bundle.js" />
    </>
  );
}
