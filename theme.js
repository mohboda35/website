(function () {
  var STORAGE_KEY = 'wildai-theme';

  function applyTheme(mode) {
    if (mode === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = mode === 'light' ? '🌙' : '☀️';
  }

  function toggleTheme() {
    var current = document.body.classList.contains('light') ? 'light' : 'dark';
    var next = current === 'light' ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  function init() {
    var saved = localStorage.getItem(STORAGE_KEY) || 'dark';
    applyTheme(saved);

    var btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle light/dark mode');
    btn.textContent = saved === 'light' ? '🌙' : '☀️';
    btn.addEventListener('click', toggleTheme);
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
