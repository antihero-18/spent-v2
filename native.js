import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Keyboard } from '@capacitor/keyboard';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

/*
 * Android shell glue. Does nothing in a browser: every piece of the app itself
 * lives in spent.js, and this file only teaches the WebView how Android behaves.
 */

if (Capacitor.isNativePlatform()) {
  start();
}

async function start() {
  const app = window.SpentNative;
  if (!app) return;

  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  const PAPER = '#f7f6f3';
  const NIGHT = '#0b0b0c';

  async function paintSystemBars() {
    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setStyle({ style: dark.matches ? Style.Dark : Style.Light });
      if (!dark.matches) await StatusBar.setBackgroundColor({ color: PAPER });
    } catch {
      /* StatusBar is best effort; the theme already matches on launch */
    }
  }

  paintSystemBars();
  dark.addEventListener('change', () => {
    paintSystemBars();
    setTimeout(paintSystemBars, 120);
  });

  /* Hardware back: unwind in-app state first, then leave like a native app. */
  App.addListener('backButton', () => {
    if (app.back()) return;
    App.minimizeApp();
  });

  /* The keyboard resizes the WebView (Keyboard.resize = native); keep the
     amount field in view while it is open. */
  Keyboard.addListener('keyboardShow', () => app.keyboard(true));
  Keyboard.addListener('keyboardHide', () => app.keyboard(false));

  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  await Promise.all([fonts, new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))]);
  try {
    await SplashScreen.hide();
  } catch {
    /* launchAutoHide already covered it */
  }
}
