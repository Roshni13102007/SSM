// ─── Data ──────────────────────────────────────────────────
const quotes = [
  { text: "You don't have to be positive all the time. It's okay to feel what you feel.", author: "Lori Deschene" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "You are allowed to be both a masterpiece and a work in progress.", author: "Sophia Bush" },
  { text: "Breathe. You're going to be okay.", author: "Daniell Koepke" },
  { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
  { text: "Be gentle with yourself.", author: "Max Ehrmann" },
  { text: "Healing is not linear. Be patient with yourself.", author: "Unknown" },
  { text: "Rest is not idleness. It is a necessity.", author: "Unknown" },
  { text: "Your feelings are valid. Every single one of them.", author: "Unknown" },
  { text: "Small steps every day lead to big changes.", author: "Unknown" }
];

const moodInfo = {
  happy:       { emoji: '😊', label: 'Happy',       badge: 'bc', group: 'positive' },
  excited:     { emoji: '🤩', label: 'Excited',     badge: 'bc', group: 'positive' },
  calm:        { emoji: '😌', label: 'Calm',         badge: 'bc', group: 'positive' },
  grateful:    { emoji: '🙏', label: 'Grateful',    badge: 'bc', group: 'positive' },
  hopeful:     { emoji: '🌱', label: 'Hopeful',     badge: 'bp', group: 'positive' },
  neutral:     { emoji: '😐', label: 'Neutral',     badge: 'bp', group: 'neutral'  },
  lonely:      { emoji: '🫂', label: 'Lonely',      badge: 'bw', group: 'low'     },
  tired:       { emoji: '😴', label: 'Tired',       badge: 'bw', group: 'low'     },
  anxious:     { emoji: '😰', label: 'Anxious',     badge: 'bs', group: 'stress'  },
  stressed:    { emoji: '😞', label: 'Stressed',    badge: 'bs', group: 'stress'  },
  frustrated:  { emoji: '😤', label: 'Frustrated',  badge: 'bs', group: 'stress'  },
  overwhelmed: { emoji: '🥺', label: 'Overwhelmed', badge: 'bs', group: 'stress'  }
};

// Mood-based suggestions library
const moodSuggestions = {
  positive: [
    { icon: '📝', text: 'Write down what made today feel good — keep that energy.' },
    { icon: '💌', text: 'Share your joy: reach out to someone you care about.' },
    { icon: '🎵', text: 'Put on your favourite uplifting playlist and ride this wave.' },
    { icon: '🌿', text: 'Step outside for a few minutes to savour the feeling.' },
  ],
  neutral: [
    { icon: '🧘', text: 'Take 5 slow breaths and check in with your body.' },
    { icon: '📖', text: 'Read something that interests you for 10 minutes.' },
    { icon: '🚶', text: 'A short walk, even 5 minutes, can shift the energy.' },
    { icon: '💧', text: 'Drink a full glass of water and stretch gently.' },
  ],
  low: [
    { icon: '🤗', text: "You're not alone — connect with someone who makes you feel seen." },
    { icon: '🛌', text: 'Protect your sleep tonight. Wind down an hour earlier.' },
    { icon: '🕯️', text: 'Create a cosy space: dim the lights, make a warm drink.' },
    { icon: '🎶', text: 'Put on calming music and let yourself just exist for a moment.' },
    { icon: '📓', text: 'Journal prompt: what would feel kind to do for yourself right now?' },
  ],
  stress: [
    { icon: '💨', text: 'Try the 4-7-8 breathing technique for instant calm.' },
    { icon: '🚿', text: 'Splash cold water on your face — it activates your dive reflex.' },
    { icon: '🏃', text: 'Move your body for 5 minutes: shake it out, pace, stretch.' },
    { icon: '📋', text: 'Brain dump: write every worry on paper to get it out of your head.' },
    { icon: '⏸️', text: 'Give yourself permission to pause. One thing at a time.' },
  ]
};

const calm = [
  'Take 5 slow deep breaths — in for 4, out for 6.',
  'Drink a full glass of water right now.',
  'Step outside for 5 minutes of fresh air.',
  'Put on one calm song and just listen.',
  'Stretch your neck and shoulders gently.',
  'Write down one thing going okay today.',
  'Rest your eyes — close them for 60 seconds.',
  'Give yourself permission to pause.',
  'Splash cold water on your face.',
  'Put your phone down for 10 minutes.'
];

const patterns = {
  '478':   { phases: ['Inhale','Hold','Exhale'],        times: [4,7,8],   tip: '4-7-8 breathing calms the nervous system. Great for anxiety or before sleep.' },
  'box':   { phases: ['Inhale','Hold','Exhale','Hold'], times: [4,4,4,4], tip: 'Box breathing: equal counts all around. Used to stay calm under pressure.' },
  'simple':{ phases: ['Inhale','Exhale'],               times: [4,4],     tip: "Simple and easy. Perfect if you're new to breathing exercises." }
};

const badges = [
  { id: 'first',    icon: '🌱', label: 'First Step',    desc: 'Log your first mood',          check: (e,f,s) => e.length >= 1 },
  { id: 'streak3',  icon: '🔥', label: '3-Day Streak',  desc: '3 days in a row',              check: (e,f,s) => s >= 3 },
  { id: 'streak7',  icon: '🌟', label: 'Week Warrior',  desc: '7 days in a row',              check: (e,f,s) => s >= 7 },
  { id: 'log10',    icon: '📒', label: 'Journaler',     desc: '10 total check-ins',           check: (e,f,s) => e.length >= 10 },
  { id: 'focus5',   icon: '🎯', label: 'Focused',       desc: '5 completed focus sessions',   check: (e,f,s) => f.filter(x=>x.completed).length >= 5 },
  { id: 'breathe',  icon: '💨', label: 'Breath Taker',  desc: 'Open the Breathe tab',         check: (e,f,s) => localStorage.getItem('ssms7_breathed') === '1' },
  { id: 'positive', icon: '☀️', label: 'Sunny Spell',   desc: '5 positive moods in a row',    check: (e,f,s) => checkPositiveStreak(e, 5) },
];

function checkPositiveStreak(entries, n) {
  const last = entries.slice(-n);
  return last.length >= n && last.every(e => moodInfo[e.mood]?.group === 'positive');
}

// ─── State ──────────────────────────────────────────────────
let entries       = JSON.parse(localStorage.getItem('ssms7_e')     || '[]');
let profile       = JSON.parse(localStorage.getItem('ssms7_p')     || 'null');
let focusSessions = JSON.parse(localStorage.getItem('ssms7_focus') || '[]');

let currentMood      = null;
let currentIntensity = 2;
let moodChart        = null;
let calYear          = new Date().getFullYear();
let calMonth         = new Date().getMonth();
let selectedAv       = '🌸';
let editAv           = null;
let currentPattern   = '478';
let breatheRunning   = false;
let breatheTimer     = null;
let breathePhaseIdx  = 0;
let breatheCycles    = 0;
let focusTimer       = null;
let focusRunning     = false;
let focusSeconds     = 0;
let focusTopic       = '';
let activeSound      = null;
let audioCtx         = null;
let soundNodes       = {};
let soundVolume      = 0.5;

// ─── Init ──────────────────────────────────────────────────
function init() {
  // Apply saved theme
  const savedTheme = localStorage.getItem('ssms7_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('theme-toggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  if (profile) showMainApp();
  else {
    document.getElementById('setup-screen').style.display = 'flex';
    document.getElementById('main-app').style.display     = 'none';
  }
}

// ─── Theme ──────────────────────────────────────────────────
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ssms7_theme', next);
  document.getElementById('theme-toggle').textContent = next === 'dark' ? '☀️' : '🌙';
}

// ─── Setup ──────────────────────────────────────────────────
function selectAv(el, av) {
  document.querySelectorAll('#avatar-row .av-btn').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
  selectedAv = av;
}

function selectEditAv(el, av) {
  document.querySelectorAll('#profile-avatar-row .av-btn').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
  editAv = av;
}

function saveProfile() {
  const name = document.getElementById('setup-name').value.trim() || 'Friend';
  profile = { name, avatar: selectedAv, since: Date.now() };
  localStorage.setItem('ssms7_p', JSON.stringify(profile));
  showMainApp();
}

function showMainApp() {
  document.getElementById('setup-screen').style.display = 'none';
  document.getElementById('main-app').style.display     = 'block';
  applyProfile();
  updateStreaks();
  const idx = new Date().getDate() % quotes.length;
  document.getElementById('quote-text').textContent   = quotes[idx].text;
  document.getElementById('quote-author').textContent = '— ' + quotes[idx].author;
}

function applyProfile() {
  if (!profile) return;
  const hr = new Date().getHours();
  const g  = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('hero-greeting').textContent   = g + ', ' + profile.name + '!';
  document.getElementById('hero-avatar').textContent     = profile.avatar;
  document.getElementById('profile-avatar').textContent  = profile.avatar;
  document.getElementById('profile-name').textContent    = profile.name;
  const since = new Date(profile.since);
  document.getElementById('profile-since').textContent   =
    'Member since ' + since.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  document.querySelectorAll('#profile-avatar-row .av-btn').forEach(b =>
    b.classList.toggle('sel', b.textContent === profile.avatar));
  editAv = profile.avatar;
}

function updateProfile() {
  const name = document.getElementById('edit-name').value.trim();
  if (name)  profile.name   = name;
  if (editAv) profile.avatar = editAv;
  localStorage.setItem('ssms7_p', JSON.stringify(profile));
  applyProfile();
  document.getElementById('edit-name').value = '';
}

function resetAll() {
  if (confirm('Reset all data? This cannot be undone.')) {
    ['ssms7_e','ssms7_p','ssms7_focus','ssms7_breathed','ssms7_theme'].forEach(k => localStorage.removeItem(k));
    location.reload();
  }
}

// ─── Streaks ──────────────────────────────────────────────────
function updateStreaks() {
  document.getElementById('total-num').textContent = entries.length;
  const s = calcStreak();
  document.getElementById('streak-num').textContent = s;
  document.getElementById('p-total').textContent    = entries.length;
  document.getElementById('p-streak').textContent   = s;
  const pos = entries.filter(e => moodInfo[e.mood]?.group === 'positive').length;
  document.getElementById('p-happy').textContent =
    entries.length ? Math.round(pos / entries.length * 100) + '%' : '0%';
  const completedFocus = focusSessions.filter(s => s.completed).length;
  document.getElementById('p-focus').textContent = completedFocus;
  renderBadges();
}

function calcStreak() {
  if (!entries.length) return 0;
  const today = new Date(); today.setHours(0,0,0,0);
  const days  = [...new Set(entries.map(e => new Date(e.ts).toDateString()))]
    .map(d => new Date(d)).sort((a,b) => b - a);
  let cur = 0;
  for (let i = 0; i < days.length; i++) {
    const d   = new Date(days[i]); d.setHours(0,0,0,0);
    const exp = new Date(today);   exp.setDate(today.getDate() - i);
    if (d.getTime() === exp.getTime()) cur++;
    else break;
  }
  return cur;
}

// ─── Badges ──────────────────────────────────────────────────
function renderBadges() {
  const s = calcStreak();
  const el = document.getElementById('badges-row');
  if (!el) return;
  el.innerHTML = badges.map(b => {
    const earned = b.check(entries, focusSessions, s);
    return `<div class="badge-item ${earned ? 'earned' : 'locked'}" title="${b.desc}">
      <div class="badge-icon">${earned ? b.icon : '🔒'}</div>
      <div class="badge-lbl">${b.label}</div>
    </div>`;
  }).join('');
}

// ─── Tabs ──────────────────────────────────────────────────
function showTab(id, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  el.classList.add('active');
  if (id === 'calendar') { renderCalendar(); }
  if (id === 'report')   { renderReport(); }
  if (id === 'profile')  { applyProfile(); updateStreaks(); }
  if (id === 'focus')    renderFocusSessions();
  if (id === 'checkin')  renderHistory();
  if (id === 'breathe')  { localStorage.setItem('ssms7_breathed', '1'); }
}

// ─── Mood Check-in ──────────────────────────────────────────────────
function selectMood(mood, el) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  currentMood = mood;
  // Show intensity slider
  document.getElementById('intensity-wrap').style.display = 'block';
}

function updateIntensity(val) {
  currentIntensity = parseInt(val);
  const labels = { 1: 'Low', 2: 'Medium', 3: 'High' };
  document.getElementById('intensity-val').textContent = labels[val];
}

function logMood() {
  if (!currentMood) {
    showFeedback('<div class="alert alert-warn"><div class="alert-title">Please select a mood first 😊</div></div>');
    return;
  }
  const note = document.getElementById('note').value.trim();
  entries.push({ mood: currentMood, intensity: currentIntensity, note, ts: Date.now(), hour: new Date().getHours() });
  try { localStorage.setItem('ssms7_e', JSON.stringify(entries)); } catch(e) {}
  updateStreaks();
  renderHistory();

  // Check for streak milestone
  const streak = calcStreak();
  let feedbackHtml = '';

  if (streak > 0 && streak % 7 === 0) {
    feedbackHtml = `<div class="alert alert-calm">
      <div class="alert-title">🎉 ${streak}-day streak! You're showing up for yourself.</div>
    </div>`;
  } else if (moodInfo[currentMood]?.group === 'positive') {
    feedbackHtml = `<div class="alert alert-calm">
      <div class="alert-title">Logged ✓</div>
      <div style="font-size:13px; margin-top:3px;">Great to hear — keep it going! 🌟</div>
    </div>`;
  } else {
    feedbackHtml = `<div class="alert alert-warn">
      <div class="alert-title">Logged ✓</div>
      <div style="font-size:13px; margin-top:3px;">Thanks for checking in. Here are some gentle ideas 💜</div>
    </div>`;
  }

  showFeedback(feedbackHtml);
  showMoodSuggestions(currentMood);

  document.getElementById('note').value = '';
  document.getElementById('intensity-wrap').style.display = 'none';
  document.getElementById('intensity-slider').value = 2;
  document.getElementById('intensity-val').textContent = 'Medium';
  currentIntensity = 2;
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  currentMood = null;
}

function showMoodSuggestions(mood) {
  const group = moodInfo[mood]?.group || 'neutral';
  const pool = moodSuggestions[group] || moodSuggestions.neutral;
  const picked = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
  const card = document.getElementById('suggestions-card');
  const list = document.getElementById('suggestions-list');
  list.innerHTML = picked.map(s =>
    `<div class="sugg-item">
      <span class="sugg-item-icon">${s.icon}</span>
      <span class="sugg-item-text">${s.text}</span>
    </div>`
  ).join('');

  // Add breathe quick link for stress/low moods
  if (group === 'stress' || group === 'low') {
    list.innerHTML += `<button class="breathe-quick-btn" onclick="goToBreathe()">💨 Try a breathing exercise →</button>`;
  }

  card.style.display = 'block';
}

function goToBreathe() {
  showTab('breathe', document.querySelectorAll('.tab')[1]);
  window.scrollTo(0, 0);
}

function pickN(arr, n) { return [...arr].sort(() => Math.random() - 0.5).slice(0, n); }
function showFeedback(html) { document.getElementById('feedback').innerHTML = html; }

// ─── History ──────────────────────────────────────────────────
function renderHistory() {
  const el = document.getElementById('history-list');
  if (!entries.length) { el.innerHTML = '<div class="empty">No entries yet. Log your first mood!</div>'; return; }
  const intensityLabel = { 1: '·', 2: '··', 3: '···' };
  el.innerHTML = [...entries].reverse().slice(0, 8).map(e => {
    const m = moodInfo[e.mood] || { emoji: '😐', label: e.mood, badge: 'bp' };
    const intStr = e.intensity ? `<span class="int-dots">${intensityLabel[e.intensity] || ''}</span>` : '';
    return `<div class="hrow">
      <div class="hemoji">${m.emoji}</div>
      <div class="hinfo">
        <div class="hlabel">${m.label}${intStr}<span class="badge ${m.badge}">${m.label}</span></div>
        ${e.note ? `<div class="hnote">${e.note}</div>` : ''}
      </div>
      <div class="htime">${timeAgo(e.ts)}</div>
    </div>`;
  }).join('');
}

// ─── Breathing ──────────────────────────────────────────────────
function setPattern(key, el) {
  document.querySelectorAll('.pat-btn').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
  currentPattern = key;
  resetBreathe();
  document.getElementById('breathe-tip').textContent = patterns[key].tip;
}

function toggleBreathe() { breatheRunning ? pauseBreathe() : startBreathe(); }

function startBreathe() {
  breatheRunning = true;
  document.getElementById('start-btn').textContent = 'Pause';
  runPhase();
}

function pauseBreathe() {
  breatheRunning = false;
  clearTimeout(breatheTimer);
  document.getElementById('start-btn').textContent = 'Resume';
}

function resetBreathe() {
  breatheRunning = false;
  clearTimeout(breatheTimer);
  breathePhaseIdx = 0;
  breatheCycles   = 0;
  const c = document.getElementById('breathe-circle');
  c.style.transition = 'none';
  c.style.width = c.style.height = '95px';
  document.getElementById('breathe-label').innerHTML  = 'Press<br>Start';
  document.getElementById('breathe-phase').textContent   = '';
  document.getElementById('breathe-counter').textContent = '';
  document.getElementById('start-btn').textContent = 'Start';
}

function runPhase() {
  if (!breatheRunning) return;
  const p     = patterns[currentPattern];
  const phase = p.phases[breathePhaseIdx];
  const dur   = p.times[breathePhaseIdx];
  const c     = document.getElementById('breathe-circle');
  const lbl   = document.getElementById('breathe-label');

  document.getElementById('breathe-counter').textContent = 'Cycle ' + (breatheCycles + 1);

  if (phase === 'Inhale') {
    c.style.transition = `width ${dur}s linear, height ${dur}s linear`;
    c.style.width = c.style.height = '140px';
    lbl.textContent = 'Inhale';
  } else if (phase === 'Exhale') {
    c.style.transition = `width ${dur}s linear, height ${dur}s linear`;
    c.style.width = c.style.height = '70px';
    lbl.textContent = 'Exhale';
  } else {
    c.style.transition = 'none';
    lbl.textContent = 'Hold';
  }

  let rem = dur;
  const tick = () => {
    if (!breatheRunning) return;
    document.getElementById('breathe-phase').textContent = phase + ' — ' + rem;
    rem--;
    if (rem > 0) {
      breatheTimer = setTimeout(tick, 1000);
    } else {
      breathePhaseIdx++;
      if (breathePhaseIdx >= p.phases.length) {
        breathePhaseIdx = 0;
        breatheCycles++;
      }
      breatheTimer = setTimeout(runPhase, 400);
    }
  };
  tick();
}

// ─── Sound Therapy ──────────────────────────────────────────────────
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function createNoise(type) {
  const ctx = getAudioCtx();
  const bufferSize = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gainNode = ctx.createGain();
  gainNode.gain.value = soundVolume * 0.3;

  let filter;
  if (type === 'rain') {
    filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    filter.Q.value = 0.5;
    source.connect(filter);
    filter.connect(gainNode);
  } else if (type === 'forest') {
    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    source.connect(filter);
    filter.connect(gainNode);
  } else if (type === 'waves') {
    // LFO for wave oscillation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 0.4;
    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);
    lfo.start();
    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    source.connect(filter);
    filter.connect(gainNode);
  } else if (type === 'wind') {
    filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 1.5;
    source.connect(filter);
    filter.connect(gainNode);
  } else {
    source.connect(gainNode);
  }

  gainNode.connect(ctx.destination);
  source.start();
  return { source, gainNode };
}

function toggleSound(type, btn) {
  if (activeSound === type) {
    // Stop
    if (soundNodes[type]) {
      soundNodes[type].gainNode.gain.setTargetAtTime(0, getAudioCtx().currentTime, 0.1);
      setTimeout(() => { if (soundNodes[type]) { soundNodes[type].source.stop(); soundNodes[type] = null; } }, 500);
    }
    activeSound = null;
    document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('playing'));
  } else {
    // Stop previous
    if (activeSound && soundNodes[activeSound]) {
      soundNodes[activeSound].gainNode.gain.setTargetAtTime(0, getAudioCtx().currentTime, 0.1);
      setTimeout(() => { if (soundNodes[activeSound]) { soundNodes[activeSound].source.stop(); soundNodes[activeSound] = null; } }, 500);
    }
    document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('playing'));
    // Play new
    try {
      soundNodes[type] = createNoise(type);
      activeSound = type;
      btn.classList.add('playing');
    } catch(e) {
      console.log('Audio error', e);
    }
  }
}

function updateVolume(val) {
  soundVolume = val / 100;
  if (activeSound && soundNodes[activeSound]) {
    soundNodes[activeSound].gainNode.gain.setTargetAtTime(soundVolume * 0.3, getAudioCtx().currentTime, 0.05);
  }
}

// ─── Focus / Screen Time ──────────────────────────────────────────────────
function startFocus() {
  const topic = document.getElementById('focus-topic').value.trim() || 'Study Session';
  const mins  = parseInt(document.getElementById('focus-duration').value);
  focusTopic   = topic;
  focusSeconds = mins * 60;
  document.getElementById('focus-timer-card').style.display = 'block';
  document.getElementById('timer-topic-display').textContent = topic;
  document.getElementById('focus-start-btn').style.display  = 'none';
  updateTimerDisplay();
  focusRunning = true;
  focusTimer   = setInterval(tickFocus, 1000);
}

function tickFocus() {
  if (!focusRunning) return;
  focusSeconds--;
  updateTimerDisplay();
  if (focusSeconds <= 0) { clearInterval(focusTimer); completeFocus(); }
}

function updateTimerDisplay() {
  const m = Math.floor(focusSeconds / 60);
  const s = focusSeconds % 60;
  document.getElementById('timer-display').textContent =
    String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}

function toggleFocus() {
  focusRunning = !focusRunning;
  document.getElementById('timer-pause-btn').textContent = focusRunning ? 'Pause' : 'Resume';
}

function stopFocus() {
  clearInterval(focusTimer);
  const elapsed = parseInt(document.getElementById('focus-duration').value) * 60 - focusSeconds;
  if (elapsed > 60) saveFocusSession(Math.floor(elapsed / 60), false);
  document.getElementById('focus-timer-card').style.display = 'none';
  document.getElementById('focus-start-btn').style.display  = 'block';
  focusRunning = false;
  renderFocusSessions();
}

function completeFocus() {
  clearInterval(focusTimer);
  const mins = parseInt(document.getElementById('focus-duration').value);
  saveFocusSession(mins, true);
  document.getElementById('focus-timer-card').style.display = 'none';
  document.getElementById('focus-start-btn').style.display  = 'block';
  renderFocusSessions();
  updateStreaks();
  alert('🎉 Great work! Focus session complete!');
}

function saveFocusSession(mins, completed) {
  const today = new Date().toDateString();
  focusSessions.push({ topic: focusTopic, mins, completed, ts: Date.now(), date: today });
  try { localStorage.setItem('ssms7_focus', JSON.stringify(focusSessions)); } catch(e) {}
}

function renderFocusSessions() {
  const today = new Date().toDateString();
  const ts    = focusSessions.filter(s => s.date === today);
  const el    = document.getElementById('focus-sessions');
  el.innerHTML = ts.length
    ? ts.map(s => `
        <div class="session-row">
          <span>${s.completed ? '✅' : '⏹️'}</span>
          <span style="flex:1; color:#26215C; font-weight:500;">${s.topic} — ${s.mins} min</span>
        </div>`).join('')
    : '<div class="empty">No sessions yet today.</div>';
  const goal = parseInt(document.getElementById('focus-goal').value);
  const done = ts.filter(s => s.completed).length;
  document.getElementById('focus-goal-progress').textContent =
    done >= goal ? '🎉 Daily goal complete!' : `Daily goal: ${done}/${goal} sessions`;
}

// ─── Report ──────────────────────────────────────────────────
function renderReport() {
  const now  = Date.now();
  const week = entries.filter(e => now - e.ts < 7 * 86400000);
  const c    = {};
  Object.keys(moodInfo).forEach(k => c[k] = 0);
  week.forEach(e => { if (c[e.mood] !== undefined) c[e.mood]++; });
  const total = week.length;

  const stressed = (c.stressed||0) + (c.anxious||0) + (c.frustrated||0) + (c.overwhelmed||0);
  const positive = (c.happy||0) + (c.excited||0) + (c.calm||0) + (c.grateful||0) + (c.hopeful||0);

  document.getElementById('r-total').textContent  = total;
  document.getElementById('r-stress').textContent = stressed;
  document.getElementById('r-happy').textContent  = positive;

  const ins = document.getElementById('insight');
  if (!total)
    ins.textContent = 'Log a few moods to see your insight here.';
  else if (stressed >= 4)
    ins.textContent = "You've been under a lot of stress lately. Even a 5-minute break can reset your nervous system. You're doing the right thing by tracking this 💙";
  else if ((c.tired||0) + (c.lonely||0) >= 3)
    ins.textContent = "Fatigue and low energy have been showing up. Protect your sleep and reach out to someone 🌙";
  else if (positive >= stressed + (c.tired||0))
    ins.textContent = "This has been a positive week overall. Keep it up! 🌟";
  else
    ins.textContent = "Your mood has been mixed this week. That's perfectly normal. Keep checking in 💜";

  if (moodChart) { moodChart.destroy(); moodChart = null; }
  const colors = {
    happy:'#1D9E75', excited:'#16B07A', calm:'#38BFA1', grateful:'#52C9A1', hopeful:'#86D9BB',
    neutral:'#7F77DD',
    lonely:'#BA7517', tired:'#D48F1A',
    anxious:'#E06540', stressed:'#D85A30', frustrated:'#C44520', overwhelmed:'#B83010'
  };

  const activeKeys = Object.keys(moodInfo).filter(k => c[k] > 0);

  if (total > 0) {
    moodChart = new Chart(document.getElementById('moodChart'), {
      type: 'doughnut',
      data: {
        labels: activeKeys.map(k => moodInfo[k].label),
        datasets: [{ data: activeKeys.map(k => c[k]), backgroundColor: activeKeys.map(k => colors[k] || '#7F77DD'), borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: { legend: { display:false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}` } } }
      }
    });
    document.getElementById('chart-legend').innerHTML = activeKeys
      .map(k => `<div class="li"><div class="ls" style="background:${colors[k]||'#7F77DD'}"></div><span>${moodInfo[k].label} ${c[k]}</span></div>`)
      .join('');
  }

  renderHeatmap(week);
}

function renderHeatmap(week) {
  const wrap = document.getElementById('heatmap-wrap');
  if (!wrap) return;
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today = new Date(); today.setHours(0,0,0,0);

  // Build 7-day map
  const dayMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dayMap[d.toDateString()] = { entries: [], label: dayNames[d.getDay()], date: d };
  }
  week.forEach(e => {
    const k = new Date(e.ts).toDateString();
    if (dayMap[k]) dayMap[k].entries.push(e.mood);
  });

  const groupColors = { positive: '#1D9E75', neutral: '#7F77DD', low: '#BA7517', stress: '#D85A30' };

  wrap.innerHTML = `<div class="heatmap-row">` + Object.values(dayMap).map(d => {
    const dominant = getDominantGroup(d.entries);
    const bg = dominant ? groupColors[dominant] : 'rgba(175,169,236,0.15)';
    const count = d.entries.length;
    return `<div class="heatmap-cell" style="background:${bg}; opacity:${count > 0 ? 0.3 + Math.min(count,5)*0.14 : 1}">
      <div class="heatmap-day">${d.label}</div>
      <div class="heatmap-count">${count > 0 ? count : ''}</div>
    </div>`;
  }).join('') + `</div>
  <div class="heatmap-legend">
    <div class="hl-i"><div class="hl-s" style="background:#1D9E75"></div>Positive</div>
    <div class="hl-i"><div class="hl-s" style="background:#7F77DD"></div>Neutral</div>
    <div class="hl-i"><div class="hl-s" style="background:#BA7517"></div>Low</div>
    <div class="hl-i"><div class="hl-s" style="background:#D85A30"></div>Stressed</div>
  </div>`;
}

function getDominantGroup(moods) {
  if (!moods.length) return null;
  const counts = {};
  moods.forEach(m => {
    const g = moodInfo[m]?.group || 'neutral';
    counts[g] = (counts[g] || 0) + 1;
  });
  return Object.entries(counts).sort((a,b) => b[1] - a[1])[0][0];
}

// ─── Calendar ──────────────────────────────────────────────────
function renderCalendar() {
  document.getElementById('cal-month-label').textContent =
    new Date(calYear, calMonth).toLocaleDateString('en-US', { month:'long', year:'numeric' });

  const today       = new Date(); today.setHours(0,0,0,0);
  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const dayMap      = {};

  entries.forEach(e => {
    const d = new Date(e.ts);
    if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
      const k = d.getDate();
      if (!dayMap[k]) dayMap[k] = [];
      dayMap[k].push(e);
    }
  });

  const pr = { stress: 4, low: 3, neutral: 2, positive: 1 };
  const domGroup = list => {
    const g = getDominantGroup(list.map(e => e.mood));
    return g;
  };

  // Map group to class
  const groupClass = { positive: 'cd-happy', neutral: 'cd-neutral', stress: 'cd-stressed', low: 'cd-tired' };

  let cells = '';
  for (let i = 0; i < firstDay; i++) cells += '<div class="cal-day cd-empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const date    = new Date(calYear, calMonth, d); date.setHours(0,0,0,0);
    const isToday  = date.getTime() === today.getTime();
    const isFuture = date > today;
    const group = isFuture || !dayMap[d] ? null : domGroup(dayMap[d]);
    const cls = isFuture ? 'cd-empty' : group ? groupClass[group] : 'cd-none';
    const count = dayMap[d] ? dayMap[d].length : 0;
    cells += `<div class="cal-day ${cls}${isToday ? ' cd-today' : ''}" 
      ${!isFuture && dayMap[d] ? `onclick="showDayDetail(${d}, '${date.toDateString()}')"` : ''} 
      title="${!isFuture && count ? count + ' log(s)' : ''}">${isFuture ? '' : d}</div>`;
  }
  document.getElementById('cal-grid').innerHTML = cells;
}

function showDayDetail(day, dateStr) {
  const card = document.getElementById('day-detail-card');
  const content = document.getElementById('day-detail-content');
  const title = document.getElementById('day-detail-title');

  const dayEntries = entries.filter(e => new Date(e.ts).toDateString() === dateStr);
  title.textContent = new Date(dateStr).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  if (!dayEntries.length) {
    content.innerHTML = '<div class="empty">No logs for this day.</div>';
  } else {
    const intensityLabel = { 1: 'Low', 2: 'Medium', 3: 'High' };
    content.innerHTML = dayEntries.map(e => {
      const m = moodInfo[e.mood] || { emoji: '😐', label: e.mood };
      const time = new Date(e.ts).toLocaleTimeString('en-US', { hour: 'numeric', minute:'2-digit' });
      return `<div class="detail-row">
        <span class="detail-emoji">${m.emoji}</span>
        <div class="detail-info">
          <div class="detail-mood">${m.label}${e.intensity ? ` · ${intensityLabel[e.intensity] || ''} intensity` : ''}</div>
          ${e.note ? `<div class="hnote">${e.note}</div>` : ''}
          <div class="htime">${time}</div>
        </div>
      </div>`;
    }).join('');
  }

  card.style.display = 'block';
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  document.getElementById('day-detail-card').style.display = 'none';
  renderCalendar();
}

// ─── Helpers ──────────────────────────────────────────────────
function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

// ─── Start ──────────────────────────────────────────────────
init();