const express = require('express');
const fs = require('node:fs');
const path = require('node:path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const wwwDir = path.join(__dirname, 'www');
const staticDir = fs.existsSync(path.join(wwwDir, 'index.html')) ? wwwDir : __dirname;

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(express.static(staticDir));

app.use((_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Spent server listening on http://${HOST}:${PORT} (serving ${path.basename(staticDir) || '.'})`);
});
