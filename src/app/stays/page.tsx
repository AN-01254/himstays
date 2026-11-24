import type { Metadata } from "next";
import { StaysBrowser } from "@/components/stays-browser";

export const metadata: Metadata = {
  title: "Stays",
  description: "Independent lodges in Kullu, Shimla, Kangra, Parvati, Spiti, and Bir.",
};

export default function Page() {
  return <StaysBrowser />;
}
