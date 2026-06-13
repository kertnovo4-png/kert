import { mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

const files = [
  ['index.html', 'dist/index.html'],
  ['src/app.js', 'dist/src/app.js'],
  ['src/styles.css', 'dist/src/styles.css'],
];

rmSync('dist', { recursive: true, force: true });

for (const [from, to] of files) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

console.log('Mens et Manus app packaged in ./dist');
console.log(`Open ${join(process.cwd(), 'dist/index.html')} or run: python3 -m http.server 5173 -d dist`);
