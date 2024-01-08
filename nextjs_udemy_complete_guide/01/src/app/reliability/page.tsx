import reliabilityImg from "/public/reliability.jpg";
import Hero from "@/components/hero";

export default function ReliabilityPage() {
  return (
    <div>
      <Hero
        imgData={reliabilityImg}
        imgAlt="welding"
        title="Super high reliability hosting"
      />
    </div>
  );
}
