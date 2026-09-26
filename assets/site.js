(() => {
  const body = document.body;
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const drawIcons = () => {
    if (window.lucide) window.lucide.createIcons();
  };
  const setTheme = (theme) => {
    body.dataset.theme = theme;
    if (themeButton) {
      const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
      themeButton.setAttribute('aria-label', label);
      themeButton.title = label;
      themeButton.innerHTML = `<i data-lucide="${theme === 'dark' ? 'sun' : 'moon'}" aria-hidden="true"></i>`;
      drawIcons();
    }
  };
  try { setTheme(localStorage.getItem('yz-theme') === 'dark' ? 'dark' : 'light'); }
  catch { setTheme('light'); }
  themeButton?.addEventListener('click', () => {
    const theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(theme);
    try { localStorage.setItem('yz-theme', theme); } catch { /* Local-file storage may be unavailable. */ }
  });
  const closeMenu = () => {
    nav?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
  };
  menuButton?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  const sectionLinks = [...(nav?.querySelectorAll('a[href^="#"]') || [])];
  if (sectionLinks.length) {
    let scheduled = false;
    const updateCurrentSection = () => {
      let active = sectionLinks[0];
      sectionLinks.forEach(link => {
        const section = document.getElementById(link.hash.slice(1));
        if (section && section.getBoundingClientRect().top <= 150) active = link;
      });
      sectionLinks.forEach(link => {
        if (link === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      scheduled = false;
    };
    window.addEventListener('scroll', () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(updateCurrentSection);
      }
    }, { passive: true });
    updateCurrentSection();
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });
  const search = document.querySelector('#publication-search');
  const topic = document.querySelector('#publication-topic');
  const publications = [...document.querySelectorAll('.publication')];
  if (search && topic) {
    document.querySelector('.publication-controls').hidden = false;
    const count = document.querySelector('#publication-count');
    count.hidden = false;
    const filter = () => {
      const query = search.value.trim().toLowerCase();
      let visible = 0;
      publications.forEach(publication => {
        const matches = (topic.value === 'all' || publication.dataset.topic === topic.value)
          && publication.textContent.toLowerCase().includes(query);
        publication.hidden = !matches;
        if (matches) visible += 1;
      });
      count.textContent = `${visible} of ${publications.length} publications`;
      document.querySelector('#publication-empty').hidden = visible !== 0;
    };
    search.addEventListener('input', filter);
    topic.addEventListener('change', filter);
    filter();
  }
  document.querySelectorAll('.current-year').forEach(el => { el.textContent = new Date().getFullYear(); });
  document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
  drawIcons();
})();
