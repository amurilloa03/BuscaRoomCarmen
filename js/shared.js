// shared.js — dark mode + language dropdown (todas las páginas)

// ─── Dark mode ────────────────────────────────────────────────
if (localStorage.getItem('buscaroom-theme') === 'dark') {
  document.body.classList.add('dark-theme');
}

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const iconMoon = themeToggle.querySelector('.icon-moon');
  const iconSun  = themeToggle.querySelector('.icon-sun');

  if (document.body.classList.contains('dark-theme')) {
    if (iconMoon) iconMoon.style.display = 'none';
    if (iconSun)  iconSun.style.display  = 'block';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const dark = document.body.classList.contains('dark-theme');
    localStorage.setItem('buscaroom-theme', dark ? 'dark' : 'light');
    if (iconMoon) iconMoon.style.display = dark ? 'none'  : 'block';
    if (iconSun)  iconSun.style.display  = dark ? 'block' : 'none';
  });
}

// ─── Language dropdown (inyectado en .nav-links de cualquier página) ─
(function () {
  const LANGS = [
    { code: 'es', label: 'Español',   flag: '🇪🇸' },
    { code: 'en', label: 'English',   flag: '🇬🇧' },
    { code: 'fr', label: 'Français',  flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch',   flag: '🇩🇪' },
    { code: 'it', label: 'Italiano',  flag: '🇮🇹' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
  ];

  const saved    = localStorage.getItem('buscaroom-lang') || 'es';
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks || document.getElementById('langDropdown')) return;

  const curr = LANGS.find(l => l.code === saved) || LANGS[0];

  const wrap = document.createElement('div');
  wrap.className = 'lang-dropdown';
  wrap.id = 'langDropdown';
  wrap.innerHTML = `
    <button class="lang-dropdown-btn" id="langDropdownBtn" type="button">
      <span class="lang-flag">${curr.flag}</span>
      <span class="lang-code">${curr.code.toUpperCase()}</span>
      <svg class="icon icon-sm lang-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div class="lang-dropdown-menu" id="langDropdownMenu">
      ${LANGS.map(l => `
        <button class="lang-option${l.code === saved ? ' active' : ''}" data-lang="${l.code}" type="button">
          <span class="lang-flag">${l.flag}</span>
          <span class="lang-name">${l.label}</span>
          ${l.code === saved ? '<svg class="icon icon-sm lang-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : '<span class="lang-check-placeholder"></span>'}
        </button>
      `).join('')}
    </div>
  `;

  navLinks.insertBefore(wrap, navLinks.firstChild);

  const btn  = document.getElementById('langDropdownBtn');
  const menu = document.getElementById('langDropdownMenu');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.classList.contains('open');
    menu.classList.toggle('open', !open);
    wrap.classList.toggle('open', !open);
  });

  document.addEventListener('click', () => {
    menu.classList.remove('open');
    wrap.classList.remove('open');
  });

  menu.addEventListener('click', (e) => {
    e.stopPropagation();
    const option = e.target.closest('.lang-option');
    if (!option) return;
    const lang = option.dataset.lang;

    localStorage.setItem('buscaroom-lang', lang);

    const langData = LANGS.find(l => l.code === lang);
    btn.querySelector('.lang-flag').textContent = langData.flag;
    btn.querySelector('.lang-code').textContent = langData.code.toUpperCase();

    menu.querySelectorAll('.lang-option').forEach(o => {
      const isActive = o.dataset.lang === lang;
      o.classList.toggle('active', isActive);
      const check = o.querySelector('.lang-check');
      const placeholder = o.querySelector('.lang-check-placeholder');
      if (isActive && !check) {
        if (placeholder) placeholder.remove();
        o.insertAdjacentHTML('beforeend', '<svg class="icon icon-sm lang-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>');
      } else if (!isActive && check) {
        check.remove();
        o.insertAdjacentHTML('beforeend', '<span class="lang-check-placeholder"></span>');
      }
    });

    menu.classList.remove('open');
    wrap.classList.remove('open');

    document.dispatchEvent(new CustomEvent('buscaroom:langchange', { detail: { lang } }));
  });
})();

// ─── Global Bottom Navigation Bar (Mobile) ───────────────────
(function() {
  if (document.getElementById('mobileBottomNav')) return;
  
  // Detectar si estamos en la raíz (index.html) o en la carpeta pages/
  const isRoot = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html') && !window.location.pathname.includes('/pages/');
  const basePath = isRoot ? 'pages/' : '';
  const rootPath = isRoot ? './' : '../';

  const nav = document.createElement('nav');
  nav.id = 'mobileBottomNav';
  nav.className = 'mobile-bottom-nav hide-desktop';
  
  // Obtenemos la página actual para marcarla como activa
  const currentPath = window.location.pathname;

  nav.innerHTML = `
    <a href="${rootPath}index.html" class="bottom-nav-item ${currentPath.endsWith('index.html') || currentPath.endsWith('/') ? 'active' : ''}">
      <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <span>Inicio</span>
    </a>
    <a href="${basePath}pisos.html" class="bottom-nav-item ${currentPath.includes('pisos.html') ? 'active' : ''}">
      <svg viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/></svg>
      <span>Pisos</span>
    </a>
    <a href="${basePath}explorar.html" class="bottom-nav-item ${currentPath.includes('explorar.html') ? 'active' : ''}">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <span>Explorar</span>
    </a>
    <a href="${basePath}mensajes.html" class="bottom-nav-item ${currentPath.includes('mensajes.html') ? 'active' : ''}">
      <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span>Chat</span>
    </a>
    <a href="${basePath}panel.html" class="bottom-nav-item ${currentPath.includes('panel.html') ? 'active' : ''}">
      <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <span>Panel</span>
    </a>
  `;
  document.body.appendChild(nav);
})();
