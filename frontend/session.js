var IDLE_LIMIT_MS = 30 * 60 * 1000;

function makeSession(namespace) {
  var codeKey = namespace + '_code';
  var nameKey = namespace + '_name';
  var lastKey = namespace + '_lastActivity';

  function save(code, name) {
    sessionStorage.setItem(codeKey, code);
    sessionStorage.setItem(nameKey, name || '');
    sessionStorage.setItem(lastKey, Date.now().toString());
  }

  function load() {
    var code = sessionStorage.getItem(codeKey);
    if (!code) return null;

    var last = Number(sessionStorage.getItem(lastKey) || 0);
    if (Date.now() - last > IDLE_LIMIT_MS) {
      clear();
      return null;
    }

    return { code: code, name: sessionStorage.getItem(nameKey) };
  }

  function clear() {
    sessionStorage.removeItem(codeKey);
    sessionStorage.removeItem(nameKey);
    sessionStorage.removeItem(lastKey);
  }

  function touch() {
    if (sessionStorage.getItem(codeKey)) {
      sessionStorage.setItem(lastKey, Date.now().toString());
    }
  }

  function initIdleTimeout(onTimeout) {
    ['click', 'keydown', 'mousemove', 'scroll'].forEach(function (evt) {
      document.addEventListener(evt, touch);
    });

    setInterval(function () {
      if (!sessionStorage.getItem(codeKey)) return;

      var last = Number(sessionStorage.getItem(lastKey) || 0);
      if (Date.now() - last > IDLE_LIMIT_MS) {
        clear();
        onTimeout();
      }
    }, 30 * 1000);
  }

  return { save: save, load: load, clear: clear, initIdleTimeout: initIdleTimeout };
}
