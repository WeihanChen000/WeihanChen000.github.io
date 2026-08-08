/*
 * Adapted from React Bits FlowingMenu-JS-CSS.
 * Copyright (c) 2026 David Haz. MIT + Commons Clause.
 * Local changes preserve semantic project content, add keyboard/reduced-motion
 * handling, remove image dependencies, and use the site's visual tokens.
 */
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import "./FlowingMenu.css";

const POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * @typedef {Object} Project
 * @property {string} index
 * @property {string} name
 * @property {string} type
 * @property {string} description
 * @property {string} stack
 * @property {string} href
 */

function closestVerticalEdge(event, element) {
  const rect = element.getBoundingClientRect();
  const y = "clientY" in event && event.clientY > 0
    ? event.clientY - rect.top
    : rect.height / 2;
  return y < rect.height / 2 ? "top" : "bottom";
}

/** @param {{ project: Project, speed: number, order: number }} props */
function ProjectMenuItem({ project, speed, order }) {
  const itemRef = useRef(null);
  const marqueeRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const loopRef = useRef(null);
  const [repetitions, setRepetitions] = useState(4);

  const canFlow = () => window.innerWidth > 719
    && window.matchMedia(POINTER_QUERY).matches
    && !window.matchMedia(REDUCED_MOTION_QUERY).matches;

  const moveLayer = (visible, edge = "bottom") => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    if (!canFlow()) {
      marquee.removeAttribute("data-flow-visible");
      return;
    }

    marquee.dataset.flowEdge = edge;
    marquee.toggleAttribute("data-flow-visible", visible);
  };

  useEffect(() => {
    const inner = marqueeInnerRef.current;
    if (!inner) return undefined;

    const calculateRepetitions = () => {
      const part = inner.querySelector(".flowing-menu__marquee-part");
      if (!part || part.offsetWidth === 0) return;
      setRepetitions(Math.max(4, Math.ceil(window.innerWidth / part.offsetWidth) + 2));
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions, { passive: true });
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [project.name, project.stack]);

  useEffect(() => {
    const inner = marqueeInnerRef.current;
    if (!inner) return undefined;

    const setupLoop = () => {
      const part = inner.querySelector(".flowing-menu__marquee-part");
      if (!part || part.offsetWidth === 0) return;

      loopRef.current?.kill();
      if (!canFlow()) {
        gsap.set(inner, { x: 0 });
        return;
      }

      loopRef.current = gsap.to(inner, {
        x: -part.offsetWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    };

    const timer = window.setTimeout(setupLoop, 50);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const finePointer = window.matchMedia(POINTER_QUERY);
    const handlePreferenceChange = () => {
      loopRef.current?.kill();
      marqueeRef.current?.removeAttribute("data-flow-visible");
      gsap.set(inner, { clearProps: "transform" });
      setupLoop();
    };

    reducedMotion.addEventListener("change", handlePreferenceChange);
    finePointer.addEventListener("change", handlePreferenceChange);

    return () => {
      window.clearTimeout(timer);
      loopRef.current?.kill();
      reducedMotion.removeEventListener("change", handlePreferenceChange);
      finePointer.removeEventListener("change", handlePreferenceChange);
    };
  }, [project.name, project.stack, repetitions, speed]);

  const handlePointerEnter = (event) => {
    if (!itemRef.current || event.pointerType === "touch") return;
    moveLayer(true, closestVerticalEdge(event, itemRef.current));
  };

  const handlePointerLeave = (event) => {
    if (!itemRef.current || event.pointerType === "touch") return;
    moveLayer(false, closestVerticalEdge(event, itemRef.current));
  };

  return (
    <a
      className="flowing-menu__item project-row"
      href={project.href}
      target="_blank"
      rel="noreferrer"
      ref={itemRef}
      data-motion-reveal
      style={{ "--motion-order": order }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={() => moveLayer(true, "bottom")}
      onBlur={() => moveLayer(false, "bottom")}
    >
      <span className="project-number" aria-hidden="true">{project.index}</span>
      <div className="project-title">
        <span>{project.type}</span>
        <h3>{project.name}</h3>
      </div>
      <p>{project.description}</p>
      <span className="project-stack">{project.stack}</span>
      <span className="project-arrow" data-magnet aria-hidden="true">↗</span>
      <span className="project-sticker-tape" aria-hidden="true"></span>

      <span className="flowing-menu__marquee" ref={marqueeRef} aria-hidden="true">
        <span className="flowing-menu__marquee-clip">
          <span className="flowing-menu__marquee-inner" ref={marqueeInnerRef}>
            {Array.from({ length: repetitions }, (_, index) => (
              <span className="flowing-menu__marquee-part" key={index}>
                <strong>{project.name}</strong>
                <i aria-hidden="true"></i>
                <span>{project.stack}</span>
                <i aria-hidden="true"></i>
              </span>
            ))}
          </span>
        </span>
      </span>
    </a>
  );
}

/** @param {{ projects?: Project[], speed?: number }} props */
export default function FlowingMenu({ projects = [], speed = 24 }) {
  return (
    <div className="flowing-menu project-index">
      {projects.map((project, index) => (
        <ProjectMenuItem
          key={project.href}
          project={project}
          speed={speed}
          order={index}
        />
      ))}
    </div>
  );
}
