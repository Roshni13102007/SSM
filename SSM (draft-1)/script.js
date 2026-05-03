// ─── Data ───────────────────────────────────────────
// All mood entries are stored here as an array of objects
let entries = JSON.parse(localStorage.getItem('ssms_entries') || '[]');

// Info for each mood type
const moodInfo = {
  happy:    { emoji: '😊', label: 'Happy',   badgeClass: 'badge-calm'   },
  neutral:  { emoji: '😐', label: 'Neutral',  badgeClass: 'badge-purple' },
  stressed: { emoji: '😞', label: 'Stressed', badgeClass: 'badge-stress' },
  tired:    { emoji: '😴', label: 'Tired',    badgeClass: 'badge-warn'   }
};

// Calm suggestions pool
const calmSuggestions = [
  'Take 5 slow, deep breaths — in for 4, out for 6.',
  'Drink a full glass of water right now.',
  'Step outside for 5 minutes of fresh air.',
  'Put on one calm song and just listen.',
  'Stretch your neck and shoulders gently.',
  'Write down one thing that is going okay today.',
  'Rest your eyes — close them for 60 seconds.',
  'Give yourself permission to pause. You deserve it.',
  'Splash cold water on your face.',
  'Put your phone down for 10 minutes.'
];

// Chart instance (kept here so we can destroy it before re-creating)
let moodChart = null;

// Currently selected mood on the check-in screen
let currentMood = null;


// ─── Tab Switching ───────────────────────────────────────────
function showTab(id, clickedTab) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // Deactivate all tabs
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  // Show the selected section and activate the clicked tab
  document.getElementById('tab-' + id).classList.add('active');
  clickedTab.classList.add('active');

  // Render content for that tab
  if (id === 'history') renderHistory();
  if (id === 'report')  renderReport();
}


// ─── Mood Selection ───────────────────────────────────────────
function selectMood(mood, clickedBtn) {
  // Deselect all mood buttons
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  // Select the clicked one
  clickedBtn.classList.add('selected');
  currentMood = mood;
}


// ─── Log Mood ───────────────────────────────────────────
function logMood() {
  // Guard: must select a mood first
  if (!currentMood) {
    showFeedback(`
      <div class="alert-box alert-warn">
        <div class="alert-title">Please select a mood first.</div>
      </div>
    `);
    return;
  }

  // Build the entry object
  const note = document.getElementById('note').value.trim();
  const entry = {
    mood: currentMood,
    note: note,
    ts: Date.now(),
    hour: new Date().getHours()
  };

  // Save to array and localStorage
  entries.push(entry);
  saveEntries();

  // Analyze stress level from recent entries
  const { stressCount, tiredCount } = getStressLevel();

  // Show appropriate feedback
  let html = '';

  if (currentMood === 'stressed' && stressCount >= 3) {
    html = buildFeedback(
      'alert-stress',
      "You've been under a lot lately.",
      "Here are a few small things that might help:",
      3,
      'dot-stress'
    );
  } else if (currentMood === 'tired' && tiredCount >= 2) {
    html = buildFeedback(
      'alert-warn',
      'Your body might need rest.',
      'Try one of these:',
      2,
      'dot-warn'
    );
  } else if (currentMood === 'stressed' || currentMood === 'tired') {
    html = buildFeedback(
      'alert-warn',
      'Noted. Here\'s a gentle nudge:',
      '',
      1,
      'dot-warn'
    );
  } else {
    html = `
      <div class="alert-box alert-calm">
        <div class="alert-title">Logged</div>
        <div class="alert-subtitle">
          ${currentMood === 'happy'
            ? 'Great to hear. Keep it going.'
            : 'Thanks for checking in today.'}
        </div>
      </div>
    `;
  }

  showFeedback(html);

  // Reset form
  document.getElementById('note').value = '';
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  currentMood = null;
}


// ─── Stress Analysis ───────────────────────────────────────────
function getStressLevel() {
  // Only look at the last 7 entries
  const recent = entries.slice(-7);
  const stressCount = recent.filter(e => e.mood === 'stressed').length;
  const tiredCount  = recent.filter(e => e.mood === 'tired').length;
  return { stressCount, tiredCount };
}


// ─── Build Feedback HTML ───────────────────────────────────────────
function buildFeedback(alertClass, title, subtitle, count, dotClass) {
  const picked = pickSuggestions(count);
  const items  = picked.map(s => `
    <li><div class="dot ${dotClass}"></div>${s}</li>
  `).join('');

  return `
    <div class="alert-box ${alertClass}">
      <div class="alert-title">${title}</div>
      ${subtitle ? `<div class="alert-subtitle">${subtitle}</div>` : ''}
      <ul class="suggestions">${items}</ul>
    </div>
  `;
}


// ─── Pick Random Suggestions ───────────────────────────────────────────
function pickSuggestions(n) {
  // Shuffle the array and return the first n items
  return [...calmSuggestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, n);
}


// ─── Show Feedback ───────────────────────────────────────────
function showFeedback(html) {
  document.getElementById('feedback-area').innerHTML = html;
}


// ─── Time Ago Helper ───────────────────────────────────────────
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}


// ─── Save Entries to localStorage ───────────────────────────────────────────
function saveEntries() {
  try {
    localStorage.setItem('ssms_entries', JSON.stringify(entries));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
}


// ─── Render History Tab ───────────────────────────────────────────
function renderHistory() {
  const list = document.getElementById('history-list');

  if (entries.length === 0) {
    list.innerHTML = '<div class="empty-msg">No entries yet. Log your first mood!</div>';
    return;
  }

  // Show most recent 10 entries
  const recent = [...entries].reverse().slice(0, 10);

  list.innerHTML = recent.map(e => {
    const m = moodInfo[e.mood];
    return `
      <div class="history-row">
        <div class="history-mood">${m.emoji}</div>
        <div class="history-info">
          <div class="history-label">
            ${m.label}
            <span class="badge ${m.badgeClass}">${e.mood}</span>
          </div>
          ${e.note ? `<div class="history-note">${e.note}</div>` : ''}
        </div>
        <div class="history-time">${timeAgo(e.ts)}</div>
      </div>
    `;
  }).join('');
}


// ─── Render Report Tab ───────────────────────────────────────────
function renderReport() {
  // Filter to last 7 days only
  const now      = Date.now();
  const oneWeek  = 7 * 24 * 60 * 60 * 1000;
  const week     = entries.filter(e => now - e.ts < oneWeek);

  // Count each mood
  const counts = { happy: 0, neutral: 0, stressed: 0, tired: 0 };
  week.forEach(e => counts[e.mood]++);

  const total    = week.length;
  const positive = counts.happy + counts.neutral;

  // Update metric cards
  document.getElementById('r-total').textContent  = total;
  document.getElementById('r-stress').textContent = counts.stressed;
  document.getElementById('r-happy').textContent  = counts.happy;

  // Update insight text
  const insightEl = document.getElementById('insight-text');
  if (total === 0) {
    insightEl.textContent = 'Log a few moods to see your personalised insight here.';
  } else if (counts.stressed >= 4) {
    insightEl.textContent = "You've been stressed quite a bit this week. Even a 5-minute break can reset your nervous system. You're doing the right thing by tracking this.";
  } else if (counts.tired >= 3) {
    insightEl.textContent = "Fatigue has been showing up frequently. Consider protecting your sleep time — even 30 extra minutes can make a noticeable difference.";
  } else if (counts.happy >= counts.stressed + counts.tired) {
    insightEl.textContent = "This has been a positive week for you overall. Whatever you're doing, keep at it.";
  } else {
    insightEl.textContent = "Your mood has been mixed this week. That's normal. Keep checking in — patterns become clearer over time.";
  }

  // Render Chart
  renderChart(counts, total);
}


// ─── Render Doughnut Chart ───────────────────────────────────────────
function renderChart(counts, total) {
  // Destroy old chart if it exists
  if (moodChart) {
    moodChart.destroy();
    moodChart = null;
  }

  const canvas = document.getElementById('moodChart');
  const legend = document.getElementById('chart-legend');

  if (total === 0) {
    // Draw a "no data" message on the canvas
    const ctx = canvas.getContext('2d');
    canvas.width  = canvas.offsetWidth;
    canvas.height = 200;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font      = '14px sans-serif';
    ctx.fillStyle = '#bbb';
    ctx.textAlign = 'center';
    ctx.fillText('No data yet — log some moods!', canvas.width / 2, 100);
    legend.innerHTML = '';
    return;
  }

  // Chart colors
  const colors = {
    happy:    '#1D9E75',
    neutral:  '#888780',
    stressed: '#D85A30',
    tired:    '#BA7517'
  };

  const labels = ['Happy', 'Neutral', 'Stressed', 'Tired'];
  const keys   = ['happy', 'neutral', 'stressed', 'tired'];
  const data   = keys.map(k => counts[k]);
  const bgs    = keys.map(k => colors[k]);

  moodChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: bgs,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.raw}`
          }
        }
      }
    }
  });

  // Build custom legend
  legend.innerHTML = keys
    .filter(k => counts[k] > 0)
    .map(k => `
      <div class="legend-item">
        <div class="legend-swatch" style="background:${colors[k]};"></div>
        ${moodInfo[k].label} ${counts[k]}
      </div>
    `)
    .join('');
}