import { lazy, Suspense, useEffect, useState } from "react";

const LiquidEther = lazy(() => import("./LiquidEther"));

const COLORS = ["#5227FF", "#FF9FFC", "#B497CF"];

export default function LiquidEtherBackground() {
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [interactionEnabled, setInteractionEnabled] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const smallScreen = window.matchMedia("(max-width: 719px)");
    const connection = navigator.connection;
    let firstPaintFrame = 0;
    const syncPreferences = () => {
      const constrainedDevice = smallScreen.matches
        || (navigator.deviceMemory ?? 8) <= 4
        || (navigator.hardwareConcurrency ?? 8) <= 4;
      setMotionEnabled(!reducedMotion.matches && !connection?.saveData);
      setInteractionEnabled(finePointer.matches);
      setLowPower(constrainedDevice);
    };

    firstPaintFrame = window.requestAnimationFrame(() => {
      firstPaintFrame = window.requestAnimationFrame(syncPreferences);
    });
    reducedMotion.addEventListener("change", syncPreferences);
    finePointer.addEventListener("change", syncPreferences);
    smallScreen.addEventListener("change", syncPreferences);
    connection?.addEventListener?.("change", syncPreferences);
    return () => {
      window.cancelAnimationFrame(firstPaintFrame);
      reducedMotion.removeEventListener("change", syncPreferences);
      finePointer.removeEventListener("change", syncPreferences);
      smallScreen.removeEventListener("change", syncPreferences);
      connection?.removeEventListener?.("change", syncPreferences);
    };
  }, []);

  if (!motionEnabled) {
    return <div className="hero-liquid-ether hero-liquid-ether--static" aria-hidden="true" />;
  }

  return (
    <Suspense fallback={<div className="hero-liquid-ether hero-liquid-ether--static" aria-hidden="true" />}>
      <div className="hero-liquid-ether" data-liquid-ether-background aria-hidden="true">
        <LiquidEther
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsPoisson={lowPower ? 20 : 32}
          colors={COLORS}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          isBounce
          BFECC={!lowPower}
          resolution={lowPower ? 0.38 : 0.5}
          maxFps={lowPower ? 30 : 60}
          interactionEnabled={interactionEnabled}
        />
      </div>
    </Suspense>
  );
}
