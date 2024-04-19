import Link from "next/link";

export default function ProjectList() {
  return (
    <main>
      <h1>ProjectList</h1>

      <ul>
        <li>
          <Link href="/projects/jobit">JobIt</Link>
        </li>
        <li>
          <Link href="/projects/carrent">Car Rent</Link>
        </li>
        <li>
          <Link href="/projects/hipnode">hipnode</Link>
        </li>
      </ul>
    </main>
  );
}
