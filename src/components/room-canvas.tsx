"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import type { BedSize, WallFinish, WindowView } from "@/lib/types";

export type RoomMood = "open" | "held" | "blocked";
export type DayHour = 0 | 1 | 2 | 3;
export type RoomFocus = "bed" | "window" | "stove" | null;

type RoomCanvasProps = {
  wall: WallFinish;
  bed: BedSize;
  view: WindowView;
  fireplace: boolean;
  mood: RoomMood;
  hour: DayHour;
  turning: boolean;
  focus: RoomFocus;
};

const wallColor: Record<WallFinish, string> = {
  cedar: "#c9956a",
  stone: "#c4beb4",
  mud: "#c9a27c",
  lime: "#f3eadc",
};

const trimColor: Record<WallFinish, string> = {
  cedar: "#6b4128",
  stone: "#6e675e",
  mud: "#7a5a3a",
  lime: "#cbb892",
};

const floorColor: Record<WallFinish, string> = {
  cedar: "#9a643c",
  stone: "#8d6a48",
  mud: "#a97848",
  lime: "#a56b3f",
};

const rugColor: Record<WindowView, string> = {
  valley: "#7a3b32",
  ridge: "#2f3d4c",
  monastery: "#8a6232",
  river: "#1f4d55",
  desert: "#a15c38",
  meadow: "#3f5c45",
};

function skyFor(hour: DayHour): { sky: string; sun: string; intensity: number; ambient: number } {
  if (hour === 0) return { sky: "#f2c2a4", sun: "#ffd0a8", intensity: 0.9, ambient: 0.48 };
  if (hour === 1) return { sky: "#d5e4ef", sun: "#fff6e4", intensity: 1.25, ambient: 0.66 };
  if (hour === 2) return { sky: "#e7a27c", sun: "#ffb07a", intensity: 0.72, ambient: 0.4 };
  return { sky: "#172433", sun: "#9bb4d6", intensity: 0.14, ambient: 0.2 };
}

function Mat({
  color,
  roughness = 0.8,
  metalness = 0,
  emissive = "#000000",
  emissiveIntensity = 0,
}: {
  color: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

function Spin({ on, children }: { on: boolean; children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (on && ref.current) ref.current.rotation.y += delta * 0.22;
  });
  return <group ref={ref}>{children}</group>;
}

function FireGlow({ on }: { on: boolean }) {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const material = ref.current.material as MeshStandardMaterial;
    const flicker = on ? 1.1 + Math.sin(clock.elapsedTime * 8) * 0.35 : 0.08;
    material.emissiveIntensity = flicker;
  });
  return (
    <mesh ref={ref} position={[0, 0.36, 0.23]}>
      <boxGeometry args={[0.16, 0.22, 0.03]} />
      <meshStandardMaterial color="#ff9a3c" emissive="#ff6a1a" emissiveIntensity={on ? 1.2 : 0.05} />
    </mesh>
  );
}

function Bed({
  position,
  width,
  mood,
}: {
  position: [number, number, number];
  width: number;
  mood: RoomMood;
}) {
  const linen = mood === "open" ? "#f7f2ea" : mood === "held" ? "#d9cfc0" : "#cfc6b6";
  const throwColor = mood === "blocked" ? "#8d8a84" : "#7e3f2d";
  return (
    <group position={position}>
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.1, 0.28, 2.12]} />
        <Mat color="#5c3b28" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[width, 0.16, 2.02]} />
        <Mat color="#efe6d8" />
      </mesh>
      <mesh position={[0, 0.5, 0.15]} castShadow>
        <boxGeometry args={[width - 0.06, 0.08, 1.5]} />
        <Mat color={linen} />
      </mesh>
      <mesh position={[0, 0.55, 0.68]}>
        <boxGeometry args={[width - 0.08, 0.05, 0.42]} />
        <Mat color={throwColor} />
      </mesh>
      <mesh position={[-width * 0.2, 0.52, -0.78]} castShadow>
        <boxGeometry args={[width * 0.38, 0.1, 0.32]} />
        <Mat color="#fbf8f3" />
      </mesh>
      <mesh position={[width * 0.18, 0.52, -0.76]} castShadow>
        <boxGeometry args={[width * 0.34, 0.1, 0.3]} />
        <Mat color="#f3ece2" />
      </mesh>
      {mood === "held" ? (
        <mesh position={[width * 0.15, 0.62, 0.15]} castShadow>
          <boxGeometry args={[0.42, 0.16, 0.24]} />
          <Mat color="#3e4a3a" roughness={0.9} />
        </mesh>
      ) : null}
    </group>
  );
}

function Bukhari({ lit }: { lit: boolean }) {
  return (
    <group position={[1.55, 0, 0.95]}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.08, 16]} />
        <Mat color="#2a2826" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.58, 20]} />
        <Mat color="#2c2a28" metalness={0.55} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.08, 16]} />
        <Mat color="#3a3836" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.7, 10]} />
        <Mat color="#4a4744" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0.12, 0.74, 0.02]}>
        <sphereGeometry args={[0.09, 16, 12]} />
        <Mat color="#8d9398" metalness={0.75} roughness={0.28} />
      </mesh>
      <FireGlow on={lit} />
    </group>
  );
}

function FocusRing({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.26, 0.015, 8, 28]} />
      <meshStandardMaterial color="#c9843a" emissive="#c9843a" emissiveIntensity={0.55} />
    </mesh>
  );
}

function Deodar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.4, 6]} />
        <Mat color="#5a3a28" />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <coneGeometry args={[0.24, 0.5, 7]} />
        <Mat color="#2c4636" roughness={1} />
      </mesh>
      <mesh position={[0, 0.86, 0]}>
        <coneGeometry args={[0.16, 0.38, 7]} />
        <Mat color="#3d5c48" roughness={1} />
      </mesh>
    </group>
  );
}

function Outside({ view }: { view: WindowView }) {
  const desert = view === "desert";
  const ground = desert ? "#c9ae86" : view === "meadow" ? "#6e8f62" : "#5d7a58";
  const far = desert ? "#b08960" : "#8aa0a4";
  const near = desert ? "#d2b48c" : "#355843";
  const snow = desert ? "#e6d3b4" : "#f4f7f8";
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -5.2]}>
        <planeGeometry args={[14, 7]} />
        <Mat color={ground} roughness={1} />
      </mesh>
      {desert ? (
        <>
          <mesh position={[-1.8, 0.7, -6.4]}>
            <boxGeometry args={[2.4, 1.4, 1.6]} />
            <Mat color={near} roughness={1} />
          </mesh>
          <mesh position={[0.6, 1.15, -7.3]}>
            <boxGeometry args={[2.8, 2.3, 1.8]} />
            <Mat color={far} roughness={1} />
          </mesh>
          <mesh position={[2.6, 0.55, -6]}>
            <boxGeometry args={[1.8, 1.1, 1.4]} />
            <Mat color={snow} roughness={1} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[-2.3, 1.15, -6.8]}>
            <coneGeometry args={[1.5, 2.3, 5]} />
            <Mat color={near} roughness={1} />
          </mesh>
          <mesh position={[0.2, 1.7, -7.6]}>
            <coneGeometry args={[1.7, 3.4, 5]} />
            <Mat color={far} roughness={1} />
          </mesh>
          <mesh position={[0.2, 3.05, -7.6]}>
            <coneGeometry args={[0.45, 0.7, 5]} />
            <Mat color={snow} roughness={1} />
          </mesh>
          <mesh position={[2.5, 1.05, -6.4]}>
            <coneGeometry args={[1.35, 2.1, 5]} />
            <Mat color="#2f4d3c" roughness={1} />
          </mesh>
        </>
      )}
      {view === "monastery" ? (
        <group position={[-0.4, 0.02, -4.2]}>
          <mesh position={[0, 0.18, 0]}>
            <boxGeometry args={[0.7, 0.36, 0.7]} />
            <Mat color="#f4efe6" />
          </mesh>
          <mesh position={[0, 0.48, 0]}>
            <sphereGeometry args={[0.28, 18, 12]} />
            <Mat color="#d4a24a" metalness={0.35} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.78, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.28, 6]} />
            <Mat color="#e6c36a" metalness={0.4} />
          </mesh>
        </group>
      ) : null}
      {view === "river" || view === "valley" ? (
        <mesh rotation={[-Math.PI / 2, 0, 0.35]} position={[1.1, 0.04, -3.6]}>
          <planeGeometry args={[3.4, 0.32]} />
          <Mat color="#6e9aab" roughness={0.35} metalness={0.15} />
        </mesh>
      ) : null}
      {desert ? null : (
        <>
          <Deodar position={[-1.7, 0, -3.15]} />
          <Deodar position={[1.5, 0, -3.35]} />
          <Deodar position={[0.2, 0, -3.7]} />
        </>
      )}
    </group>
  );
}

function RoomModel({
  wall,
  bed,
  view,
  fireplace,
  mood,
  hour,
  turning,
  focus,
}: RoomCanvasProps) {
  const light = skyFor(hour);
  const width = 5.2;
  const depth = 4.4;
  const height = 2.55;
  const thickness = 0.1;
  const sill = 0.82;
  const windowHeight = 1.22;
  const windowTop = sill + windowHeight;
  const halfW = width / 2;
  const windowHalf = 1.1;
  const sideWidth = halfW - windowHalf;
  const fireLit = fireplace && mood !== "blocked" && hour !== 1;
  const lampOn = hour === 0 || hour === 2 || hour === 3;
  const bedWidth = bed === "king" ? 1.85 : bed === "queen" ? 1.5 : 0.9;

  return (
    <Spin on={turning}>
      <Outside view={view} />
      <mesh position={[0, -0.2, 0.15]} receiveShadow>
        <boxGeometry args={[width + 0.9, 0.18, depth + 1]} />
        <Mat color="#2a241e" roughness={0.92} />
      </mesh>
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[width, 0.1, depth]} />
        <Mat color={floorColor[wall]} roughness={0.74} />
      </mesh>
      <mesh position={[0, 0.02, 0.05]} receiveShadow>
        <boxGeometry args={[2.7, 0.03, 2.15]} />
        <Mat color={rugColor[view]} roughness={0.95} />
      </mesh>

      <mesh position={[0, sill / 2, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, sill, thickness]} />
        <Mat color={wallColor[wall]} />
      </mesh>
      <mesh position={[0, (height + windowTop) / 2, -depth / 2]} castShadow>
        <boxGeometry args={[width, height - windowTop, thickness]} />
        <Mat color={wallColor[wall]} />
      </mesh>
      <mesh position={[-halfW + sideWidth / 2, sill + windowHeight / 2, -depth / 2]}>
        <boxGeometry args={[sideWidth, windowHeight, thickness]} />
        <Mat color={wallColor[wall]} />
      </mesh>
      <mesh position={[halfW - sideWidth / 2, sill + windowHeight / 2, -depth / 2]}>
        <boxGeometry args={[sideWidth, windowHeight, thickness]} />
        <Mat color={wallColor[wall]} />
      </mesh>
      <mesh position={[0, sill + windowHeight / 2, -depth / 2 + 0.02]}>
        <planeGeometry args={[2.12, 1.14]} />
        <meshStandardMaterial color={light.sky} transparent opacity={0.35} roughness={0.05} />
      </mesh>
      <mesh position={[0, sill + windowHeight / 2, -depth / 2 + 0.04]}>
        <boxGeometry args={[0.04, windowHeight, 0.04]} />
        <Mat color={trimColor[wall]} />
      </mesh>
      <mesh position={[0, sill + windowHeight / 2, -depth / 2 + 0.04]}>
        <boxGeometry args={[2.16, 0.04, 0.04]} />
        <Mat color={trimColor[wall]} />
      </mesh>

      <mesh position={[-width / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[thickness, height, depth]} />
        <Mat color={wallColor[wall]} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[thickness, height, depth]} />
        <Mat color={wallColor[wall]} />
      </mesh>

      {[-1.4, 0, 1.4].map((x) => (
        <mesh key={x} position={[x, height - 0.08, 0]}>
          <boxGeometry args={[0.1, 0.1, depth]} />
          <Mat color={trimColor[wall]} />
        </mesh>
      ))}

      <mesh position={[0, 0.18, -1.85]} castShadow>
        <boxGeometry args={[2.05, 0.28, 0.38]} />
        <Mat color="#6b4128" />
      </mesh>
      <mesh position={[0, 0.34, -1.85]}>
        <boxGeometry args={[1.9, 0.06, 0.3]} />
        <Mat color={mood === "open" ? "#f4efe6" : "#d5cdc0"} />
      </mesh>

      {bed === "twin" ? (
        <>
          <Bed position={[-0.85, 0, -0.15]} width={bedWidth} mood={mood} />
          <Bed position={[0.25, 0, -0.15]} width={bedWidth} mood={mood} />
        </>
      ) : (
        <Bed position={[-0.55, 0, -0.15]} width={bedWidth} mood={mood} />
      )}

      <mesh position={[-1.85, 0.32, -1.15]} castShadow>
        <boxGeometry args={[0.38, 0.48, 0.38]} />
        <Mat color="#5c3b28" />
      </mesh>
      <mesh position={[-1.85, 0.66, -1.15]}>
        <cylinderGeometry args={[0.12, 0.14, 0.18, 16]} />
        <meshStandardMaterial
          color="#f3e2b8"
          emissive="#ffd39a"
          emissiveIntensity={lampOn ? 0.85 : 0.04}
          roughness={0.45}
        />
      </mesh>

      {fireplace ? <Bukhari lit={fireLit} /> : (
        <group position={[2.05, 0, 0.55]}>
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[0.55, 0.5, 0.34]} />
            <Mat color="#6a5038" />
          </mesh>
          <mesh position={[0, 0.58, 0]}>
            <boxGeometry args={[0.7, 0.06, 0.4]} />
            <Mat color="#5c3b28" />
          </mesh>
        </group>
      )}

      <mesh position={[-2.48, 1.15, -0.15]}>
        <boxGeometry args={[0.06, 1.6, 0.5]} />
        <Mat color="#6b4128" />
      </mesh>

      <mesh position={[-2.35, 1.45, -0.4]}>
        <boxGeometry args={[0.04, 0.46, 0.36]} />
        <Mat color="#efe6d4" />
      </mesh>
      <mesh position={[-2.33, 1.45, -0.4]}>
        <boxGeometry args={[0.02, 0.4, 0.3]} />
        <Mat color={view === "desert" ? "#d7b07a" : "#7f9aa4"} />
      </mesh>

      {focus === "bed" ? <FocusRing position={[-0.2, 1.15, -0.15]} /> : null}
      {focus === "window" ? <FocusRing position={[0, 1.7, -1.9]} /> : null}
      {focus === "stove" ? <FocusRing position={[1.55, 1.2, 0.95]} /> : null}

      <hemisphereLight args={["#f7f1e6", "#1e3a32", 0.35]} />
      <ambientLight intensity={light.ambient + 0.12} />
      <directionalLight position={[0.2, 2.4, -6]} intensity={0.55} color={light.sky} />
      <directionalLight
        position={[4.2, 6.4, 5.5]}
        intensity={light.intensity}
        color={light.sun}
      />
      {lampOn ? <pointLight position={[-1.85, 0.8, -1.15]} intensity={0.45} color="#ffd7a1" distance={4} /> : null}
      {fireLit ? <pointLight position={[1.55, 0.55, 1.15]} intensity={0.7} color="#ff8a3d" distance={3.5} /> : null}
    </Spin>
  );
}

function FrameCamera() {
  const camera = useThree((state) => state.camera);
  useLayoutEffect(() => {
    camera.position.set(0.15, 2.05, 6.6);
    camera.lookAt(0.1, 1.05, -0.6);
  }, [camera]);
  return null;
}

export function RoomCanvas(props: RoomCanvasProps) {
  const light = skyFor(props.hour);
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0.15, 2.05, 6.6], fov: 40 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[light.sky]} />
      <fog attach="fog" args={[light.sky, 12, 20]} />
      <FrameCamera />
      <RoomModel {...props} />
      <ContactShadows position={[0, -0.28, 0.1]} opacity={0.38} scale={14} blur={2.4} far={5} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        rotateSpeed={0.75}
        minPolarAngle={0.45}
        maxPolarAngle={1.35}
        target={[0.1, 1.05, -0.6]}
      />
    </Canvas>
  );
}
