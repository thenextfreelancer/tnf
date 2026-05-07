/**
 * Blog Search & Tag Filtering
 * Progressive-enhancement script for /blog.html
 * Reads /blogs/index.json and renders a filterable grid.
 */
(function () {
  'use strict';

  const STATE = {
    posts: [],
    query: '',
    activeTag: 'all',
  };

  const $ = (sel) => document.querySelector(sel);

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      q: params.get('q') || '',
      tag: params.get('tag') || 'all',
    };
  }

  function syncURL() {
    const params = new URLSearchParams();
    if (STATE.query) params.set('q', STATE.query);
    if (STATE.activeTag && STATE.activeTag !== 'all') params.set('tag', STATE.activeTag);
    const qs = params.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }

  function uniqueCategories(posts) {
    const set = new Set();
    posts.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }

  function matchesPost(post) {
    const q = STATE.query.trim().toLowerCase();
    const tag = STATE.activeTag;

    if (tag !== 'all' && post.category !== tag) return false;
    if (!q) return true;

    const haystack = [
      post.title,
      post.description,
      post.category,
      ...(post.keywords || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    // Simple AND-token match: every space-separated token must appear
    return q.split(/\s+/).every((tok) => haystack.includes(tok));
  }

  function renderTagChips() {
    const container = $('#blog-tag-filters');
    if (!container) return;
    const categories = uniqueCategories(STATE.posts);

    const chips = [
      `<button type="button" class="tag-chip" data-tag="all" data-testid="tag-chip-all">All <span class="tag-count">${STATE.posts.length}</span></button>`,
      ...categories.map((c) => {
        const count = STATE.posts.filter((p) => p.category === c).length;
        const slug = c.toLowerCase().replace(/\s+/g, '-');
        return `<button type="button" class="tag-chip" data-tag="${escapeHtml(c)}" data-testid="tag-chip-${slug}">${escapeHtml(c)} <span class="tag-count">${count}</span></button>`;
      }),
    ].join('');

    container.innerHTML = chips;

    container.querySelectorAll('.tag-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        STATE.activeTag = btn.getAttribute('data-tag');
        updateActiveChip();
        renderResults();
        syncURL();
      });
    });
    updateActiveChip();
  }

  function updateActiveChip() {
    document.querySelectorAll('.tag-chip').forEach((btn) => {
      const isActive = btn.getAttribute('data-tag') === STATE.activeTag;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  function cardTemplate(post) {
    const img = post.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&q=85&w=600';
    const cat = (post.category || 'POST').toUpperCase();
    const slug = post.slug || '';
    return `
      <article class="bg-card-dark border border-border-default overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]" data-testid="blog-card-${escapeHtml(slug)}">
        <a href="${escapeHtml(post.url)}">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(post.title)}" class="w-full h-48 object-cover" loading="lazy">
        </a>
        <div class="p-6">
          <div class="flex items-center gap-2 mb-4 flex-wrap">
            <span class="font-mono text-xs border border-border-default bg-card-dark text-foreground-muted px-2 py-1 uppercase tracking-wider">${escapeHtml(cat)}</span>
            <time datetime="${escapeHtml(post.date)}" class="text-xs text-foreground-muted">${escapeHtml(formatDate(post.date))}</time>
            <span class="text-xs text-foreground-muted">&bull; ${escapeHtml(String(post.readTime || 5))} min</span>
          </div>
          <h3 class="text-xl font-semibold font-cabinet tracking-tight mb-3 hover:text-signal-red transition-colors">
            <a href="${escapeHtml(post.url)}" data-testid="article-link-${escapeHtml(slug)}">${escapeHtml(post.title)}</a>
          </h3>
          <p class="text-sm text-foreground-muted leading-relaxed mb-4">${escapeHtml(post.description || '')}</p>
          <a href="${escapeHtml(post.url)}" class="text-sm text-signal-red hover:underline" data-testid="read-more-${escapeHtml(slug)}">Read More &rarr;</a>
        </div>
      </article>`;
  }

  function highlightTerm(rootEl, term) {
    if (!term) return;
    const tokens = term.trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return;
    const re = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    rootEl.querySelectorAll('h3 a, p').forEach((node) => {
      const original = node.textContent;
      if (!re.test(original)) return;
      node.innerHTML = escapeHtml(original).replace(re, '<mark class="search-mark">$1</mark>');
    });
  }

  function renderResults() {
    const grid = $('#blog-grid');
    const empty = $('#blog-empty-state');
    const countEl = $('#blog-result-count');
    if (!grid) return;

    const filtered = STATE.posts.filter(matchesPost);
    grid.innerHTML = filtered.map(cardTemplate).join('');

    if (countEl) {
      const total = STATE.posts.length;
      if (STATE.query || STATE.activeTag !== 'all') {
        countEl.textContent = `Showing ${filtered.length} of ${total} ${total === 1 ? 'post' : 'posts'}`;
      } else {
        countEl.textContent = `${total} ${total === 1 ? 'post' : 'posts'}`;
      }
    }

    if (empty) empty.classList.toggle('hidden', filtered.length !== 0);

    if (STATE.query) {
      grid.querySelectorAll('article').forEach((art) => highlightTerm(art, STATE.query));
    }
  }

  function debounce(fn, delay) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  function attachSearch() {
    const input = $('#blog-search-input');
    const clearBtn = $('#blog-search-clear');
    if (!input) return;

    const onInput = debounce(() => {
      STATE.query = input.value || '';
      renderResults();
      syncURL();
      if (clearBtn) clearBtn.classList.toggle('hidden', !STATE.query);
    }, 120);

    input.addEventListener('input', onInput);

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        STATE.query = '';
        clearBtn.classList.add('hidden');
        renderResults();
        syncURL();
        input.focus();
      });
    }

    const resetBtn = $('#blog-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        STATE.query = '';
        STATE.activeTag = 'all';
        if (input) input.value = '';
        if (clearBtn) clearBtn.classList.add('hidden');
        updateActiveChip();
        renderResults();
        syncURL();
      });
    }
  }

  async function loadIndex() {
    const grid = $('#blog-grid');
    try {
      const res = await fetch('/blogs/index.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      STATE.posts = Array.isArray(data.posts) ? data.posts.slice() : [];
      // Sort by date desc
      STATE.posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      // Apply URL params
      const { q, tag } = getQueryParams();
      STATE.query = q;
      STATE.activeTag = tag || 'all';
      const input = $('#blog-search-input');
      if (input && q) input.value = q;
      const clearBtn = $('#blog-search-clear');
      if (clearBtn) clearBtn.classList.toggle('hidden', !q);

      renderTagChips();
      renderResults();
    } catch (err) {
      console.error('Failed to load blog index:', err);
      if (grid) {
        grid.innerHTML = `
          <div class="col-span-full text-center py-12">
            <p class="text-foreground-muted text-sm">Unable to load posts. Please refresh the page.</p>
          </div>`;
      }
    }
  }

  function init() {
    if (!$('#blog-grid')) return;
    attachSearch();
    loadIndex();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
