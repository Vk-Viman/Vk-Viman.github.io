// Basic interactivity
const yearEl = document.getElementById('year');
if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

const menuBtn = document.getElementById('menu');
const nav = document.getElementById('nav');
menuBtn?.addEventListener('click', () => nav.classList.toggle('open'));

const themeToggle = document.getElementById('themeToggle');
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
// Persist theme
const saved = localStorage.getItem('theme');
if(saved === 'light'){ document.body.classList.add('light'); }


// First-visit theme chooser
const modal = document.getElementById('themeModal');
const btnDark = document.getElementById('chooseDark');
const btnLight = document.getElementById('chooseLight');

function applyTheme(theme){
  if(theme === 'light'){ document.body.classList.add('light'); }
  else { document.body.classList.remove('light'); }
  localStorage.setItem('theme', theme);
}

if(modal && !localStorage.getItem('theme')){
  modal.classList.remove('hidden');
}
btnDark?.addEventListener('click', () => { applyTheme('dark'); modal.classList.add('hidden'); });
btnLight?.addEventListener('click', () => { applyTheme('light'); modal.classList.add('hidden'); });
