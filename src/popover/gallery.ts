/**
 * Gallery navigation inside a popover — image galleries and full-card
 * slide stacks share the same markup contract. Binds a delegated click
 * handler for prev/next arrows and dot pager, toggling the active slide.
 * Works with the built-in template markup and custom `renderPopover`
 * markup using the same data attributes. (Not the `content` path — the
 * sanitizer strips `<button>` and `data-*` attributes.)
 */
export function initGallery(root: HTMLElement): () => void {
  const gallery = root.querySelector<HTMLElement>('.ci-hotspot-popover-gallery');
  if (!gallery) return () => {};

  const slides = Array.from(gallery.querySelectorAll<HTMLElement>('[data-gallery-slide]'));
  const dots = Array.from(gallery.querySelectorAll<HTMLElement>('[data-gallery-dot]'));
  if (slides.length < 2) return () => {};

  let index = 0;

  const setIndex = (next: number): void => {
    index = ((next % slides.length) + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('ci-hotspot-popover-gallery-slide--active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('ci-hotspot-popover-gallery-dot--active', i === index);
      if (i === index) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  };

  const onClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-gallery-prev]')) {
      setIndex(index - 1);
    } else if (target.closest('[data-gallery-next]')) {
      setIndex(index + 1);
    } else {
      const dot = target.closest<HTMLElement>('[data-gallery-dot]');
      if (dot) {
        const i = Number(dot.dataset.galleryDot);
        if (Number.isFinite(i)) setIndex(i);
      }
    }
  };

  gallery.addEventListener('click', onClick);
  return () => gallery.removeEventListener('click', onClick);
}
