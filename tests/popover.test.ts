import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Popover } from '../src/popover/popover';
import { renderBuiltInTemplate, renderPopoverContent } from '../src/popover/template';
import type { HotspotItem } from '../src/core/types';

function makeHotspot(overrides?: Partial<HotspotItem>): HotspotItem {
  return {
    id: 'test-1',
    x: '50%',
    y: '50%',
    label: 'Test Hotspot',
    ...overrides,
  };
}

describe('renderBuiltInTemplate', () => {
  it('renders title only when provided', () => {
    const html = renderBuiltInTemplate({ title: 'Test Title' });
    expect(html).toContain('ci-hotspot-popover-title');
    expect(html).toContain('Test Title');
    expect(html).not.toContain('ci-hotspot-popover-price');
  });

  it('renders all fields when provided', () => {
    const html = renderBuiltInTemplate({
      title: 'Sofa',
      price: '$899',
      description: 'Comfortable sofa',
      image: 'https://example.com/sofa.jpg',
      url: 'https://example.com/sofa',
      ctaText: 'Buy now',
    });
    expect(html).toContain('Sofa');
    expect(html).toContain('$899');
    expect(html).toContain('Comfortable sofa');
    expect(html).toContain('sofa.jpg');
    expect(html).toContain('Buy now');
    expect(html).toContain('https://example.com/sofa');
  });

  it('uses default CTA text', () => {
    const html = renderBuiltInTemplate({ url: 'https://example.com' });
    expect(html).toContain('View details');
  });

  it('omits image when not provided', () => {
    const html = renderBuiltInTemplate({ title: 'Test' });
    expect(html).not.toContain('ci-hotspot-popover-image');
  });

  it('omits CTA when no url', () => {
    const html = renderBuiltInTemplate({ title: 'Test' });
    expect(html).not.toContain('ci-hotspot-popover-cta');
  });

  it('returns empty for empty data', () => {
    const html = renderBuiltInTemplate({});
    expect(html).toBe('');
  });

  it('renders original price with line-through class', () => {
    const html = renderBuiltInTemplate({ originalPrice: '$1,499', price: '$1,249' });
    expect(html).toContain('ci-hotspot-popover-original-price');
    expect(html).toContain('$1,499');
    expect(html).toContain('ci-hotspot-popover-price');
    expect(html).toContain('$1,249');
  });

  it('wraps prices in a price-row div', () => {
    const html = renderBuiltInTemplate({ originalPrice: '$229', price: '$179' });
    expect(html).toContain('ci-hotspot-popover-price-row');
  });

  it('renders only original price when no current price', () => {
    const html = renderBuiltInTemplate({ originalPrice: '$500' });
    expect(html).toContain('ci-hotspot-popover-original-price');
    expect(html).toContain('$500');
    expect(html).toContain('ci-hotspot-popover-price-row');
    expect(html).not.toContain('ci-hotspot-popover-price"');
  });

  it('does not render price-row when no prices provided', () => {
    const html = renderBuiltInTemplate({ title: 'Test' });
    expect(html).not.toContain('ci-hotspot-popover-price-row');
    expect(html).not.toContain('ci-hotspot-popover-original-price');
  });

  it('renders a gallery when multiple images provided', () => {
    const html = renderBuiltInTemplate({
      title: 'Lens',
      images: ['https://example.com/1.jpg', 'https://example.com/2.jpg', 'https://example.com/3.jpg'],
    });
    expect(html).toContain('ci-hotspot-popover-gallery');
    expect(html).toContain('data-gallery-prev');
    expect(html).toContain('data-gallery-next');
    expect((html.match(/data-gallery-slide/g) || []).length).toBe(3);
    expect((html.match(/data-gallery-dot/g) || []).length).toBe(3);
  });

  it('renders single image without gallery controls when images has one entry', () => {
    const html = renderBuiltInTemplate({ images: ['https://example.com/1.jpg'] });
    expect(html).toContain('ci-hotspot-popover-image');
    expect(html).not.toContain('ci-hotspot-popover-gallery');
    expect(html).not.toContain('data-gallery-prev');
  });

  it('images takes precedence over image', () => {
    const html = renderBuiltInTemplate({
      image: 'https://example.com/old.jpg',
      images: ['https://example.com/a.jpg', 'https://example.com/b.jpg'],
    });
    expect(html).not.toContain('old.jpg');
    expect(html).toContain('a.jpg');
    expect(html).toContain('b.jpg');
  });

  it('falls back to image when images is empty', () => {
    const html = renderBuiltInTemplate({ image: 'https://example.com/old.jpg', images: [] });
    expect(html).toContain('old.jpg');
    expect(html).not.toContain('ci-hotspot-popover-gallery');
  });

  it('marks only first slide and dot as active', () => {
    const html = renderBuiltInTemplate({ images: ['https://example.com/1.jpg', 'https://example.com/2.jpg'] });
    expect((html.match(/ci-hotspot-popover-gallery-slide--active/g) || []).length).toBe(1);
    expect((html.match(/ci-hotspot-popover-gallery-dot--active/g) || []).length).toBe(1);
  });

  it('escapes image URLs in gallery slides', () => {
    const html = renderBuiltInTemplate({ images: ['https://example.com/1.jpg"onerror="x', 'https://example.com/2.jpg'] });
    expect(html).not.toContain('"onerror="');
    expect(html).toContain('&quot;onerror=&quot;');
  });

  it('renders full-card slides with per-slide image, title and description', () => {
    const html = renderBuiltInTemplate({
      slides: [
        { image: 'https://example.com/1.jpg', title: 'Resolution', description: 'High detail' },
        { image: 'https://example.com/2.jpg', title: 'Bokeh', description: 'Smooth blur' },
      ],
    });
    expect(html).toContain('ci-hotspot-popover-gallery--card');
    expect(html).toContain('ci-hotspot-popover-gallery-pager');
    expect((html.match(/data-gallery-slide/g) || []).length).toBe(2);
    expect((html.match(/ci-hotspot-popover-title/g) || []).length).toBe(2);
    expect(html).toContain('Resolution');
    expect(html).toContain('Bokeh');
  });

  it('slides take precedence over images and image', () => {
    const html = renderBuiltInTemplate({
      image: 'https://example.com/old.jpg',
      images: ['https://example.com/a.jpg', 'https://example.com/b.jpg'],
      slides: [{ title: 'Only slide' }, { title: 'Second' }],
    });
    expect(html).not.toContain('old.jpg');
    expect(html).not.toContain('a.jpg');
    expect(html).toContain('Only slide');
  });

  it('shared price and CTA render after the slide pager', () => {
    const html = renderBuiltInTemplate({
      price: '$2,299',
      url: 'https://example.com/buy',
      slides: [{ title: 'A' }, { title: 'B' }],
    });
    const pagerIdx = html.indexOf('ci-hotspot-popover-gallery-pager');
    const priceIdx = html.indexOf('ci-hotspot-popover-price');
    expect(pagerIdx).toBeGreaterThan(-1);
    expect(priceIdx).toBeGreaterThan(pagerIdx);
    expect(html).toContain('ci-hotspot-popover-cta');
  });

  it('single slide renders without pager controls', () => {
    const html = renderBuiltInTemplate({ slides: [{ image: 'https://example.com/1.jpg', title: 'Solo' }] });
    expect(html).toContain('ci-hotspot-popover-slide');
    expect(html).not.toContain('ci-hotspot-popover-gallery-pager');
    expect(html).not.toContain('data-gallery-prev');
  });

  it('escapes slide title and description HTML', () => {
    const html = renderBuiltInTemplate({
      slides: [{ title: '<script>x</script>', description: '<img src=x>' }, { title: 'B' }],
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<img src=x>');
  });
});

describe('renderPopoverContent', () => {
  it('uses renderFn when provided', () => {
    const hotspot = makeHotspot();
    const renderFn = () => '<div>Custom</div>';
    const result = renderPopoverContent(hotspot, renderFn);
    expect(result).toBe('<div>Custom</div>');
  });

  it('uses content string when no renderFn', () => {
    const hotspot = makeHotspot({ content: '<p>Hello</p>' });
    const result = renderPopoverContent(hotspot);
    expect(result).toContain('<p>Hello</p>');
  });

  it('sanitizes content string', () => {
    const hotspot = makeHotspot({ content: '<p>safe</p><script>alert(1)</script>' });
    const result = renderPopoverContent(hotspot);
    expect(result).not.toContain('script');
    expect(result).toContain('safe');
  });

  it('uses built-in template from data', () => {
    const hotspot = makeHotspot({ data: { title: 'Product', price: '$10' } });
    const result = renderPopoverContent(hotspot);
    expect(result).toContain('Product');
    expect(result).toContain('$10');
  });

  it('returns empty for no content', () => {
    const hotspot = makeHotspot();
    const result = renderPopoverContent(hotspot);
    expect(result).toBe('');
  });
});

describe('Popover class', () => {
  let container: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    container.style.position = 'relative';
    document.body.appendChild(container);
  });

  afterEach(() => {
    vi.useRealTimers();
    container.remove();
  });

  it('creates popover element with correct structure', () => {
    const hotspot = makeHotspot({ data: { title: 'Test' } });
    const popover = new Popover(hotspot, {
      placement: 'top',
      triggerMode: 'hover',
    });
    expect(popover.element.classList.contains('ci-hotspot-popover')).toBe(true);
    expect(popover.element.getAttribute('role')).toBe('tooltip');
    expect(popover.element.getAttribute('aria-hidden')).toBe('true');
    expect(popover.element.querySelector('.ci-hotspot-popover-arrow')).toBeTruthy();
    expect(popover.element.querySelector('.ci-hotspot-popover-content')).toBeTruthy();
    popover.destroy();
  });

  it('sets correct id', () => {
    const hotspot = makeHotspot({ id: 'sofa-1' });
    const popover = new Popover(hotspot, { placement: 'top', triggerMode: 'click' });
    expect(popover.element.id).toBe('ci-hotspot-popover-sofa-1');
    popover.destroy();
  });

  it('show() and hide() toggle visibility', () => {
    const hotspot = makeHotspot({ data: { title: 'Test' } });
    const popover = new Popover(hotspot, { placement: 'top', triggerMode: 'click' });
    const marker = document.createElement('button');
    container.appendChild(marker);
    popover.mount(container, marker);

    expect(popover.isVisible()).toBe(false);
    popover.show();
    expect(popover.isVisible()).toBe(true);
    expect(popover.element.classList.contains('ci-hotspot-popover--visible')).toBe(true);
    expect(popover.element.getAttribute('aria-hidden')).toBe('false');

    popover.hide();
    expect(popover.isVisible()).toBe(false);
    expect(popover.element.classList.contains('ci-hotspot-popover--visible')).toBe(false);
    expect(popover.element.getAttribute('aria-hidden')).toBe('true');

    popover.destroy();
  });

  it('scheduleHide delays hide', () => {
    const hotspot = makeHotspot({ data: { title: 'Test' } });
    const popover = new Popover(hotspot, { placement: 'top', triggerMode: 'hover' });
    const marker = document.createElement('button');
    container.appendChild(marker);
    popover.mount(container, marker);

    popover.show();
    popover.scheduleHide(200);
    expect(popover.isVisible()).toBe(true);

    vi.advanceTimersByTime(100);
    expect(popover.isVisible()).toBe(true);

    vi.advanceTimersByTime(100);
    expect(popover.isVisible()).toBe(false);

    popover.destroy();
  });

  it('clearHideTimer prevents scheduled hide', () => {
    const hotspot = makeHotspot({ data: { title: 'Test' } });
    const popover = new Popover(hotspot, { placement: 'top', triggerMode: 'hover' });
    const marker = document.createElement('button');
    container.appendChild(marker);
    popover.mount(container, marker);

    popover.show();
    popover.scheduleHide(200);
    popover.clearHideTimer();

    vi.advanceTimersByTime(300);
    expect(popover.isVisible()).toBe(true);

    popover.destroy();
  });

  it('calls onOpen and onClose callbacks', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const hotspot = makeHotspot({ data: { title: 'Test' } });
    const popover = new Popover(hotspot, {
      placement: 'top',
      triggerMode: 'click',
      onOpen,
      onClose,
    });
    const marker = document.createElement('button');
    container.appendChild(marker);
    popover.mount(container, marker);

    popover.show();
    expect(onOpen).toHaveBeenCalledWith(hotspot);

    popover.hide();
    expect(onClose).toHaveBeenCalledWith(hotspot);

    popover.destroy();
  });

  it('destroy removes element from DOM', () => {
    const hotspot = makeHotspot({ data: { title: 'Test' } });
    const popover = new Popover(hotspot, { placement: 'top', triggerMode: 'click' });
    const marker = document.createElement('button');
    container.appendChild(marker);
    popover.mount(container, marker);

    expect(container.contains(popover.element)).toBe(true);
    popover.destroy();
    expect(container.contains(popover.element)).toBe(false);
  });

  it('mount sets aria-describedby on marker for hover mode', () => {
    const hotspot = makeHotspot({ id: 'my-spot' });
    const popover = new Popover(hotspot, { placement: 'top', triggerMode: 'hover' });
    const marker = document.createElement('button');
    container.appendChild(marker);
    popover.mount(container, marker);

    expect(marker.getAttribute('aria-describedby')).toBe('ci-hotspot-popover-my-spot');
    popover.destroy();
  });

  it('mount sets aria-controls and aria-haspopup on marker for click mode', () => {
    const hotspot = makeHotspot({ id: 'my-spot' });
    const popover = new Popover(hotspot, { placement: 'top', triggerMode: 'click' });
    const marker = document.createElement('button');
    container.appendChild(marker);
    popover.mount(container, marker);

    expect(marker.getAttribute('aria-controls')).toBe('ci-hotspot-popover-my-spot');
    expect(marker.getAttribute('aria-haspopup')).toBe('dialog');
    expect(marker.getAttribute('aria-describedby')).toBeNull();
    popover.destroy();
  });

  it('click-mode popover has role="dialog" with aria-label', () => {
    const hotspot = makeHotspot({ id: 'my-spot', label: 'Product info' });
    const popover = new Popover(hotspot, { placement: 'top', triggerMode: 'click' });
    expect(popover.element.getAttribute('role')).toBe('dialog');
    expect(popover.element.getAttribute('aria-label')).toBe('Product info');
    popover.destroy();
  });
});

describe('Popover gallery navigation', () => {
  const GALLERY_HOTSPOT = {
    data: {
      title: 'Lens',
      images: ['https://example.com/1.jpg', 'https://example.com/2.jpg', 'https://example.com/3.jpg'],
    },
  };

  function makeGalleryPopover() {
    const hotspot = makeHotspot(GALLERY_HOTSPOT);
    const popover = new Popover(hotspot, { placement: 'top', triggerMode: 'click' });
    const slides = Array.from(popover.element.querySelectorAll<HTMLElement>('[data-gallery-slide]'));
    const dots = Array.from(popover.element.querySelectorAll<HTMLElement>('[data-gallery-dot]'));
    const prev = popover.element.querySelector<HTMLElement>('[data-gallery-prev]')!;
    const next = popover.element.querySelector<HTMLElement>('[data-gallery-next]')!;
    const activeIndex = () =>
      slides.findIndex((s) => s.classList.contains('ci-hotspot-popover-gallery-slide--active'));
    return { popover, slides, dots, prev, next, activeIndex };
  }

  it('next button advances the active slide', () => {
    const { popover, next, activeIndex } = makeGalleryPopover();
    expect(activeIndex()).toBe(0);
    next.click();
    expect(activeIndex()).toBe(1);
    next.click();
    expect(activeIndex()).toBe(2);
    popover.destroy();
  });

  it('wraps around at both ends', () => {
    const { popover, prev, next, activeIndex } = makeGalleryPopover();
    prev.click();
    expect(activeIndex()).toBe(2);
    next.click();
    expect(activeIndex()).toBe(0);
    popover.destroy();
  });

  it('dot click jumps to that slide and updates aria-current', () => {
    const { popover, dots, activeIndex } = makeGalleryPopover();
    dots[2].click();
    expect(activeIndex()).toBe(2);
    expect(dots[2].getAttribute('aria-current')).toBe('true');
    expect(dots[0].getAttribute('aria-current')).toBeNull();
    expect(dots[2].classList.contains('ci-hotspot-popover-gallery-dot--active')).toBe(true);
    expect(dots[0].classList.contains('ci-hotspot-popover-gallery-dot--active')).toBe(false);
    popover.destroy();
  });

  it('exactly one slide is active at any time', () => {
    const { popover, next, slides } = makeGalleryPopover();
    next.click();
    const active = slides.filter((s) => s.classList.contains('ci-hotspot-popover-gallery-slide--active'));
    expect(active.length).toBe(1);
    popover.destroy();
  });

  it('single-image popover has no gallery controls', () => {
    const hotspot = makeHotspot({ data: { image: 'https://example.com/1.jpg' } });
    const popover = new Popover(hotspot, { placement: 'top', triggerMode: 'click' });
    expect(popover.element.querySelector('[data-gallery-prev]')).toBeNull();
    expect(popover.element.querySelector('.ci-hotspot-popover-gallery')).toBeNull();
    popover.destroy();
  });
});

describe('Popover full-card slide navigation', () => {
  it('pager next swaps the whole slide (image and text together)', () => {
    const hotspot = makeHotspot({
      data: {
        slides: [
          { image: 'https://example.com/1.jpg', title: 'First', description: 'one' },
          { image: 'https://example.com/2.jpg', title: 'Second', description: 'two' },
        ],
      },
    });
    const popover = new Popover(hotspot, { placement: 'top', triggerMode: 'click' });
    const slides = Array.from(popover.element.querySelectorAll<HTMLElement>('[data-gallery-slide]'));
    const next = popover.element.querySelector<HTMLElement>('[data-gallery-next]')!;

    expect(slides[0].classList.contains('ci-hotspot-popover-gallery-slide--active')).toBe(true);
    expect(slides[0].textContent).toContain('First');

    next.click();
    expect(slides[0].classList.contains('ci-hotspot-popover-gallery-slide--active')).toBe(false);
    expect(slides[1].classList.contains('ci-hotspot-popover-gallery-slide--active')).toBe(true);
    expect(slides[1].textContent).toContain('Second');
    popover.destroy();
  });

  it('malformed dot index does not brick navigation', () => {
    const hotspot = makeHotspot({
      data: { images: ['https://example.com/1.jpg', 'https://example.com/2.jpg'] },
    });
    const popover = new Popover(hotspot, { placement: 'top', triggerMode: 'click' });
    const dots = Array.from(popover.element.querySelectorAll<HTMLElement>('[data-gallery-dot]'));
    dots[1].setAttribute('data-gallery-dot', 'garbage');
    dots[1].click();
    const next = popover.element.querySelector<HTMLElement>('[data-gallery-next]')!;
    next.click();
    const active = popover.element.querySelectorAll('.ci-hotspot-popover-gallery-slide--active');
    expect(active.length).toBe(1);
    popover.destroy();
  });
});

describe('Popover horizontal layout', () => {
  it('adds horizontal modifier class when data.layout is horizontal', () => {
    const hotspot = makeHotspot({
      data: { layout: 'horizontal', slides: [{ title: 'A' }, { title: 'B' }] },
    });
    const popover = new Popover(hotspot, { placement: 'top', triggerMode: 'click' });
    expect(popover.element.classList.contains('ci-hotspot-popover--horizontal')).toBe(true);
    popover.destroy();
  });

  it('no horizontal class by default', () => {
    const hotspot = makeHotspot({ data: { slides: [{ title: 'A' }, { title: 'B' }] } });
    const popover = new Popover(hotspot, { placement: 'top', triggerMode: 'click' });
    expect(popover.element.classList.contains('ci-hotspot-popover--horizontal')).toBe(false);
    popover.destroy();
  });
});

describe('Horizontal layout footer bar', () => {
  it('moves price and CTA into the gallery footer for horizontal slides', () => {
    const html = renderBuiltInTemplate({
      layout: 'horizontal',
      price: '$1,249',
      originalPrice: '$1,499',
      url: 'https://example.com/buy',
      slides: [{ title: 'A' }, { title: 'B' }],
    });
    expect(html).toContain('ci-hotspot-popover-gallery-footer');
    const footer = html.slice(html.indexOf('ci-hotspot-popover-gallery-footer'));
    expect(footer).toContain('ci-hotspot-popover-price-row');
    expect(footer).toContain('ci-hotspot-popover-gallery-pager');
    expect(footer).toContain('ci-hotspot-popover-cta');
    // no outer body rendered after the gallery (price/CTA fully moved into the footer)
    expect(footer).not.toContain('ci-hotspot-popover-body');
  });

  it('vertical slides keep price and CTA in the body below the pager', () => {
    const html = renderBuiltInTemplate({
      price: '$1,249',
      url: 'https://example.com/buy',
      slides: [{ title: 'A' }, { title: 'B' }],
    });
    expect(html).not.toContain('ci-hotspot-popover-gallery-footer');
    expect(html).toContain('ci-hotspot-popover-body');
  });

  it('horizontal footer renders without pager for a single slide', () => {
    const html = renderBuiltInTemplate({
      layout: 'horizontal',
      price: '$99',
      slides: [{ title: 'Solo' }],
    });
    expect(html).toContain('ci-hotspot-popover-gallery-footer');
    expect(html).toContain('ci-hotspot-popover-price-row');
    expect(html).not.toContain('ci-hotspot-popover-gallery-pager');
  });
});
