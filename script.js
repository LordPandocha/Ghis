const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-nav');

function closeMenu({ returnFocus = false } = {}) {
  const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Открыть меню');
  menu.hidden = true;
  if (wasOpen && returnFocus) toggle.focus();
}

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  menu.hidden = !open;
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) closeMenu({ returnFocus: true });
});
document.addEventListener('click', event => {
  if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
});

const desktopQuery = window.matchMedia('(min-width: 761px)');
const onDesktopChange = event => { if (event.matches) closeMenu(); };
if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', onDesktopChange);
else desktopQuery.addListener(onDesktopChange);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealNodes = document.querySelectorAll('.reveal');
const marquee = document.querySelector('.marquee');
const showAll = () => revealNodes.forEach(node => node.classList.add('visible'));

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  revealNodes.forEach(node => revealObserver.observe(node));

  const marqueeObserver = new IntersectionObserver(entries => {
    marquee.classList.toggle('is-visible', entries[0].isIntersecting && !reducedMotion.matches);
  });
  marqueeObserver.observe(marquee);
} else {
  showAll();
}

const onMotionChange = event => {
  if (event.matches) {
    showAll();
    marquee.classList.remove('is-visible');
  } else if (marquee.getBoundingClientRect().top < innerHeight && marquee.getBoundingClientRect().bottom > 0) {
    marquee.classList.add('is-visible');
  }
};
if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionChange);
else reducedMotion.addListener(onMotionChange);

