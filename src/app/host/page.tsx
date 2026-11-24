import type { Metadata } from "next";
import { HostDesk } from "@/components/host-desk";

export const metadata: Metadata = {
  title: "Occupancy",
  description: "Tonight's keys, the next fortnight, and the nights the house is holding.",
};

export default function Page() {
  return <HostDesk />;
}
