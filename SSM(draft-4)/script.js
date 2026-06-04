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
  happy:    { emoji: '😊', label: 'Happy',   badge: 'bc' },
  neutral:  { emoji: '😐', label: 'Neutral',  badge: 'bp' },
  stressed: { emoji: '😞', label: 'Stressed', badge: 'bs' },
  tired:    { emoji: '😴', label: 'Tired',    badge: 'bw' }
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



// ─── State ──────────────────────────────────────────────────
let entries       = JSON.parse(localStorage.getItem('ssms7_e')     || '[]');
let profile       = JSON.parse(localStorage.getItem('ssms7_p')     || 'null');
let focusSessions = JSON.parse(localStorage.getItem('ssms7_focus') || '[]');

let currentMood      = null;
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

// ─── Init ──────────────────────────────────────────────────
function init() {
  if (profile) showMainApp();
  else {
    document.getElementById('setup-screen').style.display = 'flex';
    document.getElementById('main-app').style.display     = 'none';
  }
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
  const pos = entries.filter(e => e.mood === 'happy' || e.mood === 'neutral').length;
  document.getElementById('p-happy').textContent =
    entries.length ? Math.round(pos / entries.length * 100) + '%' : '0%';
  const completedFocus = focusSessions.filter(s => s.completed).length;
  document.getElementById('p-focus').textContent = completedFocus;
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

  const sc = entries.slice(-7).filter(e => e.mood === 'stressed').length;
  const tc = entries.slice(-7).filter(e => e.mood === 'tired').length;
  const needsBreathe = currentMood === 'stressed' || currentMood === 'tired';
  let html = '';

  if      (currentMood === 'stressed' && sc >= 3)
    html = buildFeedback('alert-stress', "You've been under a lot lately 💙", "Here are a few gentle things to try:", 3, 'ds');
  else if (currentMood === 'tired' && tc >= 2)
    html = buildFeedback('alert-warn', 'Your body is asking for rest 🌙', 'Try one of these:', 2, 'dw');
  else if (needsBreathe)
    html = buildFeedback('alert-warn', "Noted. Here's a gentle nudge:", '', 1, 'dw');
  else
    html = `<div class="alert alert-calm">
      <div class="alert-title">Logged ✓</div>
      <div style="font-size:13px; margin-top:3px;">
        ${currentMood === 'happy' ? 'Great to hear. Keep it going! 🌟' : 'Thanks for checking in today 💜'}
      </div>
    </div>`;

  if (needsBreathe)
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

function buildFeedback(cls, title, sub, n, dc) {
  const items = pickN(calm, n);
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
  el.innerHTML = [...entries].reverse().slice(0, 8).map(e => {
    const m = moodInfo[e.mood];
    return `<div class="hrow">
      <div class="hemoji">${m.emoji}</div>
      <div class="hinfo">
        <div class="hlabel">${m.label}<span class="badge ${m.badge}">${e.mood}</span></div>
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
          <span class="session-badge">${s.completed ? '✅' : '⏹️'}</span>
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
  const c    = { happy:0, neutral:0, stressed:0, tired:0 };
  week.forEach(e => c[e.mood]++);
  const total = week.length;

  document.getElementById('r-total').textContent  = total;
  document.getElementById('r-stress').textContent = c.stressed;
  document.getElementById('r-happy').textContent  = c.happy;

  const ins = document.getElementById('insight');
  if (!total)
    ins.textContent = 'Log a few moods to see your insight here.';
  else if (c.stressed >= 4)
    ins.textContent = "You've been stressed quite a bit. Even a 5-minute break can reset your nervous system. You're doing the right thing by tracking this 💙";
  else if (c.tired >= 3)
    ins.textContent = "Fatigue has been showing up frequently. Protect your sleep time 🌙";
  else if (c.happy >= c.stressed + c.tired)
    ins.textContent = "This has been a positive week overall. Keep it up! 🌟";
  else
    ins.textContent = "Your mood has been mixed this week. That's normal. Keep checking in 💜";

  if (moodChart) { moodChart.destroy(); moodChart = null; }
  const colors = { happy:'#1D9E75', neutral:'#7F77DD', stressed:'#D85A30', tired:'#BA7517' };
  const keys   = ['happy','neutral','stressed','tired'];

  if (total > 0) {
    moodChart = new Chart(document.getElementById('moodChart'), {
      type: 'doughnut',
      data: {
        labels: ['Happy','Neutral','Stressed','Tired'],
        datasets: [{ data: keys.map(k => c[k]), backgroundColor: keys.map(k => colors[k]), borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: { legend: { display:false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}` } } }
      }
    });
    document.getElementById('chart-legend').innerHTML = keys
      .filter(k => c[k] > 0)
      .map(k => `<div class="li"><div class="ls" style="background:${colors[k]}"></div><span>${moodInfo[k].label} ${c[k]}</span></div>`)
      .join('');
  }
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
      dayMap[k].push(e.mood);
    }
  });

  const pr = { stressed:4, tired:3, neutral:2, happy:1 };
  const dom = moods => moods.sort((a,b) => (pr[b]||0) - (pr[a]||0))[0];

  let cells = '';
  for (let i = 0; i < firstDay; i++) cells += '<div class="cal-day cd-empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const date    = new Date(calYear, calMonth, d); date.setHours(0,0,0,0);
    const isToday  = date.getTime() === today.getTime();
    const isFuture = date > today;
    const cls = isFuture ? 'cd-empty' : dayMap[d] ? 'cd-' + dom(dayMap[d]) : 'cd-none';
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