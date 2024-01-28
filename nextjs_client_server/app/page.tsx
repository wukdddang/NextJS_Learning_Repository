"use client";

import ExampleClient from "@/components/ExampleClient";
import styles from "./page.module.css";

export default function Page() {
  console.log("Where do I render?");

  return (
    <main className={styles.main}>
      <h2>Welcome</h2>

      <ExampleClient />
    </main>
  );
}
