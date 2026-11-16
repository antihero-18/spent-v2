# Spent

A small expense tracker: what you spent this month, what is left of the budget, and where it went.
One page, local-first, no accounts.

The design is flat and editorial — hairline rules instead of cards, a serif numeral for the total, and sage in exactly two places: the budget ring and the add button.

## Run the web app

```sh
python3 serve.py        # http://localhost:3000
```

`serve.py` is a no-store static server, so edits show up on reload without cache fighting you. Any other static server works too — the page needs `assets/` and the two scripts next to `index.html`.

## Build the Android app

The APK is the same web assets in a Capacitor shell, so the rendering is identical by construction.

```sh
npm install
npm run android         # builds www/, syncs Capacitor, opens Android Studio
```

Or without Studio:

```sh
npm run sync
cd android && ./gradlew assembleDebug
```

First build downloads Gradle 8.14.3 and needs JDK 17+ plus Android SDK 36 (Android Studio ships both).
`www/`, `android/app/src/main/assets/public` and `native.bundle.js` are generated, so run `npm run sync` before a Gradle build from a fresh clone.

| Script | Does |
| --- | --- |
| `npm run build:web` | stages the web app into `www/` and bundles `native.js` |
| `npm run sync` | `build:web` + `cap sync android` |
| `npm run android` | `sync` + `cap open android` |
| `npm run icons` | regenerates launcher icons and splash screens |

## Releasing an APK

The workflow in `.github/workflows/android-release.yml` builds a signed, universal APK for every `v*` tag and attaches it to a GitHub Release. Pushing a tag is the whole release:

```sh
git tag v0.1.0
git push origin v0.1.0
```

The tag sets the name (`v0.1.0` → `0.1.0`) and the version code (`0.1.0` → `100`). A manual dispatch from the Actions tab builds the same APK as a downloadable artifact without publishing a release.

Four repository secrets are needed (Settings → Secrets and variables → Actions):

| Secret | Value |
| --- | --- |
| `KEYSTORE_BASE64` | `base64 -w0 spent-release.jks` output, one line |
| `KEYSTORE_PASSWORD` | keystore password |
| `KEY_ALIAS` | key alias, e.g. `spent` |
| `KEY_PASSWORD` | key password |

Create the keystore once, on your own machine, and keep it:

```sh
keytool -genkey -v -keystore spent-release.jks -alias spent -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 spent-release.jks > keystore.txt   # paste this into KEYSTORE_BASE64, then delete it
```

Lose the keystore and you cannot publish an update that installs over the previous APK, so keep a backup somewhere safe. Without `KEYSTORE_BASE64` the workflow still builds, but the APK is debug-signed and not fit to ship.

## Layout

- `index.html`, `styles.css`, `spent.js` — the whole app. No framework, no bundler for the web side.
- `storage.js` — the persistence seam (`window.SpentStorage`). localStorage today; the same three methods back a native store later.
- `native.js` — Android glue: hardware back, status bar, splash handoff, keyboard. Inert in a browser. Bundled by `scripts/build-web.mjs`.
- `resources/` — icon and splash sources. `resources/mark.html` is the page the mark is rendered from, so the launcher icon uses the same Instrument Serif as the app.
- `scripts/` — web staging and the 108 dp adaptive icon generator.
- `android/` — the Capacitor Android project (`com.spent.app`, min SDK 24, target SDK 36).

## Privacy

No accounts and no network calls: expenses live in this device's storage only, and the app never sends them anywhere.
The `INTERNET` permission is present because Capacitor serves the app to the system WebView from localhost — not because Spent phones home.

## Deterministic states

`?fixture=1&today=2026-11-15` loads a fixed month, pins the clock and never writes, which is how reference screenshots are taken.

## Licence

MIT — see [LICENSE](LICENSE).
