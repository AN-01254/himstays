import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StayExperience } from "@/components/stay-experience";
import { getProperty, properties } from "@/lib/catalog";

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return { title: "Lodge not on the desk" };
  return {
    title: property.name,
    description: property.summary,
  };
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="mx-auto h-80 w-full max-w-[1280px] animate-pulse bg-warm-sand/60 px-5 py-16" />}>
      <StayRoute params={params} />
    </Suspense>
  );
}

async function StayRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProperty(slug)) notFound();
  return <StayExperience slug={slug} />;
}
