import type { HotspotItem, PopoverData, PopoverSlide } from '../core/types';
import { sanitizeHTML } from './sanitize';

/** Render the built-in product template from data fields */
const CHEVRON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

export function renderBuiltInTemplate(data: PopoverData): string {
  const parts: string[] = [];
  const priceRow = renderPriceRow(data);
  const cta = renderCta(data);
  // Horizontal slide cards get a footer bar (price | pager | CTA) inside the gallery
  const horizontalSlides = data.layout === 'horizontal' && !!data.slides && data.slides.length > 0;

  if (data.slides && data.slides.length > 0) {
    parts.push(renderCardSlides(data.slides, horizontalSlides ? { priceRow, cta } : undefined));
  } else {
    const images = data.images && data.images.length > 0
      ? data.images
      : data.image ? [data.image] : [];

    if (images.length === 1) {
      parts.push(`<div class="ci-hotspot-popover-image-wrapper"><img class="ci-hotspot-popover-image" src="${escapeAttr(images[0])}" alt="${escapeAttr(data.title || '')}"></div>`);
    } else if (images.length > 1) {
      parts.push(renderGallery(images, data.title || ''));
    }
  }

  const bodyParts: string[] = [];

  if (data.title) {
    bodyParts.push(`<h3 class="ci-hotspot-popover-title">${escapeHtml(data.title)}</h3>`);
  }

  if (!horizontalSlides && priceRow) {
    bodyParts.push(priceRow);
  }

  if (data.description) {
    bodyParts.push(`<p class="ci-hotspot-popover-description">${escapeHtml(data.description)}</p>`);
  }

  if (!horizontalSlides && cta) {
    bodyParts.push(cta);
  }

  if (bodyParts.length > 0) {
    parts.push(`<div class="ci-hotspot-popover-body">${bodyParts.join('')}</div>`);
  }

  return parts.join('');
}

function renderPriceRow(data: PopoverData): string {
  if (!data.originalPrice && !data.price) return '';
  let priceHtml = '';
  if (data.originalPrice) {
    priceHtml += `<span class="ci-hotspot-popover-original-price">${escapeHtml(data.originalPrice)}</span>`;
  }
  if (data.price) {
    priceHtml += `<span class="ci-hotspot-popover-price">${escapeHtml(data.price)}</span>`;
  }
  return `<div class="ci-hotspot-popover-price-row">${priceHtml}</div>`;
}

function renderCta(data: PopoverData): string {
  if (data.url && isSafeUrl(data.url)) {
    const ctaText = data.ctaText || 'View details';
    const productAttr = data.id ? ` data-product-id="${escapeAttr(data.id)}"` : '';
    return `<div class="ci-hotspot-popover-cta-row"><a class="ci-hotspot-popover-cta" href="${escapeAttr(data.url)}" target="_top"${productAttr}>${escapeHtml(String(ctaText))}</a></div>`;
  }
  if (data.id) {
    const ctaText = data.ctaText || 'View details';
    return `<div class="ci-hotspot-popover-cta-row"><button class="ci-hotspot-popover-cta" data-product-id="${escapeAttr(data.id)}">${escapeHtml(String(ctaText))}</button></div>`;
  }
  return '';
}

/** Render a multi-image gallery with prev/next arrows and dot pager */
function renderGallery(images: string[], title: string): string {
  const total = images.length;

  const slides = images
    .map((src, i) => {
      const alt = title ? `${title} — image ${i + 1} of ${total}` : `Image ${i + 1} of ${total}`;
      const active = i === 0 ? ' ci-hotspot-popover-gallery-slide--active' : '';
      const lazy = i === 0 ? '' : ' loading="lazy"';
      return `<img class="ci-hotspot-popover-image ci-hotspot-popover-gallery-slide${active}" src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" data-gallery-slide="${i}"${lazy}>`;
    })
    .join('');

  return (
    `<div class="ci-hotspot-popover-image-wrapper ci-hotspot-popover-gallery">${slides}` +
    `<button type="button" class="ci-hotspot-popover-gallery-nav ci-hotspot-popover-gallery-nav--prev" data-gallery-prev aria-label="Previous image">${CHEVRON_SVG}</button>` +
    `<button type="button" class="ci-hotspot-popover-gallery-nav ci-hotspot-popover-gallery-nav--next" data-gallery-next aria-label="Next image">${CHEVRON_SVG}</button>` +
    `<div class="ci-hotspot-popover-gallery-dots">${renderDots(total)}</div>` +
    `</div>`
  );
}

/**
 * Render a full-card slide stack (image + title + description page together, Fnac-style).
 * With `footer`, price/pager/CTA form a single bottom bar inside the gallery container
 * (used by the horizontal layout).
 */
function renderCardSlides(slides: PopoverSlide[], footer?: { priceRow: string; cta: string }): string {
  const total = slides.length;

  const slideHtml = slides
    .map((slide, i) => {
      const inner: string[] = [];
      if (slide.image) {
        const alt = slide.title || `Slide ${i + 1} of ${total}`;
        const lazy = i === 0 ? '' : ' loading="lazy"';
        inner.push(`<div class="ci-hotspot-popover-image-wrapper"><img class="ci-hotspot-popover-image" src="${escapeAttr(slide.image)}" alt="${escapeAttr(alt)}"${lazy}></div>`);
      }
      const body: string[] = [];
      if (slide.title) {
        body.push(`<h3 class="ci-hotspot-popover-title">${escapeHtml(slide.title)}</h3>`);
      }
      if (slide.description) {
        body.push(`<p class="ci-hotspot-popover-description">${escapeHtml(slide.description)}</p>`);
      }
      if (body.length > 0) {
        inner.push(`<div class="ci-hotspot-popover-body">${body.join('')}</div>`);
      }
      const active = i === 0 ? ' ci-hotspot-popover-gallery-slide--active' : '';
      return `<div class="ci-hotspot-popover-slide${active}" data-gallery-slide="${i}">${inner.join('')}</div>`;
    })
    .join('');

  const pager = total < 2 ? '' :
    `<div class="ci-hotspot-popover-gallery-pager">` +
    `<button type="button" class="ci-hotspot-popover-gallery-nav ci-hotspot-popover-gallery-nav--prev" data-gallery-prev aria-label="Previous slide">${CHEVRON_SVG}</button>` +
    `<div class="ci-hotspot-popover-gallery-dots">${renderDots(total)}</div>` +
    `<button type="button" class="ci-hotspot-popover-gallery-nav ci-hotspot-popover-gallery-nav--next" data-gallery-next aria-label="Next slide">${CHEVRON_SVG}</button>` +
    `</div>`;

  if (footer) {
    // Pager gets its own centered line so a long dot row never crowds price/CTA.
    const actionRow = footer.priceRow + footer.cta;
    const actionBar = actionRow ? `<div class="ci-hotspot-popover-gallery-footer-row">${actionRow}</div>` : '';
    const footerInner = pager + actionBar;
    const footerBar = footerInner ? `<div class="ci-hotspot-popover-gallery-footer">${footerInner}</div>` : '';
    return (
      `<div class="ci-hotspot-popover-gallery ci-hotspot-popover-gallery--card">` +
      `<div class="ci-hotspot-popover-slides">${slideHtml}</div>${footerBar}</div>`
    );
  }

  if (total < 2) {
    return `<div class="ci-hotspot-popover-slides">${slideHtml}</div>`;
  }

  return (
    `<div class="ci-hotspot-popover-gallery ci-hotspot-popover-gallery--card">` +
    `<div class="ci-hotspot-popover-slides">${slideHtml}</div>${pager}</div>`
  );
}

/** Render the dot pager buttons; the first dot starts active */
function renderDots(total: number): string {
  let dots = '';
  for (let i = 0; i < total; i++) {
    const active = i === 0 ? ' ci-hotspot-popover-gallery-dot--active' : '';
    const current = i === 0 ? ' aria-current="true"' : '';
    dots += `<button type="button" class="ci-hotspot-popover-gallery-dot${active}" data-gallery-dot="${i}" aria-label="Go to slide ${i + 1} of ${total}"${current}></button>`;
  }
  return dots;
}

/**
 * Render popover content with priority: renderFn > content string > data template.
 * Returns HTML string or DOM element.
 */
export function renderPopoverContent(
  hotspot: HotspotItem,
  renderFn?: (hotspot: HotspotItem) => string | HTMLElement,
): string | HTMLElement {
  // Priority 1: Custom render function (bypasses sanitization)
  if (renderFn) {
    return renderFn(hotspot);
  }

  // Priority 2: HTML content string (sanitized)
  if (hotspot.content) {
    return sanitizeHTML(hotspot.content);
  }

  // Priority 3: Built-in template from data
  if (hotspot.data) {
    return renderBuiltInTemplate(hotspot.data);
  }

  return '';
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Check that a URL uses a safe protocol (allowlist approach) */
function isSafeUrl(url: string): boolean {
  const normalized = url.replace(/[\s\x00-\x1f]/g, '');
  return /^https?:\/\//i.test(normalized) || /^\/(?!\/)/.test(normalized) || /^#/.test(normalized);
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
