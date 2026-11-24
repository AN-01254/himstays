import type { Metadata } from "next";
import { HomeDesk } from "@/components/home-desk";

export const metadata: Metadata = {
  description:
    "Independent lodges in Himachal. See the house, which nights are open, and who holds the key.",
};

export default function Page() {
  return <HomeDesk />;
}
