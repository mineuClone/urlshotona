(() => {
  const urlInput    = document.getElementById('url-input');
  const shortenBtn  = document.getElementById('shorten-btn');
  const errorMsg    = document.getElementById('error-msg');
  const resultBlock = document.getElementById('result-block');
  const shortLink   = document.getElementById('short-link');
  const copyBtn     = document.getElementById('copy-btn');
  const copyFeedback = document.getElementById('copy-feedback');
  const loadingBlock = document.getElementById('loading-block');

  // ── Validate URL ────────────────────────────────────────
  function isValidUrl(str) {
    try {
      const url = new URL(str);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  // ── Reset UI state ──────────────────────────────────────
  function resetState() {
    errorMsg.classList.add('hidden');
    resultBlock.classList.add('hidden');
    loadingBlock.classList.add('hidden');
    copyFeedback.classList.add('hidden');
    copyBtn.textContent = 'COPY';
  }

  // ── Show error ──────────────────────────────────────────
  function showError() {
    errorMsg.classList.remove('hidden');
    urlInput.focus();
  }

  // ── Shorten a link ──────────────────────────────────────
  async function shortenLink() {
    const raw = urlInput.value.trim();

    resetState();

    if (!raw || !isValidUrl(raw)) {
      showError();
      return;
    }

    // Show loading
    loadingBlock.classList.remove('hidden');
    shortenBtn.disabled = true;
    shortenBtn.textContent = '...';

    try {
      const res = await fetch(`/shorten?link=${encodeURIComponent(raw)}`,{method:"POST"});

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();

      if (!data.link) {
        throw new Error('No link in response');
      }

      // Display result
      shortLink.textContent = data.link;
      resultBlock.classList.remove('hidden');

    } catch (err) {
      console.error('Shorten error:', err);
      errorMsg.textContent = '! SERVER ERROR — TRY AGAIN';
      errorMsg.classList.remove('hidden');
    } finally {
      loadingBlock.classList.add('hidden');
      shortenBtn.disabled = false;
      shortenBtn.textContent = 'SHORTEN';
    }
  }

  // ── Copy to clipboard ───────────────────────────────────
  async function copyToClipboard() {
    const text = shortLink.textContent;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'COPIED';
      copyFeedback.classList.remove('hidden');

      setTimeout(() => {
        copyBtn.textContent = 'COPY';
        copyFeedback.classList.add('hidden');
      }, 2500);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);

      copyBtn.textContent = 'COPIED';
      copyFeedback.classList.remove('hidden');

      setTimeout(() => {
        copyBtn.textContent = 'COPY';
        copyFeedback.classList.add('hidden');
      }, 2500);
    }
  }

  // ── Event listeners ─────────────────────────────────────
  shortenBtn.addEventListener('click', shortenLink);

  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') shortenLink();
  });

  // Clear error on typing
  urlInput.addEventListener('input', () => {
    if (!errorMsg.classList.contains('hidden')) {
      errorMsg.classList.add('hidden');
    }
  });

  copyBtn.addEventListener('click', copyToClipboard);

})();