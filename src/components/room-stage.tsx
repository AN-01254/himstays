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
    loading: () => <div className="h-full w-full animate-pulse bg-driftwood" />,
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
        <div className="flex h-full items-end bg-warm-sand p-5 text-sm text-ink">
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
  const [hour, setHour] = useState<DayHour>(1);
  const [turning, setTurning] = useState(false);
  const [focus, setFocus] = useState<RoomFocus>(null);
  const [resetKey, setResetKey] = useState(0);
  const reduceMotion = useSyncExternalStore(subscribeMotion, motionPreference, () => false);

  const spinning = turning && !reduceMotion;
  const activeNote =
    focus === "window" ? notes?.window : focus === "bed" ? notes?.bed : focus === "stove" ? notes?.stove : null;

  return (
    <section className={framed ? "min-w-0 overflow-hidden rounded-[18px] bg-warm-sand shadow-subtle" : "min-w-0"}>
      <div className="flex items-start justify-between gap-3 px-5 py-5 sm:px-6">
        <div>
          <p className="text-[12px] tracking-[-0.48px] text-graphite">Room model</p>
          <h2 className="font-heading text-[30px] leading-[1.14] tracking-[-0.9px] text-ink">{name}</h2>
        </div>
        <p className="max-w-[12rem] text-right text-[14px] leading-[1.4] text-graphite">{moodLabel}</p>
      </div>
      <div className="relative mx-5 mb-2 h-[340px] overflow-hidden rounded-xl bg-[#eef3f6] sm:mx-6 sm:h-[460px] lg:h-[520px]">
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
        <p className="pointer-events-none absolute bottom-3 left-3 rounded-3xl bg-parchment/92 px-3 py-1 text-[12px] tracking-[-0.48px] text-graphite">
          Drag to turn the model
        </p>
      </div>
      <div className="flex flex-col gap-3 px-5 py-5 sm:px-6">
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
        {activeNote ? <p className="text-[16px] leading-[1.49] tracking-[-0.22px]">{activeNote}</p> : null}
      </div>
    </section>
  );
}
