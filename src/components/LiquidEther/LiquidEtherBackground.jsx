import { useEffect, useState } from "react";
import LiquidEther from "./LiquidEther";

const COLORS = ["#5227FF", "#FF9FFC", "#B497CF"];

export default function LiquidEtherBackground() {
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [interactionEnabled, setInteractionEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncPreferences = () => {
      setMotionEnabled(!reducedMotion.matches);
      setInteractionEnabled(finePointer.matches);
    };

    syncPreferences();
    reducedMotion.addEventListener("change", syncPreferences);
    finePointer.addEventListener("change", syncPreferences);
    return () => {
      reducedMotion.removeEventListener("change", syncPreferences);
      finePointer.removeEventListener("change", syncPreferences);
    };
  }, []);

  if (!motionEnabled) {
    return <div className="hero-liquid-ether hero-liquid-ether--static" aria-hidden="true" />;
  }

  return (
    <div className="hero-liquid-ether" data-liquid-ether-background aria-hidden="true">
      <LiquidEther
        mouseForce={20}
        cursorSize={100}
        isViscous={false}
        viscous={30}
        colors={COLORS}
        autoDemo
        autoSpeed={0.5}
        autoIntensity={2.2}
        isBounce
        resolution={0.5}
        interactionEnabled={interactionEnabled}
      />
    </div>
  );
}
