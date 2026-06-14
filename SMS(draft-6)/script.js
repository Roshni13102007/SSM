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

// Extended mood info — positive / neutral / difficult categories
const moodInfo = {
  happy:       { emoji: '😊', label: 'Happy',       badge: 'bc', cat: 'positive' },
  excited:     { emoji: '🤩', label: 'Excited',     badge: 'bc', cat: 'positive' },
  calm:        { emoji: '😌', label: 'Calm',         badge: 'bc', cat: 'positive' },
  grateful:    { emoji: '🙏', label: 'Grateful',    badge: 'bc', cat: 'positive' },
  neutral:     { emoji: '😐', label: 'Neutral',     badge: 'bp', cat: 'neutral'  },
  depressed:   { emoji: '😔', label: 'Depressed',   badge: 'bs', cat: 'difficult'},
  anxious:     { emoji: '😰', label: 'Anxious',     badge: 'bs', cat: 'difficult'},
  stressed:    { emoji: '😞', label: 'Stressed',    badge: 'bs', cat: 'difficult'},
  overwhelmed: { emoji: '🤯', label: 'Overwhelmed', badge: 'bs', cat: 'difficult'},
  frustrated:  { emoji: '😤', label: 'Frustrated',  badge: 'bs', cat: 'difficult'},
  lonely:      { emoji: '🥺', label: 'Lonely',      badge: 'bw', cat: 'difficult'},
  tired:       { emoji: '😴', label: 'Tired',       badge: 'bw', cat: 'tired'   }
};

const POSITIVE_MOODS  = ['happy','excited','calm','grateful'];
const DIFFICULT_MOODS = ['depressed','anxious','stressed','overwhelmed','frustrated','lonely'];

// Mood-specific suggestions
const suggestions = {
  depressed: [
    'Get out of bed and sit by a window for 5 minutes.',
    'Take a slow walk, even if it is only around your room.',
    'Drink a glass of water and take three deep breaths.',
    'Listen to one song that usually comforts you.',
    'Text one person a simple "Hi".',
    'Take a shower or wash your face gently.',
    'Write down one thing you survived today.',
    'Open the curtains and let some light in.',
    'Eat something nourishing, even a small snack.',
    'Remind yourself: difficult feelings can change with time.',
    'Do one tiny task, then stop if you need to.',
    'Be kind to yourself today — getting through the day counts.'
  ],
  stressed: [
    'Take 5 slow deep breaths — in for 4, out for 6.',
    'Step outside for 5 minutes of fresh air.',
    'Write down what\'s weighing on you — then close the notebook.',
    'Stretch your neck and shoulders gently.',
    'Put on one calm song and just listen.',
    'Give yourself permission to pause for 5 minutes.',
    'Make a cup of tea or your favorite drink.',
    'Spend 2 minutes focusing only on your breathing.',
    'Look outside and notice five things around you.',
    'Slowly unclench your jaw and relax your shoulders.',
    'Take a short break from notifications.'
  ],
  anxious: [
    'Try the 5-4-3-2-1 grounding: name 5 things you can see right now.',
    'Place both feet flat on the floor and take 3 slow breaths.',
    'Write your worry down, then write one small thing you can control.',
    'Splash cold water on your face.',
    'Reach out to one person you trust.',
    'Breathe: in for 4, hold for 4, out for 6.',
    // FIX: "clamming" typo corrected to "calming", added space after comma
    'Name 3 things you can hear right now, try calming down.',
    'Hold something cold and focus on its texture.',
    'Remind yourself that thoughts are not always facts.',
    'Take one slow breath and count to 10.',
    'Focus only on the next 10 minutes.',
    // FIX: "Speak to you parents" corrected to "Speak to someone you trust"
    'Speak to someone you trust.'
  ],
  overwhelmed: [
    'Pick just ONE thing to do next. Just one.',
    'Take a 10-minute break — set a timer.',
    'Write down everything in your head, then pick the top priority.',
    'Step away from screens for 5 minutes.',
    'Drink a full glass of water right now.',
    'Remind yourself: you don\'t have to do everything today.',
    'Choose the easiest task and complete it first.',
    'Clear one small area of your workspace.',
    'Write a simple to-do list with only 3 items.',
    'Set a timer for 5 minutes and start.',
    'Give yourself permission to leave some tasks for tomorrow.'
  ],
  frustrated: [
    'Take 3 big exhales — longer than your inhale.',
    'Go for a short walk if you can.',
    'Write down what frustrated you, without judgment.',
    'Splash cold water on your face and wrists.',
    'Listen to a song that matches your mood, then a calmer one.'
  ],
  lonely: [
    'Reach out to one person — even just a short message.',
    'Do something kind for yourself right now.',
    'Step outside briefly, even just to the doorstep.',
    'Write about what connection means to you today.',
    'Remember: this feeling is temporary and valid.',
    'Watch a comforting movie or video.',
    'Call a family member or friend.',
    'Spend time with a pet if possible.',
    'Join an online community you enjoy.',
    'Write a letter to your future self.'
  ],
  tired: [
    'Rest your eyes — close them for 60 seconds.',
    'Drink a full glass of water right now.',
    'Protect your sleep time tonight.',
    'Give yourself permission to do less today.',
    'Take a 10-minute rest without guilt.',
    'Stand up and stretch for 2 minutes.',
    'Rest your eyes away from screens.',
    'Take a short power nap if possible.',
    'Have a healthy snack.',
    'Slow down and focus on one task at a time.'
  ],
  _default: [
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
  ]
};

const patterns = {
  '478':   { phases: ['Inhale','Hold','Exhale'],        times: [4,7,8],   tip: '4-7-8 breathing calms the nervous system. Great for anxiety or before sleep.' },
  'box':   { phases: ['Inhale','Hold','Exhale','Hold'], times: [4,4,4,4], tip: 'Box breathing: equal counts all around. Used to stay calm under pressure.' },
  'simple':{ phases: ['Inhale','Exhale'],               times: [4,4],     tip: "Simple and easy. Perfect if you're new to breathing exercises." }
};

// Badges definition
const BADGES = [
  { id:'first',    label:'First step',       emoji:'🌱', desc:'Logged your first mood',          check: (e,f) => e.length >= 1 },
  { id:'streak3',  label:'3-day streak',     emoji:'🔥', desc:'3 days in a row',                 check: (e,f) => calcStreak() >= 3 },
  { id:'streak7',  label:'Week warrior',     emoji:'🏆', desc:'7-day streak',                    check: (e,f) => calcStreak() >= 7 },
  { id:'logs10',   label:'Regular',          emoji:'⭐', desc:'10 check-ins logged',             check: (e,f) => e.length >= 10 },
  { id:'logs30',   label:'Committed',        emoji:'💜', desc:'30 check-ins logged',             check: (e,f) => e.length >= 30 },
  { id:'focus5',   label:'Focus hero',       emoji:'🎯', desc:'5 completed focus sessions',      check: (e,f) => f.filter(s=>s.completed).length >= 5 },
  { id:'positive', label:'Good vibes',       emoji:'😊', desc:'Logged 5 positive moods',         check: (e,f) => e.filter(x=>POSITIVE_MOODS.includes(x.mood)).length >= 5 },
  { id:'calm',     label:'Inner peace',      emoji:'🧘', desc:'Logged Calm 3 times',             check: (e,f) => e.filter(x=>x.mood==='calm').length >= 3 },
];

// ─── State ──────────────────────────────────────────────────
let entries       = JSON.parse(localStorage.getItem('ssms7_e')     || '[]');
let profile       = JSON.parse(localStorage.getItem('ssms7_p')     || 'null');
let focusSessions = JSON.parse(localStorage.getItem('ssms7_focus') || '[]');
let darkMode      = localStorage.getItem('ssms7_dark') === '1';

let currentMood      = null;
let currentIntensity = 2; // 1=Low 2=Medium 3=High
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

// ─── Sound Engine ──────────────────────────────────────────────────
let audioCtx = null;
let activeSound = null;
let activeSoundKey = null;
let soundGain = null;
let soundVolume = 0.4;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

const soundGenerators = {
  rain:   buildRain,
  forest: buildForest,
  waves:  buildWaves,
  fire:   buildFire,
  cafe:   buildCafe,
  wind:   buildWind
};

function buildRain(ctx, dest) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  const filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 1200; filter.Q.value = 0.5;
  const filter2 = ctx.createBiquadFilter(); filter2.type = 'lowpass'; filter2.frequency.value = 3000;
  src.connect(filter); filter.connect(filter2); filter2.connect(dest);
  src.start(); return src;
}

function buildForest(ctx, dest) {
  const nodes = [];
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator(); osc.type = 'sine';
    osc.frequency.value = 300 + i * 80 + Math.random() * 60;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.15 + Math.random() * 0.2;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 30;
    lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
    const g = ctx.createGain(); g.gain.value = 0.06;
    osc.connect(g); g.connect(dest);
    osc.start(); lfo.start(); nodes.push(osc, lfo);
  }
  // white noise for leaves
  const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.15;
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2000;
  src.connect(f); f.connect(dest); src.start(); nodes.push(src);
  return { stop: () => nodes.forEach(n => { try { n.stop(); } catch(e){} }) };
}

function buildWaves(ctx, dest) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / ctx.sampleRate;
    const wave = Math.sin(2 * Math.PI * 0.12 * t) * 0.5 + 0.5;
    data[i] = (Math.random() * 2 - 1) * wave * 0.5;
  }
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 800;
  src.connect(f); f.connect(dest); src.start(); return src;
}

function buildFire(ctx, dest) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  const f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 200; f1.Q.value = 0.8;
  const f2 = ctx.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = 400;
  src.connect(f1); f1.connect(f2); f2.connect(dest); src.start(); return src;
}

function buildCafe(ctx, dest) {
  const nodes = [];
  // low hum of voices — filtered noise layers
  for (let i = 0; i < 4; i++) {
    const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let j = 0; j < d.length; j++) d[j] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass';
    f.frequency.value = 200 + i * 150; f.Q.value = 2;
    const g = ctx.createGain(); g.gain.value = 0.07;
    src.connect(f); f.connect(g); g.connect(dest); src.start(); nodes.push(src);
  }
  return { stop: () => nodes.forEach(n => { try { n.stop(); } catch(e){} }) };
}

function buildWind(ctx, dest) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / ctx.sampleRate;
    data[i] = (Math.random() * 2 - 1) * (0.3 + 0.2 * Math.sin(2 * Math.PI * 0.08 * t));
  }
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 600; f.Q.value = 0.4;
  src.connect(f); f.connect(dest); src.start(); return src;
}

function toggleSound(key, btn) {
  if (activeSoundKey === key) { stopAllSounds(); return; }
  stopAllSounds();
  const ctx = getAudioCtx();
  soundGain = ctx.createGain();
  soundGain.gain.value = soundVolume;
  soundGain.connect(ctx.destination);
  activeSound = soundGenerators[key](ctx, soundGain);
  activeSoundKey = key;
  document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('sound-vol-row').style.display = 'flex';
}

function stopAllSounds() {
  if (activeSound) {
    try {
      if (typeof activeSound.stop === 'function') activeSound.stop();
      else if (activeSound.stop) activeSound.stop();
    } catch(e) {}
    if (activeSound.stop && typeof activeSound.stop !== 'function') {
      try { activeSound.stop.call(activeSound); } catch(e){}
    }
  }
  activeSound = null; activeSoundKey = null;
  document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sound-vol-row').style.display = 'none';
}

function setSoundVolume(v) {
  soundVolume = parseFloat(v);
  if (soundGain) soundGain.gain.value = soundVolume;
}

// ─── Init ──────────────────────────────────────────────────
function init() {
  applyTheme();
  if (profile) showMainApp();
  else {
    document.getElementById('setup-screen').style.display = 'flex';
    document.getElementById('main-app').style.display     = 'none';
  }
}

// ─── Theme ──────────────────────────────────────────────────
function applyTheme() {
  document.body.classList.toggle('dark', darkMode);
  document.getElementById('theme-toggle') && (
    document.getElementById('theme-toggle').textContent = darkMode ? '☀️' : '🌙'
  );
}

function toggleTheme() {
  darkMode = !darkMode;
  localStorage.setItem('ssms7_dark', darkMode ? '1' : '0');
  applyTheme();
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
    ['ssms7_e','ssms7_p','ssms7_focus'].forEach(k => localStorage.removeItem(k));
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
  const pos = entries.filter(e => POSITIVE_MOODS.includes(e.mood)).length;
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
  const el = document.getElementById('badges-row');
  if (!el) return;
  const earned = BADGES.filter(b => b.check(entries, focusSessions));
  if (!earned.length) {
    el.innerHTML = '<div class="empty" style="padding:0.8rem 0; font-size:12px;">Complete check-ins to unlock achievements!</div>';
    return;
  }
  el.innerHTML = earned.map(b =>
    `<div class="badge-item" title="${b.desc}">
      <div class="badge-emoji">${b.emoji}</div>
      <div class="badge-label">${b.label}</div>
    </div>`
  ).join('');
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
}

// ─── Mood Check-in ──────────────────────────────────────────────────
function selectMood(mood, el) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  currentMood = mood;
}

function updateIntensity(v) {
  currentIntensity = parseInt(v);
  document.getElementById('intensity-val').textContent = ['','Low','Medium','High'][currentIntensity];
}

function logMood() {
  if (!currentMood) {
    showFeedback('<div class="alert alert-warn"><div class="alert-title">Please select a mood first 😊</div></div>');
    return;
  }
  const note = document.getElementById('note').value.trim();
  entries.push({ mood: currentMood, note, ts: Date.now(), hour: new Date().getHours() });
  try { localStorage.setItem('ssms7_e', JSON.stringify(entries)); } catch(e) {}
  updateStreaks();
  renderHistory();

  const isDifficult = DIFFICULT_MOODS.includes(currentMood);
  const sc = entries.slice(-7).filter(e => DIFFICULT_MOODS.includes(e.mood)).length;
  let html = '';

  if (isDifficult && sc >= 3) {
    html = buildFeedback('alert-stress', "You've been under a lot lately 💙",
      "Here are a few gentle things to try:", 3, 'ds', currentMood);
  } else if (currentMood === 'tired' && entries.slice(-7).filter(e=>e.mood==='tired').length >= 2) {
    html = buildFeedback('alert-warn', 'Your body is asking for rest 🌙', 'Try one of these:', 2, 'dw', 'tired');
  } else if (isDifficult) {
    html = buildFeedback('alert-warn', "Noted. Here's a gentle nudge:", '', 1, 'dw', currentMood);
  } else {
    html = `<div class="alert alert-calm">
      <div class="alert-title">Logged ✓</div>
      <div style="font-size:13px; margin-top:3px;">
        ${POSITIVE_MOODS.includes(currentMood) ? 'Great to hear — feeling ' + moodInfo[currentMood].label.toLowerCase() + '! 🌟' : 'Thanks for checking in today 💜'}
      </div>
    </div>`;
  }

  if (isDifficult)
    html += `<button class="breathe-quick-btn" onclick="goToBreathe()">💨 Try a breathing exercise right now →</button>`;

  showFeedback(html);
  document.getElementById('note').value = '';
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  currentMood = null;
}

function goToBreathe() {
  showTab('breathe', document.querySelectorAll('.tab')[1]);
  window.scrollTo(0, 0);
}

function buildFeedback(cls, title, sub, n, dc, mood) {
  const pool = suggestions[mood] || suggestions._default;
  const items = pickN(pool, n);
  const list  = items.map((s,i) => `
    <li>
      <div class="dot ${dc}"></div>
      <div style="flex:1">${s}
        <div class="sugg-confirm" id="sc-${Date.now()}-${i}" onclick="completeSugg(this)">
          <input type="checkbox"> Mark as done
        </div>
      </div>
    </li>`).join('');
  return `<div class="alert ${cls}">
    <div class="alert-title">${title}</div>
    ${sub ? `<div style="font-size:13px; margin-bottom:6px;">${sub}</div>` : ''}
    <ul class="sugg">${list}</ul>
  </div>`;
}

function completeSugg(el) {
  const cb = el.querySelector('input');
  if (!cb.checked) { cb.checked = true; el.classList.add('done'); }
}

function pickN(arr, n) { return [...arr].sort(() => Math.random() - 0.5).slice(0, n); }
function showFeedback(html) { document.getElementById('feedback').innerHTML = html; }

// ─── History ──────────────────────────────────────────────────
function renderHistory() {
  const el = document.getElementById('history-list');
  if (!entries.length) { el.innerHTML = '<div class="empty">No entries yet. Log your first mood!</div>'; return; }
  const intensityLabels = ['','Low','Med','High'];
  el.innerHTML = [...entries].reverse().slice(0, 8).map(e => {
    const m = moodInfo[e.mood];
    return `<div class="hrow">
      <div class="hemoji">${m.emoji}</div>
      <div class="hinfo">
        <div class="hlabel">${m.label}<span class="badge ${m.badge}">${m.cat}</span></div>
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

  const cats = { positive:0, neutral:0, difficult:0, tired:0 };
  week.forEach(e => {
    const cat = moodInfo[e.mood]?.cat || 'neutral';
    cats[cat] = (cats[cat]||0) + 1;
  });
  const total = week.length;

  document.getElementById('r-total').textContent  = total;
  document.getElementById('r-stress').textContent = (cats.difficult||0) + (cats.tired||0);
  document.getElementById('r-happy').textContent  = cats.positive||0;

  const ins = document.getElementById('insight');
  if (!total)
    ins.textContent = 'Log a few moods to see your insight here.';
  else if ((cats.difficult||0) >= 4)
    ins.textContent = "You've been carrying a lot lately. Even a 5-minute pause can reset your nervous system. You're doing the right thing by tracking this 💙";
  else if ((cats.tired||0) >= 3)
    ins.textContent = "Fatigue has been showing up frequently. Protect your sleep time 🌙";
  else if ((cats.positive||0) >= (cats.difficult||0) + (cats.tired||0))
    ins.textContent = "This has been a positive week overall. Keep it up! 🌟";
  else
    ins.textContent = "Your mood has been mixed this week. That's completely normal. Keep checking in 💜";

  if (moodChart) { moodChart.destroy(); moodChart = null; }
  const colors = { positive:'#1D9E75', neutral:'#7F77DD', difficult:'#D85A30', tired:'#BA7517' };
  const keys   = ['positive','neutral','difficult','tired'];
  const labels = ['Positive','Neutral','Difficult','Tired'];

  if (total > 0) {
    moodChart = new Chart(document.getElementById('moodChart'), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data: keys.map(k => cats[k]||0), backgroundColor: keys.map(k => colors[k]), borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: { legend: { display:false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}` } } }
      }
    });
    document.getElementById('chart-legend').innerHTML = keys
      .filter(k => (cats[k]||0) > 0)
      .map((k,i) => `<div class="li"><div class="ls" style="background:${colors[k]}"></div><span>${labels[keys.indexOf(k)]} ${cats[k]||0}</span></div>`)
      .join('');
  }

  // Heatmap — last 7 days
  renderHeatmap();
}

function renderHeatmap() {
  const el = document.getElementById('heatmap-wrap');
  if (!el) return;
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0);
    days.push(d);
  }
  const colorMap = { positive:'#1D9E75', neutral:'#7F77DD', difficult:'#D85A30', tired:'#BA7517' };
  el.innerHTML = '<div class="heatmap">' + days.map(d => {
    const dayEntries = entries.filter(e => {
      const ed = new Date(e.ts); ed.setHours(0,0,0,0);
      return ed.getTime() === d.getTime();
    });
    const label = d.toLocaleDateString('en-US', { weekday:'short' });
    if (!dayEntries.length) {
      return `<div class="hm-cell hm-empty"><div class="hm-bar"></div><div class="hm-day">${label}</div></div>`;
    }
    const cats = dayEntries.map(e => moodInfo[e.mood]?.cat || 'neutral');
    // pick dominant
    const order = ['difficult','tired','neutral','positive'];
    const dom = order.find(c => cats.includes(c)) || 'neutral';
    const height = Math.min(100, dayEntries.length * 20 + 20);
    return `<div class="hm-cell">
      <div class="hm-bar" style="background:${colorMap[dom]}; height:${height}%; opacity:0.85;"></div>
      <div class="hm-day">${label}</div>
    </div>`;
  }).join('') + '</div>';
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

  // Priority for color: difficult > tired > neutral > positive
  const pr = { difficult:4, tired:3, neutral:2, positive:1 };
  const dom = entries => {
    const cats = entries.map(e => moodInfo[e.mood]?.cat || 'neutral');
    return cats.sort((a,b) => (pr[b]||0) - (pr[a]||0))[0];
  };

  const catClass = { positive:'cd-happy', neutral:'cd-neutral', difficult:'cd-stressed', tired:'cd-tired' };

  let cells = '';
  for (let i = 0; i < firstDay; i++) cells += '<div class="cal-day cd-empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const date    = new Date(calYear, calMonth, d); date.setHours(0,0,0,0);
    const isToday  = date.getTime() === today.getTime();
    const isFuture = date > today;
    if (isFuture) {
      cells += `<div class="cal-day cd-empty"></div>`;
    } else if (dayMap[d]) {
      const domCat = dom(dayMap[d]);
      const cls = catClass[domCat] || 'cd-none';
      const count = dayMap[d].length;
      cells += `<div class="cal-day ${cls}${isToday ? ' cd-today' : ''}" 
        onclick="openCalDay(${calYear},${calMonth},${d})" 
        style="cursor:pointer; position:relative;">
        ${d}
        ${count > 1 ? `<span class="cal-dot-count">${count}</span>` : ''}
      </div>`;
    } else {
      cells += `<div class="cal-day cd-none${isToday ? ' cd-today' : ''}">${d}</div>`;
    }
  }
  document.getElementById('cal-grid').innerHTML = cells;
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCalendar();
}

// ─── Calendar Day Modal ──────────────────────────────────────────────────
function openCalDay(y, m, d) {
  const date = new Date(y, m, d);
  const label = date.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
  document.getElementById('modal-date-title').textContent = label;

  const dayEntries = entries.filter(e => {
    const ed = new Date(e.ts);
    return ed.getFullYear()===y && ed.getMonth()===m && ed.getDate()===d;
  }).sort((a,b) => a.ts - b.ts);

  const body = document.getElementById('modal-body');
  if (!dayEntries.length) {
    body.innerHTML = '<div class="empty" style="padding:1rem 0;">No entries for this day.</div>';
  } else {
    body.innerHTML = dayEntries.map(e => {
      const mi = moodInfo[e.mood];
      const time = new Date(e.ts).toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
      return `<div class="modal-entry">
        <div class="modal-entry-top">
          <span class="modal-emoji">${mi.emoji}</span>
          <div>
            <div class="modal-mood-name">${mi.label}</div>
            <div class="modal-time">${time}</div>
          </div>
        </div>
        ${e.note ? `<div class="modal-note">"${e.note}"</div>` : ''}
      </div>`;
    }).join('');
  }

  document.getElementById('cal-modal').classList.add('open');
}

function closeCalModal(e) {
  if (!e || e.target === document.getElementById('cal-modal') || e.type !== 'click' || !e.target.closest('.modal-card'))
    document.getElementById('cal-modal').classList.remove('open');
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

// ─── Mood Card Stars ──────────────────────────────────────────────────
(function() {
  function initMoodStars() {
    const canvas = document.getElementById('mood-stars');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];

    function resize() {
      const card = canvas.parentElement;
      canvas.width  = card.offsetWidth;
      canvas.height = card.offsetHeight;
    }

    function buildStars() {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 1800);
      for (let i = 0; i < count; i++) {
        stars.push({
          x:     Math.random() * canvas.width,
          y:     Math.random() * canvas.height,
          r:     Math.random() * 1.1 + 0.3,
          base:  Math.random() * 0.45 + 0.1,
          speed: Math.random() * 0.03 + 0.008,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      stars.forEach(s => {
        const alpha = s.base + Math.sin(frame * s.speed + s.phase) * 0.18;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140, 120, 230, ${Math.max(0, Math.min(1, alpha))})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    buildStars();
    draw();
    window.addEventListener('resize', () => { resize(); buildStars(); });
  }

  // wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMoodStars);
  } else {
    initMoodStars();
  }
})();
(function() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    const count = Math.floor((W * H) / 6000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;
    stars.forEach(s => {
      const twinkle = s.alpha + Math.sin(frame * s.speed * 0.05 + s.phase) * 0.2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(160,150,230,${Math.max(0, Math.min(1, twinkle))})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  initStars();
  draw();
  window.addEventListener('resize', () => { resize(); initStars(); });
})();
// ─── Register Service Worker ──────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW failed:', err));
  });
}
