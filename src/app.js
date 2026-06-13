const STORAGE_KEY = 'mens-et-manus-state-v1';

const defaultState = {
  activeSection: 'Dashboard',
  studyTimerRunning: false,
  timerStartedAt: null,
  elapsedSeconds: 5100,
  quickCaptureOpen: false,
  showSignupConfetti: true,
  showUltimateCelebration: false,
  petDialogueIndex: 0,
  activeTrack: 1,
  selectedNoteId: 1,
  selectedFolder: 'All Notes',
  courses: [
    { id: 1, name: 'Advanced Calculus', code: 'MATH 301', color: '#7dd3fc', icon: '∑', professor: 'Dr. Ada Stone', semester: 'Semester 1', university: 'Mens et Manus University', college: 'College of Science', program: 'BS Applied Mathematics' },
    { id: 2, name: 'Design Thinking', code: 'DSGN 220', color: '#f5c16c', icon: '✦', professor: 'Prof. Kai Rivera', semester: 'Semester 2', university: 'Mens et Manus University', college: 'College of Architecture', program: 'BS Product Design' },
    { id: 3, name: 'Data Structures', code: 'CS 210', color: '#a78bfa', icon: '⌬', professor: 'Dr. Lin Park', semester: 'Semester 1', university: 'Mens et Manus University', college: 'College of Computing', program: 'BS Computer Science' },
  ],
  events: [
    { id: 1, time: '09:00', title: 'Advanced Calculus lecture', tone: 'blue' },
    { id: 2, time: '14:00', title: 'Lab submission checkpoint', tone: 'gold' },
    { id: 3, time: '19:00', title: 'Study group with Ada', tone: 'violet' },
  ],
  todos: [
    { id: 1, title: 'Finish practice test', done: true },
    { id: 2, title: 'Annotate philosophy PDF', done: false },
    { id: 3, title: 'Review calculus proofs', done: false },
    { id: 4, title: 'Upload lab voice memo', done: false },
  ],
  notes: [
    { id: 1, title: 'Thesis prompts', folder: 'Advanced Calculus', tag: '#Research', edited: Date.now() - 7200000, text: 'Compare discipline systems across academic performance datasets and create a framework for focused repetition.' },
    { id: 2, title: 'Exam prep checklist', folder: 'Data Structures', tag: '#ExamPrep', edited: Date.now() - 1080000, text: 'Revise lecture slides, create active recall cards, complete two practice exams, and ask AI for weak spots.' },
    { id: 3, title: 'Startup idea canvas', folder: 'Quick Brainstorms', tag: '#Ideas', edited: Date.now() - 86400000, text: 'AI course planner that connects notes, Drive files, peer study sessions, and timer analytics.' },
  ],
  captures: [],
};

const quotes = [
  'Discipline is choosing what you want most over what you want now.',
  'Consistency compounds. One focused block at a time.',
  'Be number one in effort before you become number one in results.',
  'Habits are the architecture of greatness.',
  'Win the morning, protect the chain, become undeniable.',
];

const navigation = [['Dashboard','⌂'],['Calendar','◴'],['To Dos','☑'],['AI Assistant','🤖'],['Analytics','▥'],['Focus Music','♫'],['Gmail','✉'],['Drive','☁'],['Notes & Ideas','✎'],['Courses','▣'],['Social Hub','☷'],['Profile','⚙']];
const iconChoices = ['∑','✦','⌬','⚗','⚖','✎','☊','♬','◈','✚','◎','Ψ','λ','π','∆','Ω','☼','☾','✧','◌'];
const focusTracks = Array.from({ length: 100 }, (_, index) => ({ id: index + 1, title: `Focus Track ${String(index + 1).padStart(3, '0')}`, mood: ['Deep Study Atmosphere','Library Rain','Cosmic Piano','Brown Noise'][index % 4] }));
const streakTiers = [[1000,'The Ultimate Ascended Myth',['1000 Days of Absolute Greatness. You have reached the peak of human discipline.']],[900,'Radiant White-Gold Titan',['Nine hundred days. Your discipline shines beyond limits.']],[850,'Solar Mythic Armor',['Your armor burns with white-gold resolve.']],[800,'Astral Paladin',['Eight hundred days of relentless momentum.']],[750,'Luminous Crowned Beast',['Your standards are becoming legendary.']],[700,'White-Gold Sentinel',['Seven hundred days. You are forged by routine.']],[650,'Radiant Starforged Spirit',['Every session adds another layer of brilliance.']],[600,'Celestial Commander',['Six hundred days. Command the day.']],[550,'Auric Runebound Guardian',['The path glows brighter because you keep walking.']],[500,'Starry Night Sovereign',['Halfway to a thousand. The night sky remembers your work.']],[450,'Runic Circle Monarch',['Massive runes answer your focus.']],[400,'Indigo Flame Deity',['Your focus burns with cosmic indigo fire.']],[350,'Stardust Cape Guardian',['A cape of stardust follows disciplined action.']],[300,'Aurora Beast',['Your aura shifts like northern lights.']],[250,'Galaxy Keeper',['A constellation turns between your paws.']],[200,'Rune-Etched Fortress',['Two hundred days. You have built a fortress of consistency.']],[150,'Orbit Ring Guardian',['Time bends to your focus.']],[100,'Century Monarch',['One hundred days of absolute mastery. You are a king of discipline.','A legendary milestone, but the journey continues.']],[80,'Stardust Aura',['The stars align with your dedication.','Push past your limits today.']],[60,'Dark Brass Armor',['Protected by pure routine. Nothing breaks this streak.','Your work ethic is armor.']],[40,'Runic Core',['The ancient markings pulse with your focus.','Stay locked in.']],[30,'Guardian Spirit',['A full month of discipline. Greatness is earned daily.','Embrace the discomfort.']],[20,'Adolescent Beast',['I feel the energy growing. What are we studying today?',"Don't break the chain."]],[7,'Tiny Wisp/Spirit',["A spark is lit. Let's keep it burning!",'Consistency starts now.']],[0,'Obsidian Egg',['Crack the shell by completing your first task...',"I'm waiting to hatch."]]];

let appState = loadState();
let timerInterval;

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? { ...defaultState, ...JSON.parse(saved) } : structuredClone(defaultState);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...appState, showSignupConfetti: false, quickCaptureOpen: false }));
}

function html(strings, ...values) { return strings.reduce((out, str, i) => out + str + (values[i] ?? ''), ''); }
function escapeHtml(value = '') { return String(value).replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char])); }
function getStreakForm(day) { const [minimumDay, name, dialogue] = streakTiers.find(([tierDay]) => day >= tierDay); return { minimumDay, name, dialogue }; }
function currentElapsed() { return appState.studyTimerRunning ? appState.elapsedSeconds + Math.floor((Date.now() - appState.timerStartedAt) / 1000) : appState.elapsedSeconds; }
function formatTime(seconds) { const h = String(Math.floor(seconds / 3600)).padStart(2, '0'); const m = String(Math.floor(seconds % 3600 / 60)).padStart(2, '0'); const s = String(seconds % 60).padStart(2, '0'); return `${h}:${m}:${s}`; }
function relativeTime(time) { const mins = Math.max(1, Math.floor((Date.now() - time) / 60000)); if (mins < 60) return `Edited ${mins} minutes ago`; const hrs = Math.floor(mins / 60); if (hrs < 24) return `Edited ${hrs} hours ago`; return `Edited ${Math.floor(hrs / 24)} days ago`; }

function renderPage() {
  const page = { Dashboard: renderDashboard, Calendar: renderCalendarTodos, 'To Dos': renderCalendarTodos, 'AI Assistant': renderAssistant, Analytics: renderAnalytics, 'Focus Music': renderMusic, Gmail: renderIntegrations, Drive: renderIntegrations, 'Notes & Ideas': renderNotes, Courses: renderCourses, 'Social Hub': renderSocial, Profile: renderProfile }[appState.activeSection]();
  document.querySelector('#root').innerHTML = html`<div class="app">${appState.showSignupConfetti ? renderConfetti('signup') : ''}${appState.showUltimateCelebration ? renderConfetti('ultimate') : ''}${renderSidebar()}<div class="shell">${renderHeader()}${page}</div>${appState.quickCaptureOpen ? renderQuickCaptureModal() : ''}</div>`;
  bindEvents();
}

function renderConfetti(kind) { return `<div class="confetti ${kind}" aria-hidden="true">${Array.from({ length: kind === 'ultimate' ? 140 : 80 }, () => `<i style="--x:${Math.random() * 100}vw;--d:${Math.random() * 2}s"></i>`).join('')}</div>`; }
function renderSidebar() { return html`<aside><div class="brand"><span>🎓</span><strong>Mens et Manus</strong></div>${navigation.map(([name, icon]) => `<button data-nav="${name}" class="${appState.activeSection === name ? 'active' : ''}"><span>${icon}</span>${name}</button>`).join('')}<div class="social-search"><span>⌕</span><input id="global-search" placeholder="Search nickname..." /></div></aside>`; }
function renderHeader() { const now = new Date(); return html`<header><div><p class="eyebrow">Mind and hand · live command center</p><h1>Mens et Manus</h1></div><button data-action="quick-capture" class="capture">💡 Quick Capture</button><div class="clock">${now.toLocaleDateString()} · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div></header>`; }

function renderPet(day) {
  const form = getStreakForm(day);
  const dialogue = form.dialogue[appState.petDialogueIndex % form.dialogue.length];
  const classes = ['pet-card', appState.studyTimerRunning ? 'focus' : '', day >= 500 ? 'starry' : '', day >= 1000 ? 'legendary' : '', `tier-${form.minimumDay}`].filter(Boolean).join(' ');
  return html`<section class="${classes}" data-action="pet" aria-label="Animated streak pet"><div class="bubble">${dialogue}</div><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="runes">ᚠ ᚱ ᚨ</div><div class="pet"><span class="crown">♛</span><span class="core">◆</span><span class="paws">◖ ◗</span></div><div class="pet-name"><span>🔥</span>${form.name}<b>${day} day streak</b></div></section>`;
}

function renderDashboard() {
  const quote = quotes[new Date().getDate() % quotes.length];
  return html`<main class="grid dashboard-grid"><section class="hero"><p class="eyebrow">Daily quotation</p><h2>${quote}</h2><p>Today’s mission: protect the chain, complete the next action, and raise your standard.</p><div class="hero-actions"><button data-nav="Analytics">Start first focus block</button><button data-nav="AI Assistant" class="ghost">Plan my day with AI</button></div></section>${renderPet(150)}<section><h3>My Courses</h3><div class="cards">${appState.courses.map(renderCourseCard).join('')}</div></section><section><h3>Today</h3><p class="big">${appState.todos.filter(t => !t.done).length} tasks · ${appState.events.length} events · ${Math.floor(currentElapsed()/60)} focus minutes</p><div class="progress"><span style="width:${Math.min(100, Math.floor(currentElapsed()/90))}%"></span></div></section></main>`;
}

function renderCourseCard(course) { return html`<article class="course" style="--c:${course.color}" data-course="${course.id}"><strong>${course.icon} ${escapeHtml(course.name)}</strong><span>${escapeHtml(course.code)} · ${course.semester}</span><small>${escapeHtml(course.professor)}</small></article>`; }

function renderCalendarTodos() {
  return html`<main class="two"><section><h2>Calendar</h2><p class="muted">Add classes, deadlines, exams, study blocks, meetings, and personal routines.</p><form class="inline-form" data-form="event"><input name="time" type="time" required /><input name="title" placeholder="New event" required /><button>Add Event</button></form><div class="timeline">${appState.events.map(event => `<article class="event ${event.tone}"><strong>${event.time}</strong><span>${escapeHtml(event.title)}</span><button data-delete-event="${event.id}" class="icon-btn">×</button></article>`).join('')}</div></section><section><h2>To Dos</h2><p class="muted">Tasks connect to courses, streaks, notes, and the assistant.</p><form class="inline-form" data-form="todo"><input name="title" placeholder="New task" required /><button>Add Task</button></form>${appState.todos.map(todo => `<label class="row"><span><input type="checkbox" data-todo="${todo.id}" ${todo.done ? 'checked' : ''}/> ${escapeHtml(todo.title)}</span><button data-delete-todo="${todo.id}" class="icon-btn">×</button></label>`).join('')}</section></main>`;
}

function renderAssistant() { return html`<main><section class="assistant-panel"><div class="assistant-icon">🤖</div><h2>Very Strong AI Assistant</h2><p>Ask for study plans, document explanations, selected-text analysis, quiz generation, inbox summaries, Drive search, course coaching, note cleanup, and practice exams. Selected document text is staged for review before sending.</p><div class="prompt-grid"><button>Generate a 7-day study plan</button><button>Summarize my inbox</button><button>Create active recall cards</button></div><textarea placeholder="Ask Mens et Manus AI..."></textarea><button>Send to AI</button></section><button class="floating-ai" aria-label="Floating AI assistant">🤖</button></main>`; }

function renderAnalytics() { return html`<main class="two"><section><h2>Study Timer</h2><div class="timer" id="timer-display">${formatTime(currentElapsed())}</div><button data-action="toggle-timer">${appState.studyTimerRunning ? 'Pause' : 'Start'} focus</button><div class="stats"><b>Today ${Math.floor(currentElapsed()/60)}m</b><b>This week 11h</b><b>All time ${Math.floor(currentElapsed()/3600)+486}h</b></div><div class="chart"><span style="height:35%"></span><span style="height:65%"></span><span style="height:48%"></span><span style="height:88%"></span><span style="height:72%"></span></div></section>${renderPet(500)}</main>`; }

function renderMusic() { return html`<main><section><h2>Focus Music Library</h2><p class="muted">100 background-ready songs. The mini player stays visible while switching sections.</p><div class="song-list">${focusTracks.map(track => `<button class="song ${appState.activeTrack === track.id ? 'playing' : ''}" data-track="${track.id}">▶ <span>${track.title}</span><small>${track.mood}</small></button>`).join('')}</div></section><div class="mini">♫ Now playing: Focus Track ${String(appState.activeTrack).padStart(3, '0')}</div></main>`; }

function renderIntegrations() { return html`<main class="two"><section><h2>Gmail</h2><button>Connect Google</button>${['Professor feedback','University bulletin','Study group notes'].map(subject => `<p class="row">${subject}<span>Open</span></p>`).join('')}</section><section><h2>Google Drive</h2><button>Connect Drive</button>${['Syllabus.pdf','Lecture Deck.pptx','Voice memo.mp3','Research Dataset.xlsx'].map(file => `<p class="row">📁 ${file}<span>Preview</span></p>`).join('')}</section></main>`; }

function renderCourses() {
  return html`<main><section><h2>Academic Years & Course Builder</h2><p class="muted">Add an academic year, then create courses with names, codes, semester 1-3, professor, university, college, program, colors, and icons.</p><form class="form-grid" data-form="course"><input name="name" placeholder="Course name" required /><input name="code" placeholder="Code" required /><input name="professor" placeholder="Professor" /><input name="university" placeholder="University name" /><input name="college" placeholder="College" /><input name="program" placeholder="Program" /><select name="semester"><option>Semester 1</option><option>Semester 2</option><option>Semester 3</option></select><input name="color" type="color" value="#d6a84f" /><button>Create Course</button></form><h3>100 icon options</h3><div class="icons">${Array.from({ length: 100 }, (_, index) => `<span>${iconChoices[index % iconChoices.length]}</span>`).join('')}</div></section><section><h3>Course Workspace</h3><div class="tabs">${['Documents','Activities','Reviewers','Practice Test','Resources','Videos'].map(tab => `<button>${tab}</button>`).join('')}</div><p>Upload PDFs, PPT, docs, audio, images, videos, and site links. Full-screen viewer supports split notes, rich editing, annotations, copy/paste/edit, and staged AI assistant actions. YouTube links open in the built-in viewer.</p><div class="viewer-preview"><div>Full-screen document/video viewer</div><aside>Notes + annotation panel</aside></div><button>⤴ Upload</button><button class="danger">Delete Course</button></section></main>`;
}

function renderSocial() { return html`<main class="two"><section><h2>Social Hub</h2><input placeholder="Search name or nickname" /><p class="row">@mitScholar <button>Add Friend</button></p><p class="row">@focusPhoenix <button>Add Friend</button></p><button>Suggest Facebook friends</button></section><section><h2>Messages</h2><div class="chat"><p><b>Ada:</b> Sent Practice-Test.pdf</p><p><b>You:</b> Great, opening preview inside the document viewer.</p><input placeholder="Message or attach PDFs, Docs, Photos, PPT, Audio..." /></div></section></main>`; }

function renderNotes() {
  const folders = ['All Notes','Uncategorized','Quick Brainstorms',...appState.courses.map(course => course.name)];
  const visible = appState.selectedFolder === 'All Notes' ? appState.notes : appState.notes.filter(note => note.folder === appState.selectedFolder);
  const selected = appState.notes.find(note => note.id === appState.selectedNoteId) || appState.notes[0];
  return html`<main class="notes-layout"><section class="navigator"><input placeholder="Search entries" /><button data-action="new-note">New Note</button><button data-action="new-canvas">New Idea Canvas</button>${folders.map(folder => `<p class="row folder ${appState.selectedFolder === folder ? 'selected' : ''}" data-folder="${folder}">${folder}</p>`).join('')}</section><section class="note-list">${visible.map(note => `<article class="note-card ${selected?.id === note.id ? 'selected' : ''}" data-note="${note.id}"><strong>${escapeHtml(note.title)}</strong><small>${relativeTime(note.edited)}</small><p>${escapeHtml(note.text).slice(0, 120)}</p><span>${escapeHtml(note.tag)}</span></article>`).join('')}</section><section class="workspace"><div class="toolbar"><button>B</button><button>I</button><button>• List</button><button>Code</button><button>Highlight</button><select id="note-folder">${folders.slice(1).map(folder => `<option ${selected?.folder === folder ? 'selected' : ''}>${folder}</option>`).join('')}</select></div><input id="note-title" value="${escapeHtml(selected?.title)}" placeholder="Note title" /><textarea id="note-text">${escapeHtml(selected?.text)}</textarea><input id="note-tag" value="${escapeHtml(selected?.tag)}" placeholder="#Tag" /><div class="canvas-grid"><div class="sticky">Essay hook</div><div class="sticky blue">Dataset link</div><div class="sticky violet">Counterargument</div></div><div class="saved">✓ Auto-saved</div></section></main>`;
}

function renderProfile() { return html`<main><section><h2>Profile & Login</h2><button>Continue with Google</button><button>Continue with Facebook</button><div class="form-grid"><input placeholder="Public nickname" /><input placeholder="Avatar URL" /><input placeholder="School status" /></div><p>Friend count: 24 · Public streak: 150 days</p></section></main>`; }
function renderQuickCaptureModal() { return html`<div class="modal" role="dialog" aria-modal="true"><form data-form="capture"><h2>Quick Capture</h2><p class="muted">Capture a thought or paste a URL without leaving the current workspace.</p><textarea name="text" placeholder="Type a thought or paste URL..." required></textarea><button>Save thought</button><button type="button" data-action="close-capture" class="ghost">Cancel</button></form></div>`; }

function bindEvents() {
  document.querySelectorAll('[data-nav]').forEach(button => button.addEventListener('click', () => { appState.activeSection = button.dataset.nav; saveState(); renderPage(); }));
  document.querySelector('[data-action="quick-capture"]')?.addEventListener('click', () => { appState.quickCaptureOpen = true; renderPage(); });
  document.querySelector('[data-action="close-capture"]')?.addEventListener('click', () => { appState.quickCaptureOpen = false; renderPage(); });
  document.querySelector('[data-action="toggle-timer"]')?.addEventListener('click', toggleTimer);
  document.querySelector('[data-action="pet"]')?.addEventListener('click', event => { appState.petDialogueIndex += 1; event.currentTarget.querySelector('.pet').classList.add('spin'); saveState(); setTimeout(renderPage, 700); });
  document.querySelectorAll('[data-track]').forEach(button => button.addEventListener('click', () => { appState.activeTrack = Number(button.dataset.track); saveState(); renderPage(); }));
  document.querySelectorAll('[data-todo]').forEach(box => box.addEventListener('change', () => { const todo = appState.todos.find(item => item.id === Number(box.dataset.todo)); todo.done = box.checked; saveState(); renderPage(); }));
  document.querySelectorAll('[data-delete-todo]').forEach(button => button.addEventListener('click', () => { appState.todos = appState.todos.filter(todo => todo.id !== Number(button.dataset.deleteTodo)); saveState(); renderPage(); }));
  document.querySelectorAll('[data-delete-event]').forEach(button => button.addEventListener('click', () => { appState.events = appState.events.filter(event => event.id !== Number(button.dataset.deleteEvent)); saveState(); renderPage(); }));
  document.querySelectorAll('[data-note]').forEach(card => card.addEventListener('click', () => { appState.selectedNoteId = Number(card.dataset.note); saveState(); renderPage(); }));
  document.querySelectorAll('[data-folder]').forEach(folder => folder.addEventListener('click', () => { appState.selectedFolder = folder.dataset.folder; renderPage(); }));
  document.querySelector('[data-action="new-note"]')?.addEventListener('click', newNote);
  document.querySelector('[data-action="new-canvas"]')?.addEventListener('click', newNote);
  document.querySelectorAll('#note-title,#note-text,#note-tag,#note-folder').forEach(input => input.addEventListener('input', updateSelectedNote));
  document.querySelector('[data-form="event"]')?.addEventListener('submit', addEvent);
  document.querySelector('[data-form="todo"]')?.addEventListener('submit', addTodo);
  document.querySelector('[data-form="course"]')?.addEventListener('submit', addCourse);
  document.querySelector('[data-form="capture"]')?.addEventListener('submit', addCapture);
}

function toggleTimer() {
  if (appState.studyTimerRunning) appState.elapsedSeconds = currentElapsed();
  appState.studyTimerRunning = !appState.studyTimerRunning;
  appState.timerStartedAt = appState.studyTimerRunning ? Date.now() : null;
  saveState();
  renderPage();
  configureTimerInterval();
}

function configureTimerInterval() {
  clearInterval(timerInterval);
  if (!appState.studyTimerRunning) return;
  timerInterval = setInterval(() => {
    const display = document.querySelector('#timer-display');
    if (display) display.textContent = formatTime(currentElapsed());
  }, 1000);
}

function addEvent(event) { event.preventDefault(); const data = new FormData(event.target); appState.events.push({ id: Date.now(), time: data.get('time'), title: data.get('title'), tone: 'gold' }); saveState(); renderPage(); }
function addTodo(event) { event.preventDefault(); const data = new FormData(event.target); appState.todos.push({ id: Date.now(), title: data.get('title'), done: false }); saveState(); renderPage(); }
function addCourse(event) { event.preventDefault(); const data = new FormData(event.target); appState.courses.push({ id: Date.now(), name: data.get('name'), code: data.get('code'), color: data.get('color'), icon: iconChoices[appState.courses.length % iconChoices.length], professor: data.get('professor') || 'Professor TBD', semester: data.get('semester'), university: data.get('university'), college: data.get('college'), program: data.get('program') }); saveState(); renderPage(); }
function addCapture(event) { event.preventDefault(); const data = new FormData(event.target); appState.captures.push({ id: Date.now(), text: data.get('text'), created: Date.now() }); appState.quickCaptureOpen = false; saveState(); renderPage(); }
function newNote() { const note = { id: Date.now(), title: 'Untitled Note', folder: appState.selectedFolder === 'All Notes' ? 'Uncategorized' : appState.selectedFolder, tag: '#New', edited: Date.now(), text: '' }; appState.notes.unshift(note); appState.selectedNoteId = note.id; saveState(); renderPage(); }
function updateSelectedNote() { const note = appState.notes.find(item => item.id === appState.selectedNoteId); if (!note) return; note.title = document.querySelector('#note-title').value; note.text = document.querySelector('#note-text').value; note.tag = document.querySelector('#note-tag').value; note.folder = document.querySelector('#note-folder').value; note.edited = Date.now(); saveState(); }

setTimeout(() => { appState.showSignupConfetti = false; saveState(); renderPage(); }, 3500);
renderPage();
configureTimerInterval();
