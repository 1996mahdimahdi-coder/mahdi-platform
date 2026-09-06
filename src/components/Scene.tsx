"use client";

import { StructureFlowCollection } from "@/components/threeui/StructureFlowCollection";
import "@/shaders/threeui.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <StructureFlowCollection
        variant="fluid-field"
        hue={0}
        saturation={1.0}
        brightness={1.0}
      />
    </div>
  );
}
