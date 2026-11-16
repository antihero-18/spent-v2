// Copies the web app into www/ and bundles the native glue into a plain script
// the page can load. Run with: npm run build:web
import { cp, mkdir, rm } from 'node:fs/promises';
import { build } from 'esbuild';

const WEB = ['index.html', 'styles.css', 'spent.js', 'storage.js', 'assets'];

await rm('www', { recursive: true, force: true });
await mkdir('www', { recursive: true });
for (const entry of WEB) await cp(entry, `www/${entry}`, { recursive: true });

await build({
  entryPoints: ['native.js'],
  outfile: 'www/native.bundle.js',
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  minify: true,
  legalComments: 'none',
});

// The same bundle sits next to index.html so the browser preview loads it too.
await cp('www/native.bundle.js', 'native.bundle.js');
console.log('built www/ and native.bundle.js');
