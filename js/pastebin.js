/*
 * JustKaarlo Pastebin viewer
 * Keep this file beside index.html and style.css.
 * API: https://pastebin.ai/api-docs
 * Set DEFAULT_PASTE_ID below to choose a paste to open by default.
 */
(() => {
  'use strict';

  // Optional: put a paste ID here to open it automatically when ?id= is absent.
  const DEFAULT_PASTE_ID = '';
  // Used only for share links when you open this file locally with file://.
  const PUBLIC_PAGE_URL = 'https://www.justkaarlo.com/note/pastebin/';
  const API_BASE = 'https://pastebin.ai/api/v1/pastes/';
  const SETTINGS_KEY = 'kaarlo.pasteViewer.preferences.v1';
  const ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
  const $ = id => document.getElementById(id);
  const input = $('paste-input');
  const form = $('load-form');
  const actionButtons = [$('copy-button'), $('share-button'), $('download-button')];
  let current = null;
  let activeRequest = null;
  let sequence = 0;
  let busy = false;
  let toastTimer;
  let cooldownTimer;
  let blockedUntil = 0;
  let preferences = { wrap: false, numbers: true };

  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
    if (saved && typeof saved.wrap === 'boolean') preferences.wrap = saved.wrap;
    if (saved && typeof saved.numbers === 'boolean') preferences.numbers = saved.numbers;
  } catch (_) { /* Storage is optional, including in private browsing. */ }

  function announce(message) { $('announcement').textContent = message; }
  function toast(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').hidden = false;
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 3500);
  }

  function applyPreferences(save = false) {
    $('code-scroll').classList.toggle('wrap', preferences.wrap);
    $('code-scroll').classList.toggle('no-numbers', !preferences.numbers);
    $('wrap-button').setAttribute('aria-pressed', String(preferences.wrap));
    $('numbers-button').setAttribute('aria-pressed', String(preferences.numbers && !preferences.wrap));
    $('numbers-button').disabled = preferences.wrap;
    $('numbers-button').title = preferences.wrap ? 'Turn off wrapping to show line numbers' : 'Show line numbers';
    if (save) {
      try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(preferences)); } catch (_) { /* Nonessential. */ }
    }
  }

  function updateLoadButton() {
    const seconds = Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000));
    $('load-button').disabled = busy || seconds > 0;
    $('load-label').textContent = busy ? 'Opening…' : seconds ? `Wait ${seconds}s` : 'Open paste';
    if (!seconds && cooldownTimer) { clearInterval(cooldownTimer); cooldownTimer = null; }
  }

  function setBusy(value) {
    busy = value;
    $('viewer').setAttribute('aria-busy', String(value));
    updateLoadButton();
  }

  function clearContent() {
    current = null;
    actionButtons.forEach(button => { button.disabled = true; });
    $('paste-content').hidden = true;
    $('code-content').textContent = '';
    $('line-numbers').textContent = '';
    $('paste-title').textContent = 'Your next read';
    $('paste-title').removeAttribute('title');
    $('empty-meta').hidden = false;
    ['language-tag', 'visibility-tag', 'size-meta'].forEach(id => { $(id).hidden = true; });
    $('date-meta').textContent = 'Readable text. No code execution.';
    $('status-dot').classList.remove('loaded');
    document.title = 'Pastebin · JustKaarlo';
  }

  function showState(kind, title, message, sourceURL = '') {
    $('state-panel').hidden = false;
    $('state-panel').classList.toggle('error', kind === 'error');
    $('state-title').textContent = title;
    $('state-message').textContent = message;
    $('state-symbol').setAttribute('href', kind === 'error' ? '#i-alert' : '#i-file');
    $('state-symbol').parentElement.hidden = kind === 'loading';
    // SVG elements do not consistently implement the HTML hidden property.
    $('state-symbol').parentElement.style.display = kind === 'loading' ? 'none' : '';
    $('spinner').hidden = kind !== 'loading';
    $('cancel-button').hidden = kind !== 'loading';
    $('error-original').hidden = !sourceURL;
    if (sourceURL) $('error-original').href = sourceURL;
    $('state-links').hidden = kind !== 'loading' && !sourceURL;
    $('status-text').textContent = kind === 'loading' ? 'Contacting Pastebin.ai' : kind === 'error' ? 'Paste not loaded' : 'Waiting for a paste';
    announce(`${title}. ${message}`);
  }

  function parsePaste(value) {
    const raw = String(value || '').trim();
    if (!raw) throw new Error('Enter a Pastebin.ai link or paste ID first.');
    if (ID_PATTERN.test(raw)) return { id: raw, sourceURL: `https://pastebin.ai/p/${raw}` };
    let url;
    try { url = new URL(/^(?:www\.)?pastebin\.ai\//i.test(raw) ? `https://${raw}` : raw); }
    catch (_) { throw new Error('Use a full Pastebin.ai link or an ID containing only letters, numbers, hyphens, and underscores.'); }
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
      throw new Error('Enter a regular https://pastebin.ai/p/… link or a paste ID.');
    }
    let id = '';
    let fragment = '';
    if (['pastebin.ai', 'www.pastebin.ai'].includes(url.hostname.toLowerCase())) {
      const match = url.pathname.match(/^\/(?:p\/|raw\/|api\/v1\/pastes\/)?([A-Za-z0-9_-]{1,128})\/?$/);
      if (match) id = match[1];
      fragment = url.hash;
    } else {
      const canonical = new URL(PUBLIC_PAGE_URL);
      const samePage = url.origin === location.origin && url.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '');
      const publicPage = url.origin === canonical.origin && url.pathname.replace(/\/$/, '').replace(/\/index\.html$/, '') === canonical.pathname.replace(/\/$/, '');
      if (samePage || publicPage) id = url.searchParams.get('id') || '';
    }
    if (!ID_PATTERN.test(id)) throw new Error('This is not a supported paste link. Use a Pastebin.ai paste URL or its ID.');
    return { id, sourceURL: `https://pastebin.ai/p/${id}${fragment}` };
  }

  function setAddress(id, replace = false) {
    try {
      const url = new URL(location.href);
      url.searchParams.delete('id');
      if (id) url.searchParams.set('id', id);
      url.hash = '';
      if (url.href !== location.href) history[replace ? 'replaceState' : 'pushState'](null, '', url.href);
    } catch (_) { /* Some file:// environments disallow history updates. */ }
  }

  function shareAddress(id) {
    const url = new URL(/^https?:$/.test(location.protocol) ? location.href : PUBLIC_PAGE_URL);
    url.search = '';
    url.hash = '';
    url.searchParams.set('id', id);
    return url.href;
  }

  function formatBytes(bytes) {
    return bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;
  }

  function formatDate(value) {
    if (!value || !Number.isFinite(new Date(value).getTime())) return '';
    return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value));
  }

  function renderPaste(data, parsed) {
    if (!data || typeof data.content !== 'string' || (data.id && data.id !== parsed.id)) {
      throw new Error('Pastebin.ai returned an unexpected response. Try opening the original paste.');
    }
    const title = typeof data.title === 'string' && data.title.trim() ? data.title : 'Untitled paste';
    const language = typeof data.language === 'string' ? data.language : 'plaintext';
    const content = data.content;
    const displayContent = content.replace(/\r\n?/g, '\n');
    const lines = displayContent.split('\n').length;
    const size = new TextEncoder().encode(content).length;
    // Keep the untouched source for copying/downloading. Never interpret paste HTML.
    current = { id: parsed.id, title, language, content, sourceURL: parsed.sourceURL };
    $('paste-title').textContent = title;
    $('paste-title').title = title;
    $('empty-meta').hidden = true;
    $('language-tag').textContent = language === 'plaintext' ? 'Plain text' : language;
    $('visibility-tag').textContent = data.visibility === 'public' ? 'Public' : 'Unlisted';
    $('size-meta').textContent = `${lines.toLocaleString()} ${lines === 1 ? 'line' : 'lines'} · ${formatBytes(size)}`;
    ['language-tag', 'visibility-tag', 'size-meta'].forEach(id => { $(id).hidden = false; });
    $('code-content').textContent = displayContent;
    $('line-numbers').textContent = Array.from({ length: lines }, (_, index) => index + 1).join('\n');
    $('original-link').href = parsed.sourceURL;
    const created = formatDate(data.created_at);
    const expires = formatDate(data.expires_at);
    const dates = [];
    if (created) dates.push(`Created ${created}`);
    if (expires) dates.push(`Expires ${expires}`);
    else if (Object.prototype.hasOwnProperty.call(data, 'expires_at') && data.expires_at === null) dates.push('No expiry');
    $('date-meta').textContent = dates.join(' · ') || 'Loaded from Pastebin.ai';
    $('status-text').textContent = `Paste ${parsed.id}`;
    $('status-dot').classList.add('loaded');
    $('state-panel').hidden = true;
    $('paste-content').hidden = false;
    actionButtons.forEach(button => { button.disabled = false; });
    $('code-scroll').scrollTop = 0;
    $('code-scroll').scrollLeft = 0;
    document.title = `${title.slice(0, 120)} · JustKaarlo`;
    announce(`Loaded ${title}. ${lines.toLocaleString()} ${lines === 1 ? 'line' : 'lines'}.`);
  }

  async function loadPaste(value, updateAddress = true) {
    if (Date.now() < blockedUntil) { toast('Please wait before trying again.'); return; }
    if (activeRequest) activeRequest.abort();
    const token = ++sequence;
    activeRequest = null;
    setBusy(false);
    clearContent();
    $('clear-button').hidden = false;
    form.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    let parsed;
    try { parsed = parsePaste(value); }
    catch (error) {
      form.classList.add('invalid');
      input.setAttribute('aria-invalid', 'true');
      showState('error', 'Check the paste link', error.message);
      return;
    }
    if (updateAddress) setAddress(parsed.id);
    input.value = String(value).trim();
    const controller = new AbortController();
    activeRequest = controller;
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 20000);
    setBusy(true);
    showState('loading', 'Opening your paste', 'Fetching the original text from Pastebin.ai.');
    try {
      const response = await fetch(`${API_BASE}${encodeURIComponent(parsed.id)}`, {
        method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store',
        headers: { Accept: 'application/json' }, referrerPolicy: 'no-referrer',
        redirect: 'error', signal: controller.signal
      });
      if (token !== sequence) return;
      let data = null;
      try { data = await response.json(); } catch (_) { /* HTML errors are not displayed. */ }
      if (token !== sequence) return;
      if (!response.ok) {
        if (response.status === 404 || response.status === 410) {
          throw new Error('This paste may have expired, been deleted, or require protection that the public API cannot access. Check its ID or open the original.');
        }
        if (response.status === 401 || response.status === 403) {
          throw new Error('This paste is not available through the public API. Open it on Pastebin.ai to check access.');
        }
        if (response.status === 429) {
          const retryHeader = response.headers.get('Retry-After');
          const headerSeconds = retryHeader && /^\d+$/.test(retryHeader) ? Number(retryHeader) : Math.ceil((Date.parse(retryHeader || '') - Date.now()) / 1000);
          const bodySeconds = Number(data && data.retry_after);
          const seconds = Math.max(1, Number.isFinite(headerSeconds) && headerSeconds > 0 ? headerSeconds : bodySeconds > 0 ? bodySeconds : 30);
          blockedUntil = Date.now() + seconds * 1000;
          clearInterval(cooldownTimer);
          cooldownTimer = setInterval(updateLoadButton, 1000);
          throw new Error(`Pastebin.ai is limiting requests. Please wait ${seconds} seconds before trying again.`);
        }
        if (response.status >= 500) throw new Error('Pastebin.ai is temporarily unavailable. Please try again later.');
        throw new Error(`Pastebin.ai could not load this paste (HTTP ${response.status}). Try the original link.`);
      }
      renderPaste(data, parsed);
    } catch (error) {
      if (token !== sequence) return;
      clearContent();
      const message = timedOut ? 'Pastebin.ai took too long to respond. Check your connection and try again.'
        : error.name === 'AbortError' ? 'The request was cancelled.'
        : error instanceof TypeError ? 'Could not reach Pastebin.ai. Check your connection, or open the original paste. The service must allow requests from this page.'
        : error.message || 'The paste could not be loaded.';
      showState('error', timedOut ? 'The request timed out' : 'Could not open this paste', message, parsed.sourceURL);
    } finally {
      clearTimeout(timeout);
      if (token === sequence) { activeRequest = null; setBusy(false); }
    }
  }

  function resetView(updateAddress = true) {
    ++sequence;
    if (activeRequest) activeRequest.abort();
    activeRequest = null;
    input.value = '';
    form.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    $('clear-button').hidden = true;
    setBusy(false);
    clearContent();
    showState('empty', 'Ready when you are', 'Enter a paste link or ID above. Your text will open here, just as it was written.');
    if (updateAddress) setAddress('');
  }

  async function copyText(text, successMessage) {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Use fallback');
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const textarea = document.createElement('textarea');
      const previousFocus = document.activeElement;
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
      document.body.appendChild(textarea);
      textarea.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch (_) { /* Manual copy remains available. */ }
      textarea.remove();
      if (previousFocus && previousFocus.focus) previousFocus.focus({ preventScroll: true });
      if (!copied) { toast('Clipboard access is unavailable. Select the text and copy it manually.'); return; }
    }
    toast(successMessage);
  }

  form.addEventListener('submit', event => { event.preventDefault(); loadPaste(input.value); });
  input.addEventListener('input', () => {
    form.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    $('clear-button').hidden = !input.value && !current && !busy;
  });
  $('clear-button').addEventListener('click', () => { resetView(); input.focus(); });
  $('cancel-button').addEventListener('click', () => {
    ++sequence;
    if (activeRequest) activeRequest.abort();
    activeRequest = null;
    setBusy(false);
    clearContent();
    showState('empty', 'Loading cancelled', 'Your link is still above. Open it whenever you are ready.');
  });
  $('clipboard-button').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) throw new Error('Clipboard unavailable');
      input.value = (await navigator.clipboard.readText()).trim().slice(0, 2048);
      input.dispatchEvent(new Event('input'));
      input.focus();
      if (!input.value) toast('Your clipboard is empty.');
    } catch (_) { input.focus(); toast('Press Ctrl+V, or Command+V on Mac, to paste your link.'); }
  });
  $('wrap-button').addEventListener('click', () => { preferences.wrap = !preferences.wrap; applyPreferences(true); });
  $('numbers-button').addEventListener('click', () => { preferences.numbers = !preferences.numbers; applyPreferences(true); });
  $('copy-button').addEventListener('click', () => { if (current) copyText(current.content, 'Paste text copied'); });
  $('share-button').addEventListener('click', () => { if (current) copyText(shareAddress(current.id), 'Link to this viewer copied'); });
  $('download-button').addEventListener('click', () => {
    if (!current) return;
    const safeName = current.title.replace(/[\x00-\x1f<>:"/\\|?*]/g, '_').replace(/[. ]+$/g, '').slice(0, 100) || `paste-${current.id}`;
    // Always download inert text, even when the paste title ends in .html or .exe.
    const fileName = /\.txt$/i.test(safeName) ? safeName : `${safeName}.txt`;
    const url = URL.createObjectURL(new Blob([current.content], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Download started');
  });
  window.addEventListener('popstate', () => {
    const id = new URLSearchParams(location.search).get('id');
    if (id) { input.value = id; loadPaste(id, false); }
    else resetView(false);
  });
  applyPreferences();
  const initialID = new URLSearchParams(location.search).get('id') || DEFAULT_PASTE_ID;
  if (initialID) { input.value = initialID; loadPaste(initialID, false); }
})();

// Match the quiet drifting particles on justkaarlo.com without a canvas loop.
(() => {
  const layer = document.getElementById('ambient-particles');
  if (layer) {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 30; index += 1) {
      const particle = document.createElement('span');
      particle.className = 'ambient-particle';
      particle.style.setProperty('--x', `${Math.random() * 100}%`);
      particle.style.setProperty('--y', `${Math.random() * 110}%`);
      particle.style.setProperty('--size', `${1 + Math.random() * 2.5}px`);
      particle.style.setProperty('--duration', `${65 + Math.random() * 70}s`);
      particle.style.setProperty('--delay', `${-Math.random() * 130}s`);
      fragment.appendChild(particle);
    }
    layer.appendChild(fragment);
    const updateMotion = () => layer.classList.toggle('is-paused', document.hidden);
    document.addEventListener('visibilitychange', updateMotion);
    updateMotion();
  }
  const year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();
})();
