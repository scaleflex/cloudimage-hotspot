<p align="center">
  <img src="https://scaleflex.cloudimg.io/v7/plugins/scaleflex/logo.png?vh=b0a502&radius=25&w=700" alt="Scaleflex" width="350">
</p>

<h1 align="center">@cloudimage/hotspot</h1>

<p align="center">
  Interactive image hotspots with zoom, popovers, and accessibility. Zero dependencies.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@cloudimage/hotspot"><img src="https://img.shields.io/npm/v/@cloudimage/hotspot.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@cloudimage/hotspot"><img src="https://img.shields.io/npm/dm/@cloudimage/hotspot.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://github.com/scaleflex/cloudimage-hotspot/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@cloudimage/hotspot.svg?style=flat-square" alt="license"></a>
  <a href="https://bundlephobia.com/package/@cloudimage/hotspot"><img src="https://img.shields.io/bundlephobia/minzip/@cloudimage/hotspot?style=flat-square" alt="bundle size"></a>
</p>

<p align="center">
  <a href="https://scaleflex.github.io/cloudimage-hotspot/">Live Demo</a> |
  <a href="https://scaleflex.github.io/cloudimage-hotspot/editor.html">Visual Editor</a> |
  <a href="https://codesandbox.io/p/devbox/github/scaleflex/cloudimage-hotspot/tree/main/examples/vanilla">Vanilla Sandbox</a> |
  <a href="https://codesandbox.io/p/devbox/github/scaleflex/cloudimage-hotspot/tree/main/examples/react">React Sandbox</a>
</p>

---

## Why @cloudimage/hotspot?

Existing hotspot libraries are often heavy, inaccessible, or locked behind paid services. This library was built to fill the gap:

- **Lightweight** — under 15 KB gzipped with zero runtime dependencies
- **Accessible by default** — WCAG 2.1 AA compliant out of the box
- **Framework-agnostic** — works with vanilla JS, React, or any framework
- **Built-in zoom & pan** — no need for a separate zoom library
- **Multi-image scenes** — create virtual tours without extra tooling
- **Optional Cloudimage CDN** — serve optimally-sized images automatically

---

## Features

- **Hotspot markers** — Positioned via percentage or pixel coordinates with pulsing animation
- **Popover system** — Hover, click, or load triggers with built-in flip/shift positioning
- **Zoom & Pan** — CSS transform-based with mouse wheel, pinch-to-zoom, double-click, drag-to-pan
- **WCAG 2.1 AA** — Full keyboard navigation, ARIA attributes, focus management, reduced motion
- **CSS variable theming** — Light and dark themes, fully customizable
- **Two init methods** — JavaScript API and HTML data-attributes
- **React wrapper** — Separate entry point with component, hook, and ref API
- **TypeScript** — Full type definitions
- **Cloudimage CDN** — Optional responsive image loading
- **Multi-image scenes** — Navigate between images with animated transitions
- **Popover image gallery** — Multiple images per hotspot card with arrows and dot pager
- **Compact card layout** — Light, text-only popover with a large clickable chevron CTA

## Installation

```bash
npm install @cloudimage/hotspot
```

### CDN

```html
<script src="https://scaleflex.cloudimg.io/v7/plugins/cloudimage/hotspot/1.1.12/hotspot.min.js?vh=83907f&func=proxy"></script>
```

## Quick Start

### JavaScript API

```js
import CIHotspot from '@cloudimage/hotspot';

const viewer = new CIHotspot('#product-image', {
  src: 'https://example.com/living-room.jpg',
  alt: 'Modern living room',
  zoom: true,
  trigger: 'hover',
  hotspots: [
    {
      id: 'sofa',
      x: '40%',
      y: '60%',
      label: 'Modern Sofa',
      data: { title: 'Modern Sofa', originalPrice: '$1,099', price: '$899', description: 'Comfortable 3-seat sofa' },
    },
    {
      id: 'lamp',
      x: '75%',
      y: '25%',
      label: 'Floor Lamp',
      markerStyle: 'dot-label',
      data: { title: 'Arc Floor Lamp', price: '$249' },
    },
  ],
  onOpen(hotspot) {
    console.log('Opened:', hotspot.id);
  },
});
```

### HTML Data-Attributes

```html
<div
  data-ci-hotspot-src="https://example.com/room.jpg"
  data-ci-hotspot-alt="Living room"
  data-ci-hotspot-zoom="true"
  data-ci-hotspot-trigger="hover"
  data-ci-hotspot-items='[
    {"id":"sofa","x":"40%","y":"60%","label":"Sofa","data":{"title":"Sofa","price":"$899"}}
  ]'
></div>

<script>CIHotspot.autoInit();</script>
```

## API Reference

### Constructor

```ts
new CIHotspot(element: HTMLElement | string, config: CIHotspotConfig)
```

### Config

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `src` | `string` | — | Image source URL (required) |
| `hotspots` | `HotspotItem[]` | — | Array of hotspot definitions (required) |
| `alt` | `string` | `''` | Image alt text |
| `trigger` | `'hover' \| 'click' \| 'load'` | `'hover'` | Popover trigger mode |
| `zoom` | `boolean` | `false` | Enable zoom & pan |
| `zoomMax` | `number` | `4` | Maximum zoom level |
| `zoomMin` | `number` | `1` | Minimum zoom level |
| `theme` | `'light' \| 'dark'` | `'light'` | Theme |
| `pulse` | `boolean` | `true` | Marker pulse animation |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'auto'` | `'top'` | Popover placement |
| `lazyLoad` | `boolean` | `true` | Lazy load image |
| `zoomControls` | `boolean` | `true` | Show zoom control buttons |
| `zoomControlsPosition` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-right'` | Zoom controls position |
| `renderPopover` | `(hotspot) => string \| HTMLElement` | — | Custom popover render |
| `onOpen` | `(hotspot) => void` | — | Popover open callback |
| `onClose` | `(hotspot) => void` | — | Popover close callback |
| `onZoom` | `(level) => void` | — | Zoom change callback |
| `onClick` | `(event, hotspot) => void` | — | Marker click callback |
| `cloudimage` | `CloudimageConfig` | — | Cloudimage CDN config |
| `scenes` | `Scene[]` | — | Array of scenes for multi-image navigation |
| `initialScene` | `string` | first scene | Scene ID to display initially |
| `sceneTransition` | `'fade' \| 'slide' \| 'none'` | `'fade'` | Scene transition animation |
| `sceneAspectRatio` | `string` | — | Fixed viewport ratio (e.g. `'16/9'`). Prevents layout jumps. |
| `onSceneChange` | `(id, scene) => void` | — | Scene change callback |

### HotspotItem

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (required) |
| `x` | `string \| number` | X coordinate: `'65%'` or `650` (px) |
| `y` | `string \| number` | Y coordinate: `'40%'` or `400` (px) |
| `label` | `string` | Accessible label (required) |
| `markerStyle` | `'dot' \| 'dot-label'` | Marker style — `'dot-label'` shows a text pill next to the dot |
| `data` | `PopoverData` | Data for built-in template |
| `content` | `string` | HTML content (sanitized) |
| `trigger` | `'hover' \| 'click' \| 'load'` | Override global trigger |
| `placement` | `Placement` | Override global placement |
| `className` | `string` | Custom CSS class |
| `hidden` | `boolean` | Initially hidden |
| `icon` | `string` | Custom icon |
| `navigateTo` | `string` | Scene ID to navigate to on click |

### PopoverData

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Popover heading |
| `originalPrice` | `string` | Strikethrough price shown before current price (e.g. `'$1,499'`) |
| `price` | `string` | Current price |
| `description` | `string` | Description text |
| `image` | `string` | Image URL displayed at top of popover |
| `images` | `string[]` | Multiple image URLs — renders a gallery with prev/next arrows and a dot pager. Takes precedence over `image` |
| `slides` | `PopoverSlide[]` | Full-card pages — each `{ image?, title?, description? }` swaps together, with a pager below the content. Price and CTA stay fixed. Takes precedence over `images` and `image` |
| `layout` | `'vertical' \| 'horizontal' \| 'compact'` | Card layout. `'horizontal'` puts the image left and text right in a wider, shorter `slides` card (width via `--ci-hotspot-popover-horizontal-width`, default 480px). `'compact'` renders a light, text-only card — title, description and price with a chevron CTA, no image (width via `--ci-hotspot-popover-compact-width`, default 230px). Default: `'vertical'` |
| `url` | `string` | Link URL for the CTA button |
| `ctaText` | `string` | CTA button label (default: `'View details'`) |

### Instance Methods

```ts
instance.open(id: string): void
instance.close(id: string): void
instance.closeAll(): void
instance.setZoom(level: number): void
instance.getZoom(): number
instance.resetZoom(): void
instance.addHotspot(hotspot: HotspotItem): void
instance.removeHotspot(id: string): void
instance.updateHotspot(id: string, updates: Partial<HotspotItem>): void
instance.update(config: Partial<CIHotspotConfig>): void
instance.destroy(): void
instance.goToScene(sceneId: string): void
instance.getCurrentScene(): string | undefined
instance.getScenes(): string[]
```

### Static Methods

```ts
CIHotspot.autoInit(root?: HTMLElement): CIHotspotInstance[]
```

## React Usage

```tsx
import { CIHotspotViewer, useCIHotspot } from '@cloudimage/hotspot/react';

// Component
function ProductImage() {
  return (
    <CIHotspotViewer
      src="/living-room.jpg"
      alt="Living room"
      zoom
      hotspots={[
        { id: 'sofa', x: '40%', y: '60%', label: 'Sofa', data: { title: 'Sofa', price: '$899' } },
      ]}
      onOpen={(h) => console.log('Opened:', h.id)}
    />
  );
}

// Hook
function ProductImage() {
  const { containerRef, instance } = useCIHotspot({
    src: '/room.jpg',
    hotspots: [...],
    zoom: true,
  });

  return (
    <>
      <div ref={containerRef} />
      <button onClick={() => instance.current?.setZoom(2)}>Zoom 2x</button>
    </>
  );
}

// Ref API
function ProductImage() {
  const ref = useRef<CIHotspotViewerRef>(null);
  return (
    <>
      <CIHotspotViewer ref={ref} src="/room.jpg" hotspots={[...]} zoom />
      <button onClick={() => ref.current?.open('sofa')}>Show Sofa</button>
    </>
  );
}
```

## Multi-Image Scenes

Navigate between multiple images, each with its own hotspots:

```js
const viewer = new CIHotspot('#tour', {
  scenes: [
    {
      id: 'living-room',
      src: '/living-room.jpg',
      alt: 'Living room',
      hotspots: [
        { id: 'sofa', x: '40%', y: '60%', label: 'Sofa', data: { title: 'Modern Sofa' } },
        { id: 'go-kitchen', x: '85%', y: '50%', label: 'Go to Kitchen', navigateTo: 'kitchen' },
      ],
    },
    {
      id: 'kitchen',
      src: '/kitchen.jpg',
      alt: 'Kitchen',
      hotspots: [
        { id: 'island', x: '50%', y: '65%', label: 'Island', data: { title: 'Marble Island' } },
        { id: 'go-back', x: '10%', y: '50%', label: 'Back', navigateTo: 'living-room' },
      ],
    },
  ],
  sceneTransition: 'fade',  // 'fade' | 'slide' | 'none'
});

// Programmatic navigation
viewer.goToScene('kitchen');
viewer.getCurrentScene(); // 'kitchen'
viewer.getScenes();       // ['living-room', 'kitchen']
```

Hotspots with `navigateTo` display as arrow markers and switch scenes on click.

## Popover Image Gallery

Show multiple images on a single hotspot card. Pass `images` instead of `image` and the built-in template renders a gallery with prev/next arrows and a dot pager:

```js
{
  id: 'lens',
  x: '60%',
  y: '45%',
  label: 'Camera lens',
  data: {
    title: 'FE 16-35mm f/2.8 GM II',
    price: '$2,299',
    images: [
      '/lens-front.jpg',
      '/lens-side.jpg',
      '/lens-mounted.jpg',
    ],
    url: '/products/fe-16-35',
  },
}
```

The gallery wraps around at both ends, is fully keyboard-accessible, and lazy-loads all images after the first.

For richer product storytelling, use `slides` instead — each page swaps the image **and** the text together (like product key-points on retail sites), while the price row and CTA stay fixed below the pager:

```js
{
  id: 'lens',
  x: '60%',
  y: '45%',
  label: 'Camera lens',
  data: {
    price: '$2,299',
    layout: 'horizontal', // image left, text right — avoids tall, scrolling cards
    slides: [
      { image: '/lens-resolution.jpg', title: 'G Master resolution', description: 'High spatial resolution across the whole zoom range.' },
      { image: '/lens-bokeh.jpg', title: 'Beautiful bokeh', description: 'Three XA elements control aberration for smooth blur.' },
      { image: '/lens-af.jpg', title: 'Fast, quiet AF', description: 'Four XD linear motors track subjects at up to 30 fps.' },
    ],
    url: '/products/fe-16-35',
    ctaText: 'View product',
  },
}
```

For simple callouts where a full card is too much, use `layout: 'compact'` — a light, text-only card with the title, description and price and a chevron CTA. No image is rendered. The whole right strip of the card is clickable (not just the chevron), so it's an easy target:

```js
{
  id: 'floor-lamp',
  x: '82%',
  y: '46%',
  label: 'Arc floor lamp',
  data: {
    layout: 'compact',
    title: 'SKURUP',
    description: 'Arc floor lamp',
    price: '€79,99',
    url: '/products/skurup',
    ctaText: 'View details', // used as the chevron's aria-label
  },
}
```

The compact card honors `--ci-hotspot-popover-text-align` and its width can be tuned with `--ci-hotspot-popover-compact-width` (default 230px).

## Theming

All visuals are customizable via CSS variables:

```css
.my-viewer {
  --ci-hotspot-marker-bg: rgba(0, 88, 163, 0.8);
  --ci-hotspot-pulse-color: rgba(0, 88, 163, 0.3);
  --ci-hotspot-cta-bg: #e63946;
  --ci-hotspot-popover-border-radius: 4px;
  --ci-hotspot-popover-text-align: center; /* left (default) | center | right */
}
```

Set `theme: 'dark'` for the built-in dark theme.

## Accessibility

- All markers are `<button>` elements with `aria-label`
- `Tab` / `Shift+Tab` navigates between markers
- `Enter` / `Space` toggles popovers
- `Escape` closes popovers and returns focus
- `Arrow keys` pan when zoomed
- `+` / `-` / `0` zoom controls
- Focus trapping in popovers with interactive content
- `prefers-reduced-motion` disables animations

## Cloudimage Integration

```js
new CIHotspot('#el', {
  src: 'https://example.com/room.jpg',
  cloudimage: {
    token: 'demo',
    limitFactor: 100,
    params: 'q=80',
  },
  hotspots: [...],
});
```

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 80+     |
| Firefox | 80+     |
| Safari  | 14+     |
| Edge    | 80+     |

## License

[MIT](./LICENSE)

---

## Support

If this library helped your project, consider buying me a coffee!

<a href="https://buymeacoffee.com/dzmitry.stramavus">
  <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee">
</a>

---

<p align="center">
  Made with care by the <a href="https://www.scaleflex.com">Scaleflex</a> team
</p>
