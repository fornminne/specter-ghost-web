const menu = document.querySelector('.menu');
const nav = document.querySelector('header nav');

function setOpen(open) {
  if (!menu || !nav) return;
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', open ? 'true' : 'false');
}

if (menu && nav) {
  menu.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
}

document.addEventListener('click', (event) => {
  const reveal = event.target.closest('[data-reveal]');
  if (!reveal) return;
  const next = reveal.nextElementSibling;
  if (next) next.hidden = false;
});
