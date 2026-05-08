/**
 * Tools Directory - Category Filtering
 * Filters tool cards on /tools.html based on data-category.
 */
(function () {
  'use strict';

  function init() {
    const bar = document.getElementById('tools-filter-bar');
    const cards = document.querySelectorAll('[data-testid^="tool-card-"]');
    if (!bar || !cards.length) return;

    const buttons = bar.querySelectorAll('.tool-filter-btn');
    const countEl = document.getElementById('tools-result-count');

    function applyFilter(filter) {
      let visible = 0;
      cards.forEach((card) => {
        const cat = card.getAttribute('data-category') || '';
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('hidden', !show);
        if (show) visible++;
      });
      if (countEl) {
        countEl.textContent = filter === 'all'
          ? `${visible} tools`
          : `${visible} ${visible === 1 ? 'tool' : 'tools'}`;
      }
    }

    function setActive(btn) {
      buttons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'all';
        setActive(btn);
        applyFilter(filter);
        // Sync URL
        const params = new URLSearchParams();
        if (filter !== 'all') params.set('category', filter);
        const qs = params.toString();
        const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
        window.history.replaceState(null, '', newUrl);
      });
    });

    // Initial state from URL
    const urlParams = new URLSearchParams(window.location.search);
    const initial = urlParams.get('category') || 'all';
    const initialBtn = bar.querySelector(`[data-filter="${initial}"]`) || bar.querySelector('[data-filter="all"]');
    if (initialBtn) {
      setActive(initialBtn);
      applyFilter(initialBtn.getAttribute('data-filter'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
