"use client";

import { FluidFieldBackground } from "@/shaders/neuform-isolated/NeuformCraftEffects";

export type StructureFlowCollectionProps = {
  variant: "fluid-field";
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function StructureFlowCollection({
  variant,
  hue,
  saturation,
  brightness,
  className,
  style,
}: StructureFlowCollectionProps) {
  switch (variant) {
    case "fluid-field":
      return (
        <FluidFieldBackground
          hue={hue}
          saturation={saturation}
          brightness={brightness}
          className={className}
          style={style}
        />
      );
    default:
      return null;
  }
}