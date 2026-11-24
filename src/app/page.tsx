import type { Metadata } from "next";
import { HomeDesk } from "@/components/home-desk";

export const metadata: Metadata = {
  description:
    "Turn a model of the room, see which nights are still open, and leave your name on the key.",
};

export default function Page() {
  return <HomeDesk />;
}
