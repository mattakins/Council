(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const track = document.querySelector('.example-track');
  const slides = [...track.querySelectorAll('.example-slide')];
  const exampleLinks = [...document.querySelectorAll('[data-example-link]')];
  const previous = document.querySelector('#previous-example');
  const next = document.querySelector('#next-example');
  const position = document.querySelector('#example-position');
  let activeExample = 0;
  let scrollFrame;

  function updateExample(index) {
    activeExample = Math.max(0, Math.min(slides.length - 1, index));
    exampleLinks.forEach((link, i) => {
      if (i === activeExample) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    previous.disabled = activeExample === 0;
    next.disabled = activeExample === slides.length - 1;
    position.textContent = `${activeExample + 1} / ${slides.length}`;
  }

  function showExample(index, behavior = reducedMotion.matches ? 'auto' : 'smooth') {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({ left: target * track.clientWidth, behavior });
    updateExample(target);
  }

  exampleLinks.forEach((link, index) => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showExample(index);
    });
  });
  previous.addEventListener('click', () => showExample(activeExample - 1));
  next.addEventListener('click', () => showExample(activeExample + 1));
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      showExample(activeExample + (event.key === 'ArrowRight' ? 1 : -1));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      showExample(event.key === 'Home' ? 0 : slides.length - 1);
    }
  });
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => updateExample(Math.round(track.scrollLeft / track.clientWidth)));
  }, { passive: true });
  new ResizeObserver(() => showExample(activeExample, 'instant')).observe(track);
  document.querySelector('.carousel-controls').hidden = false;

  const tabs = [...document.querySelectorAll('[data-install-tab]')];
  function selectAgent(selected) {
    tabs.forEach(tab => {
      const isSelected = tab === selected;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      const panel = document.querySelector(`#${tab.getAttribute('aria-controls')}`);
      panel.hidden = !isSelected;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectAgent(tab));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target === undefined) return;
      event.preventDefault();
      selectAgent(tabs[target]);
      tabs[target].focus();
    });
  });
  document.querySelector('.install-tabs').hidden = false;
  document.querySelector('.install-section').classList.add('enhanced');
  selectAgent(tabs[0]);

  document.querySelectorAll('[data-copy]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const code = document.getElementById(button.dataset.copy);
      const label = button.querySelector('span');
      const status = document.querySelector('#copy-status');
      try {
        await navigator.clipboard.writeText(code.textContent.trim());
        label.textContent = 'Copied';
        status.textContent = 'Install commands copied to clipboard.';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        label.textContent = 'Select and copy';
        status.textContent = 'Clipboard unavailable. Commands selected; use your browser’s copy command.';
      }
      clearTimeout(button.resetTimer);
      button.resetTimer = setTimeout(() => { label.textContent = 'Copy commands'; }, 2200);
    });
  });
  const quickDialog = document.querySelector('.quick-install');
  const quickCommand = document.querySelector('#quick-install-command');
  const quickStatus = document.querySelector('#quick-install-status');
  let copyRequest = 0;
  async function copyQuickInstall() {
    const request = ++copyRequest;
    quickStatus.textContent = 'Copying…';
    try {
      await navigator.clipboard.writeText(quickCommand.textContent);
      if (request === copyRequest) quickStatus.textContent = '✓ Copied to clipboard';
    } catch {
      if (request === copyRequest) quickStatus.textContent = 'Couldn’t copy automatically. Select the command above to copy it.';
    }
  }
  document.querySelectorAll('[data-quick-install]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const agent = link.textContent.trim();
      quickCommand.textContent = document.querySelector(`#commands-${link.dataset.quickInstall}`).textContent.trim();
      document.querySelector('#quick-install-title').textContent = `Install for ${agent}`;
      document.querySelector('#quick-install-note').textContent = link.dataset.quickInstall === 'other'
        ? `Select ${agent} when the installer asks which agents to use.` : '';
      quickDialog.showModal();
      copyQuickInstall();
    });
  });
  document.querySelector('#quick-install-copy').addEventListener('click', copyQuickInstall);
  quickDialog.addEventListener('click', event => {
    const rect = quickDialog.getBoundingClientRect();
    if (event.target === quickDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) quickDialog.close();
  });
})();
