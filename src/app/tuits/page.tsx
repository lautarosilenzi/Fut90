import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TimelineFeed } from "@/components/timeline/TimelineFeed";

export const metadata: Metadata = { title: "Tuits" };
export const dynamic = "force-dynamic";

export default function TuitsPage() {
  return (
    <div className="flex flex-col gap-4">
      <SectionHeading title="Tuits" />
      <TimelineFeed />
    </div>
  );
}
