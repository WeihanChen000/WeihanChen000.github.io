# Third-party notices

## React Bits

The Liquid Ether background in `src/components/LiquidEther/` is the official
React Bits `LiquidEther-JS-CSS` registry component. This site also uses or
adapts these official registry sources:

- `public/r/FlowingMenu-JS-CSS.json` - copied to
  `src/components/react-bits/FlowingMenu/`, then adapted for semantic project
  data, keyboard focus, site colors, no-image marquees, coarse pointers, and
  reduced motion.
- `public/r/AnimatedContent-JS-CSS.json` - adapted in
  `src/components/MotionEnhancements.astro` as an Astro-native
  IntersectionObserver reveal, without GSAP ScrollTrigger.
- `public/r/ClickSpark-JS-CSS.json` - adapted in
  `src/components/MotionEnhancements.astro` to reuse one canvas and respond
  only to the hero character.
- `public/r/Magnet-JS-CSS.json` - behavior adapted in
  `src/components/MotionEnhancements.astro` as one delegated, rAF-driven
  handler for square arrow controls.
- `public/r/CardSwap-JS-CSS.json` - its 3D slot and card-layering model informed
  the journal deck in `src/styles/home.css`. The local adaptation keeps Astro
  article links semantic, removes automatic swapping and timers, opens cards
  only on hover or keyboard focus, and falls back to a static list for touch
  and reduced-motion users.

- Source: https://github.com/DavidHDev/react-bits
- Copyright (c) 2026 David Haz
- License: MIT + Commons Clause License Condition v1.0

Permission is granted to use, copy, modify, merge, publish, and distribute the
software as part of an application, website, or product. The components may not
be sold, sublicensed, or redistributed themselves, whether alone, in a bundle,
or as a ported version. The software is provided without warranty.

## Character extraction tooling

`tools/create_character_assets.py` uses permissively licensed image-processing
libraries to extract the original concept-art pixels. No third-party character
artwork or generated replacement parts are included.

- PyMatting 1.1.15 - MIT
- OpenCV Python Headless 5.0.0.93 - Apache-2.0
- Pillow 12.3.0 - MIT-CMU
- NumPy 2.4.6 - BSD-3-Clause and bundled compatible licenses

The script can optionally call rembg 2.0.78 (MIT) with a separately downloaded
model. The checked-in `sheep-hero` assets were produced by the local matting
path and do not contain BiRefNet model output.
