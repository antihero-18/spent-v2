// One owner of persistence. The web build stores in localStorage; the Android
// shell swaps in a native SQLite-backed implementation with the same two methods
// so nothing above this file has to change.
(function () {
  'use strict';

  const KEY = 'tally.v1';

  window.SpentStorage = {
    key: KEY,
    read() {
      try {
        return localStorage.getItem(KEY);
      } catch (e) {
        return null;
      }
    },
    write(text) {
      localStorage.setItem(KEY, text);
    },
    clear() {
      try {
        localStorage.removeItem(KEY);
      } catch (e) {
        /* nothing to clear */
      }
    },
  };
})();
