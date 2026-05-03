// ─── Data ──────────────────────────────────────────────────────
let entries = JSON.parse(localStorage.getItem('ssms4_e') || '[]');
let profile = JSON.parse(localStorage.getItem('ssms4_p') || 'null');

// ─── Quotes ──────────────────────────────────────────────────────
const quotes = [
  { text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, or anxious.", author: "Lori Deschene" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "You are allowed to be both a masterpiece and a work in progress simultaneously.", author: "Sophia Bush" },
  { text: "Breathe. You're going to be okay. You've been in this place before.", author: "Daniell Koepke" },
  { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
  { text: "Be gentle with yourself. You are a child of the universe.", author: "Max Ehrmann" },
  { text: "Healing is not linear. Be patient with yourself.", author: "Unknown" },
  { text: "You don't have to have it all figured out to move forward.", author: "Unknown" },
  { text: "Rest is not idleness. It is a necessity.", author: "Unknown" },
  { text: "Your feelings are valid. Every single one of them.", author: "Unknown" }
];

// ─── Mood Info ──────────────────────────────────────────────────────
const moodInfo = {
  happy:    { emoji: '😊', label: 'Happy',   badge: 'bc' },
  neutral:  { emoji: '😐', label: 'Neutral',  badge: 'bp' },
  stressed: { emoji: '😞', label: 'Stressed', badge: 'bs' },
  tired:    { emoji: '😴', label: 'Tired',    badge: 'bw' }
};

// ─── Calm Suggestions ──────────────────────────────────────────────────────
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

// ─── Breathing Patterns ──────────────────────────────────────────────────────
const patterns = {
  '478': {
    phases: ['Inhale', 'Hold', 'Exhale'],
    times:  [4, 7, 8],
    tip: '4-7-8 breathing calms the nervous system quickly. Great before sleep or during anxiety.'
  },
  'box': {
    phases: ['Inhale', 'Hold', 'Exhale', 'Hold'],
    times:  [4, 4, 4, 4],
    tip: 'Box breathing is used by Navy SEALs to stay calm under pressure. Equal counts all around.'
  },
  'simple': {
    phases: ['Inhale', 'Exhale'],
    times:  [4, 4],
    tip: 'Simple rhythmic breathing. Perfect for beginners — just follow the circle.'
  }
};

// ─── State ──────────────────────────────────────────────────────
let currentMood     = null;
let moodChart       = null;
let calYear         = new Date().getFullYear();
let calMonth        = new Date().getMonth();
let selectedAv      = '🌸';
let editAv          = null;
let currentPattern  = '478';
let breatheRunning  = false;
let breatheTimer    = null;
let breathePhaseIdx = 0;
let breatheCycles   = 0;


// ─── Init ──────────────────────────────────────────────────────
function init() {
  if (profile) {
    showMainApp();
  } else {
    document.getElementById('setup-screen').style.display = 'flex';
    document.getElementById('main-app').style.display    = 'none';
  }
}


// ─── Setup / Profile ──────────────────────────────────────────────────────
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
  localStorage.setItem('ssms4_p', JSON.stringify(profile));
  showMainApp();
}

function showMainApp() {
  document.getElementById('setup-screen').style.display = 'none';
  document.getElementById('main-app').style.display     = 'block';
  applyProfile();
  updateStreaks();

  // Daily quote
  const idx = new Date().getDate() % quotes.length;
  document.getElementById('quote-text').textContent   = quotes[idx].text;
  document.getElementById('quote-author').textContent = '— ' + quotes[idx].author;
}

function applyProfile() {
  if (!profile) return;

  // Time-based greeting
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('hero-greeting').textContent = greet + ', ' + profile.name + '!';
  document.getElementById('hero-avatar').textContent   = profile.avatar;
  document.getElementById('profile-avatar').textContent = profile.avatar;
  document.getElementById('profile-name').textContent  = profile.name;

  const since = new Date(profile.since);
  document.getElementById('profile-since').textContent =
    'Member since ' + since.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Highlight current avatar in edit row
  document.querySelectorAll('#profile-avatar-row .av-btn').forEach(b => {
    b.classList.toggle('sel', b.textContent === profile.avatar);
  });
  editAv = profile.avatar;
}

function updateProfile() {
  const name = document.getElementById('edit-name').value.trim();
  if (name)  profile.name   = name;
  if (editAv) profile.avatar = editAv;
  localStorage.setItem('ssms4_p', JSON.stringify(profile));
  applyProfile();
  document.getElementById('edit-name').value = '';
}

function resetAll() {
  if (confirm('Reset all data? This cannot be undone.')) {
    localStorage.removeItem('ssms4_e');
    localStorage.removeItem('ssms4_p');
    entries = []; profile = null;
    location.reload();
  }
}


// ─── Streaks ──────────────────────────────────────────────────────
function updateStreaks() {
  document.getElementById('total-num').textContent = entries.length;
  const s = calcStreak();
  document.getElementById('streak-num').textContent = s.current;
  document.getElementById('best-num').textContent   = s.best;
  document.getElementById('p-total').textContent    = entries.length;
  document.getElementById('p-streak').textContent   = s.current;
  document.getElementById('p-best').textContent     = s.best;

  const pos = entries.filter(e => e.mood === 'happy' || e.mood === 'neutral').length;
  document.getElementById('p-happy').textContent =
    entries.length ? Math.round(pos / entries.length * 100) + '%' : '0%';
}

function calcStreak() {
  if (!entries.length) return { current: 0, best: 0 };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = [...new Set(entries.map(e => new Date(e.ts).toDateString()))]
    .map(d => new Date(d)).sort((a, b) => b - a);

  // Current streak
  let cur = 0;
  for (let i = 0; i < days.length; i++) {
    const d   = new Date(days[i]); d.setHours(0, 0, 0, 0);
    const exp = new Date(today);   exp.setDate(today.getDate() - i);
    if (d.getTime() === exp.getTime()) cur++;
    else break;
  }

  // Best streak ever
  const all = [...new Set(entries.map(e => new Date(e.ts).toDateString()))]
    .map(d => new Date(d)).sort((a, b) => a - b);
  let best = Math.max(1, cur), cs = 1;
  for (let i = 1; i < all.length; i++) {
    const diff = Math.round((all[i] - all[i - 1]) / 86400000);
    if (diff === 1) { cs++; if (cs > best) best = cs; }
    else cs = 1;
  }

  return { current: cur, best };
}


// ─── Tabs ──────────────────────────────────────────────────────
function showTab(id, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  el.classList.add('active');

  if (id === 'report')   renderReport();
  if (id === 'calendar') renderCalendar();
  if (id === 'profile')  { applyProfile(); updateStreaks(); }
}


// ─── Mood Check-in ──────────────────────────────────────────────────────
function selectMood(mood, el) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  currentMood = mood;
}

function logMood() {
  if (!currentMood) {
    showFeedback('<div class="alert alert-warn"><div class="alert-title">Please select a mood first.</div></div>');
    return;
  }

  const note = document.getElementById('note').value.trim();
  entries.push({ mood: currentMood, note, ts: Date.now(), hour: new Date().getHours() });
  try { localStorage.setItem('ssms4_e', JSON.stringify(entries)); } catch (e) {}
  updateStreaks();

  const sc = entries.slice(-7).filter(e => e.mood === 'stressed').length;
  const tc = entries.slice(-7).filter(e => e.mood === 'tired').length;
  let html = '';

  if (currentMood === 'stressed' && sc >= 3)
    html = buildFeedback('alert-stress', "You've been under a lot lately.", "Here are a few gentle things to try:", 3, 'ds');
  else if (currentMood === 'tired' && tc >= 2)
    html = buildFeedback('alert-warn', 'Your body might need rest.', 'Try one of these:', 2, 'dw');
  else if (currentMood === 'stressed' || currentMood === 'tired')
    html = buildFeedback('alert-warn', 'Noted. A gentle nudge:', '', 1, 'dw');
  else
    html = `<div class="alert alert-calm">
      <div class="alert-title">Logged</div>
      <div style="font-size:13px; margin-top:3px;">
        ${currentMood === 'happy' ? 'Great to hear. Keep it going.' : 'Thanks for checking in today.'}
      </div>
    </div>`;

  showFeedback(html);
  document.getElementById('note').value = '';
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  currentMood = null;
}

function buildFeedback(cls, title, sub, n, dotCls) {
  const items = pickN(calm, n).map(s =>
    `<li><div class="dot ${dotCls}"></div>${s}</li>`).join('');
  return `<div class="alert ${cls}">
    <div class="alert-title">${title}</div>
    ${sub ? `<div style="font-size:13px; margin-bottom:6px;">${sub}</div>` : ''}
    <ul class="sugg">${items}</ul>
  </div>`;
}

function pickN(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function showFeedback(html) {
  document.getElementById('feedback').innerHTML = html;
}


// ─── Breathing Exercise ──────────────────────────────────────────────────────
function setPattern(key, el) {
  document.querySelectorAll('.pat-btn').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
  currentPattern = key;
  resetBreathe();
  document.getElementById('breathe-tip').textContent = patterns[key].tip;
}

function toggleBreathe() {
  if (breatheRunning) pauseBreathe();
  else startBreathe();
}

function startBreathe() {
  breatheRunning = true;
  document.getElementById('start-btn').textContent = 'Pause';
  document.getElementById('start-btn').classList.add('active-btn');
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

  const circle = document.getElementById('breathe-circle');
  circle.style.transition = 'none';
  circle.style.width  = '100px';
  circle.style.height = '100px';

  document.getElementById('breathe-label').innerHTML = 'Press<br>Start';
  document.getElementById('breathe-phase').textContent   = '';
  document.getElementById('breathe-counter').textContent = '';
  document.getElementById('start-btn').textContent = 'Start';
  document.getElementById('start-btn').classList.add('active-btn');
}

function runPhase() {
  if (!breatheRunning) return;

  const p        = patterns[currentPattern];
  const phase    = p.phases[breathePhaseIdx];
  const duration = p.times[breathePhaseIdx];
  const circle   = document.getElementById('breathe-circle');
  const label    = document.getElementById('breathe-label');

  document.getElementById('breathe-phase').textContent   = phase;
  document.getElementById('breathe-counter').textContent = 'Cycle ' + (breatheCycles + 1);

  // Animate circle size based on phase
  if (phase === 'Inhale') {
    circle.style.transition = `width ${duration}s linear, height ${duration}s linear`;
    circle.style.width  = '148px';
    circle.style.height = '148px';
    label.textContent = 'Inhale';
  } else if (phase === 'Exhale') {
    circle.style.transition = `width ${duration}s linear, height ${duration}s linear`;
    circle.style.width  = '80px';
    circle.style.height = '80px';
    label.textContent = 'Exhale';
  } else {
    circle.style.transition = 'none';
    label.textContent = 'Hold';
  }

  // Countdown tick
  let remaining = duration;
  const tick = () => {
    if (!breatheRunning) return;
    document.getElementById('breathe-phase').textContent = phase + ' — ' + remaining;
    remaining--;
    if (remaining > 0) {
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


// ─── Report ──────────────────────────────────────────────────────
function renderReport() {
  const now  = Date.now();
  const week = entries.filter(e => now - e.ts < 7 * 86400000);
  const c    = { happy: 0, neutral: 0, stressed: 0, tired: 0 };
  week.forEach(e => c[e.mood]++);
  const total = week.length;

  document.getElementById('r-total').textContent  = total;
  document.getElementById('r-stress').textContent = c.stressed;
  document.getElementById('r-happy').textContent  = c.happy;

  const ins = document.getElementById('insight');
  if (!total)
    ins.textContent = 'Log a few moods to see your personalised insight here.';
  else if (c.stressed >= 4)
    ins.textContent = "You've been stressed quite a bit this week. Even a 5-minute break can reset your nervous system. You're doing the right thing by tracking this.";
  else if (c.tired >= 3)
    ins.textContent = "Fatigue has been showing up frequently. Consider protecting your sleep time — even 30 extra minutes can make a difference.";
  else if (c.happy >= c.stressed + c.tired)
    ins.textContent = "This has been a positive week overall. Whatever you're doing, keep at it.";
  else
    ins.textContent = "Your mood has been mixed this week. That's normal. Keep checking in — patterns become clearer over time.";

  // Chart
  if (moodChart) { moodChart.destroy(); moodChart = null; }
  const colors = { happy: '#1D9E75', neutral: '#7F77DD', stressed: '#D85A30', tired: '#BA7517' };
  const keys   = ['happy', 'neutral', 'stressed', 'tired'];

  if (total > 0) {
    moodChart = new Chart(document.getElementById('moodChart'), {
      type: 'doughnut',
      data: {
        labels: ['Happy', 'Neutral', 'Stressed', 'Tired'],
        datasets: [{
          data: keys.map(k => c[k]),
          backgroundColor: keys.map(k => colors[k]),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}` } }
        }
      }
    });

    document.getElementById('chart-legend').innerHTML = keys
      .filter(k => c[k] > 0)
      .map(k => `
        <div class="li">
          <div class="ls" style="background:${colors[k]}"></div>
          <span>${moodInfo[k].label} ${c[k]}</span>
        </div>`)
      .join('');
  }
}


// ─── Calendar ──────────────────────────────────────────────────────
function renderCalendar() {
  document.getElementById('cal-month-label').textContent =
    new Date(calYear, calMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const today      = new Date(); today.setHours(0, 0, 0, 0);
  const firstDay   = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  // Build day → moods map
  const dayMap = {};
  entries.forEach(e => {
    const d = new Date(e.ts);
    if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
      const k = d.getDate();
      if (!dayMap[k]) dayMap[k] = [];
      dayMap[k].push(e.mood);
    }
  });

  // Most stressful mood wins the color
  const priority = { stressed: 4, tired: 3, neutral: 2, happy: 1 };
  function dominant(moods) {
    return moods.sort((a, b) => (priority[b] || 0) - (priority[a] || 0))[0];
  }

  let cells = '';
  for (let i = 0; i < firstDay; i++)
    cells += '<div class="cal-day cd-empty"></div>';

  for (let d = 1; d <= daysInMonth; d++) {
    const date    = new Date(calYear, calMonth, d); date.setHours(0, 0, 0, 0);
    const isToday  = date.getTime() === today.getTime();
    const isFuture = date > today;
    let cls = isFuture ? 'cd-empty' : dayMap[d] ? 'cd-' + dominant(dayMap[d]) : 'cd-none';
    cells += `<div class="cal-day ${cls}${isToday ? ' cd-today' : ''}">${isFuture ? '' : d}</div>`;
  }

  document.getElementById('cal-grid').innerHTML = cells;
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCalendar();
}


// ─── Time Ago ──────────────────────────────────────────────────────
function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}


// ─── Start ──────────────────────────────────────────────────────
init();