import type { Metadata } from "next";
import { Scene } from "@/components/Scene";

export const metadata: Metadata = {
  title: "Scene — StructureFlowCollection fluid-field",
  description: "ThreeUI StructureFlowCollection fluid-field shader demo.",
};

export default function ScenePage() {
  return (
    <main className="scene-page">
      <Scene />
    </main>
  );
}
