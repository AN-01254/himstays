"use client";

import dynamic from "next/dynamic";
import { Component, useState, useSyncExternalStore, type ReactNode } from "react";
import type { DayHour, RoomFocus, RoomMood } from "@/components/room-canvas";
import { Button } from "@/components/ui/button";
import type { BedSize, WallFinish, WindowView } from "@/lib/types";

const RoomCanvas = dynamic(
  () => import("@/components/room-canvas").then((mod) => mod.RoomCanvas),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-[#e7dccb]" />,
  },
);

class ModelBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-full items-end bg-[#e7d3bc] p-5 text-sm text-[#1c1914]">
          This browser could not draw the room model. The nights on the desk still book.
        </div>
      );
    }
    return this.props.children;
  }
}

function subscribeMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function motionPreference() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const hours: { id: DayHour; label: string }[] = [
  { id: 0, label: "Dawn" },
  { id: 1, label: "Afternoon" },
  { id: 2, label: "Dusk" },
  { id: 3, label: "Night" },
];

type RoomStageProps = {
  name: string;
  wall: WallFinish;
  bed: BedSize;
  view: WindowView;
  fireplace: boolean;
  mood: RoomMood;
  moodLabel: string;
  notes?: { window: string; bed: string; stove: string };
  framed?: boolean;
};

export function RoomStage({
  name,
  wall,
  bed,
  view,
  fireplace,
  mood,
  moodLabel,
  notes,
  framed = true,
}: RoomStageProps) {
  const [hour, setHour] = useState<DayHour>(2);
  const [turning, setTurning] = useState(false);
  const [focus, setFocus] = useState<RoomFocus>(null);
  const [resetKey, setResetKey] = useState(0);
  const reduceMotion = useSyncExternalStore(subscribeMotion, motionPreference, () => false);

  const spinning = turning && !reduceMotion;
  const activeNote =
    focus === "window" ? notes?.window : focus === "bed" ? notes?.bed : focus === "stove" ? notes?.stove : null;

  return (
    <section className={framed ? "min-w-0 overflow-hidden rounded-3xl border border-[#e0d4c2] bg-[#faf7f2]" : "min-w-0"}>
      <div className="flex items-start justify-between gap-3 px-4 py-3 sm:px-5">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-[#8c4a2f] uppercase">Room model</p>
          <h2 className="font-heading text-2xl text-[#1c1914]">{name}</h2>
        </div>
        <p className="max-w-[12rem] text-right text-sm text-[#5c5348]">{moodLabel}</p>
      </div>
      <div className="relative h-[340px] bg-[#d7c3a8] sm:h-[460px] lg:h-[520px]">
        <ModelBoundary>
          <RoomCanvas
            key={`${name}-${resetKey}`}
            wall={wall}
            bed={bed}
            view={view}
            fireplace={fireplace}
            mood={mood}
            hour={hour}
            turning={spinning}
            focus={focus}
          />
        </ModelBoundary>
        <p className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-[#faf7f2]/90 px-3 py-1 text-xs text-[#5c5348]">
          Drag to turn the model
        </p>
      </div>
      <div className="flex flex-col gap-3 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          {hours.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={hour === item.id ? "default" : "outline"}
              aria-pressed={hour === item.id}
              onClick={() => setHour(item.id)}
            >
              {item.label}
            </Button>
          ))}
          {reduceMotion ? null : (
            <Button
              type="button"
              size="sm"
              variant={spinning ? "default" : "outline"}
              aria-pressed={spinning}
              onClick={() => setTurning((value) => !value)}
            >
              {spinning ? "Stop turning" : "Turn it"}
            </Button>
          )}
          <Button type="button" size="sm" variant="ghost" onClick={() => setResetKey((value) => value + 1)}>
            Reset view
          </Button>
        </div>
        {notes ? (
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["window", "Window"],
                ["bed", "Bed"],
                ["stove", fireplace ? "Bukhari" : "Heat"],
              ] as const
            ).map(([id, label]) => (
              <Button
                key={id}
                type="button"
                size="sm"
                variant={focus === id ? "secondary" : "outline"}
                aria-pressed={focus === id}
                onClick={() => setFocus((current) => (current === id ? null : id))}
              >
                {label}
              </Button>
            ))}
          </div>
        ) : null}
        {activeNote ? <p className="text-sm leading-6 text-[#3f382f]">{activeNote}</p> : null}
      </div>
    </section>
  );
}
