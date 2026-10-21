const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
if (menu && nav) menu.addEventListener('click', () => nav.classList.toggle('open'));

document.querySelectorAll('button.quizButton').forEach(button => {
  if (button.closest('form')) return;
  button.addEventListener('click', () => {
    const panel = button.nextElementSibling;
    if (panel) panel.hidden = false;
  });
});
