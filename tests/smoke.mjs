import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const app = readFileSync('src/app.js', 'utf8');
const styles = readFileSync('src/styles.css', 'utf8');
const html = readFileSync('index.html', 'utf8');

const requiredAppFeatures = [
  'mens-et-manus-state-v1',
  'localStorage',
  'function renderDashboard',
  'function renderCalendarTodos',
  'function renderAssistant',
  'function renderAnalytics',
  'function renderMusic',
  'function renderCourses',
  'function renderSocial',
  'function renderNotes',
  'function toggleTimer',
  'function addEvent',
  'function addTodo',
  'function addCourse',
  'function addCapture',
  'function updateSelectedNote',
  'The Ultimate Ascended Myth',
  'Array.from({ length: 100 }',
];

for (const feature of requiredAppFeatures) {
  assert.ok(app.includes(feature), `Missing app feature: ${feature}`);
}

for (const selector of ['.pet-card', '.notes-layout', '.song-list', '.modal', '.inline-form']) {
  assert.ok(styles.includes(selector), `Missing style selector: ${selector}`);
}

assert.ok(html.includes('<div id="root"></div>'), 'Missing app mount node');
assert.ok(html.includes('/src/app.js'), 'Missing app script');
assert.ok(html.includes('/src/styles.css'), 'Missing stylesheet link');

console.log('Smoke checks passed: core Mens et Manus app features are present.');
