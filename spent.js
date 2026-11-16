'use strict';

const CATS = [
  { id: 'food', label: 'Food' },
  { id: 'transport', label: 'Transport' },
  { id: 'home', label: 'Home' },
  { id: 'health', label: 'Health' },
  { id: 'fun', label: 'Fun' },
  { id: 'other', label: 'Other' },
];

const KEY = 'tally.v1';
const RING = 2 * Math.PI * 32;
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const el = {
  page: document.getElementById('page'),
  monthLabel: document.getElementById('monthLabel'),
  monthTrigger: document.getElementById('monthTrigger'),
  calendar: document.getElementById('calendar'),
  calGrid: document.getElementById('calGrid'),
  calTitle: document.getElementById('calTitle'),
  calClose: document.getElementById('calClose'),
  calDayLabel: document.getElementById('calDayLabel'),
  calList: document.getElementById('calList'),
  calEmpty: document.getElementById('calEmpty'),
  total: document.getElementById('total'),
  lede: document.getElementById('lede'),
  ring: document.getElementById('ring'),
  ringWrap: document.getElementById('ringWrap'),
  ringPct: document.getElementById('ringPct'),
  budget: document.getElementById('budget'),
  left: document.getElementById('left'),
  split: document.getElementById('split'),
  legend: document.getElementById('legend'),
  whereEmpty: document.getElementById('whereEmpty'),
  tabs: document.getElementById('tabs'),
  tabInk: document.getElementById('tabInk'),
  count: document.getElementById('count'),
  items: document.getElementById('items'),
  empty: document.getElementById('empty'),
  prev: document.getElementById('prev'),
  next: document.getElementById('next'),
  form: document.getElementById('form'),
  amount: document.getElementById('amount'),
  amountErr: document.getElementById('amountErr'),
  note: document.getElementById('note'),
  whenBtn: document.getElementById('whenBtn'),
  whenValue: document.getElementById('whenValue'),
  whenPanel: document.getElementById('whenPanel'),
  whenPrev: document.getElementById('whenPrev'),
  whenNext: document.getElementById('whenNext'),
  whenMonth: document.getElementById('whenMonth'),
  whenGrid: document.getElementById('whenGrid'),
  hourVal: document.getElementById('hourVal'),
  minVal: document.getElementById('minVal'),
  hourUp: document.getElementById('hourUp'),
  hourDown: document.getElementById('hourDown'),
  minUp: document.getElementById('minUp'),
  minDown: document.getElementById('minDown'),
  amBtn: document.getElementById('amBtn'),
  pmBtn: document.getElementById('pmBtn'),
  catChips: document.getElementById('catChips'),
  openSheet: document.getElementById('openSheet'),
  sheet: document.getElementById('sheet'),
  scrim: document.getElementById('scrim'),
  cancel: document.getElementById('cancel'),
  toast: document.getElementById('toast'),
};

const params = new URLSearchParams(location.search);
const FIXED_TODAY = /^\d{4}-\d{2}-\d{2}$/.test(params.get('today') || '') ? params.get('today') : '';
const FIXTURE = params.get('fixture') === '1';

const store = window.SpentStorage || {
  read: () => {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  },
  write: (text) => {
    try {
      localStorage.setItem(KEY, text);
    } catch (e) {
      /* reported by save() */
    }
  },
};

let state = FIXTURE ? fixtureState() : load();
let month = todayMonth();
let filter = 'all';
let selectedCat = 'food';
let busy = false;
let sheetOpen = false;
let lastFocus = null;
let whenISO = todayISO();
let whenMin = nowMinutes();
let whenView = whenISO.slice(0, 7);

/* ── Storage ───────────────────────────────────────────── */

function load() {
  const blank = { items: [], budgets: {} };
  try {
    const raw = JSON.parse(store.read() || '{}');
    if (!raw || typeof raw !== 'object') return blank;
    const items = Array.isArray(raw.items)
      ? raw.items.filter(
          (it) =>
            it &&
            typeof it.amount === 'number' &&
            it.amount > 0 &&
            typeof it.date === 'string' &&
            /^\d{4}-\d{2}-\d{2}$/.test(it.date) &&
            typeof it.id === 'string'
        )
      : [];
    const budgets = raw.budgets && typeof raw.budgets === 'object' ? raw.budgets : {};
    return { items, budgets };
  } catch {
    return blank;
  }
}

function save() {
  if (FIXTURE) return;
  try {
    store.write(JSON.stringify(state));
  } catch {
    toast('Could not save here. The list lasts until you reload.');
  }
}

function fixtureState() {
  const base = FIXED_TODAY || '2026-11-15';
  const m = base.slice(0, 7);
  return {
    items: [
      { id: 'f1', amount: 4200, cat: 'transport', note: 'Train pass', date: `${m}-14`, time: '07:20' },
      { id: 'f2', amount: 1230, cat: 'food', note: 'Lunch with Sam', date: `${m}-14`, time: '12:45' },
      { id: 'f3', amount: 2450, cat: 'fun', note: 'Cinema', date: `${m}-09`, time: '19:30' },
      { id: 'f4', amount: 8999, cat: 'home', note: 'Desk lamp', date: `${m}-03`, time: '16:10' },
    ],
    budgets: { [m]: 60000 },
  };
}

/* ── Small helpers ─────────────────────────────────────── */

function pad(n) {
  return String(n).padStart(2, '0');
}

function todayISO() {
  if (FIXED_TODAY) return FIXED_TODAY;
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function nowMinutes() {
  if (FIXED_TODAY) return 9 * 60;
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function todayMonth() {
  return todayISO().slice(0, 7);
}

function monthLabel(m) {
  const [y, mo] = m.split('-').map(Number);
  return new Date(y, mo - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function daysIn(m) {
  const [y, mo] = m.split('-').map(Number);
  return new Date(y, mo, 0).getDate();
}

const money = (cents) => usd.format(cents / 100);

function catLabel(id) {
  const found = CATS.find((c) => c.id === id);
  return found ? found.label : 'Other';
}

function prettyDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function minutesToHHMM(total) {
  const m = ((total % 1440) + 1440) % 1440;
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}

function prettyTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function parseMoney(value) {
  const raw = String(value).trim().replace(/[^0-9.]/g, '');
  if (!raw) return NaN;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? Math.round(n * 100) : NaN;
}

let toastTimer = 0;
function toast(message) {
  el.toast.textContent = message;
  el.toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.toast.classList.remove('show'), 2400);
}

/* ── Render ────────────────────────────────────────────── */

function render() {
  const label = monthLabel(month);
  el.monthLabel.textContent = label;

  const monthItems = state.items.filter((it) => it.date.startsWith(month));
  const shown = filter === 'all' ? monthItems : monthItems.filter((it) => it.cat === filter);
  const total = monthItems.reduce((sum, it) => sum + it.amount, 0);

  el.total.textContent = money(total);

  const byCat = new Map();
  for (const it of monthItems) byCat.set(it.cat, (byCat.get(it.cat) || 0) + it.amount);
  let topCat = '';
  let topAmt = 0;
  for (const [cat, amt] of byCat) {
    if (amt > topAmt) {
      topCat = cat;
      topAmt = amt;
    }
  }

  const days = month === todayMonth() ? new Date().getDate() : daysIn(month);
  const perDay = monthItems.length ? Math.round(total / days) : 0;
  el.lede.textContent = monthItems.length
    ? `${catLabel(topCat)} leads · ${money(perDay)} a day · ${monthItems.length} ${monthItems.length === 1 ? 'entry' : 'entries'}`
    : `Nothing logged in ${label}`;

  const budget = Number(state.budgets[month]) || 0;
  if (document.activeElement !== el.budget) {
    el.budget.value = budget ? (budget / 100).toFixed(2) : '';
  }
  const ratio = budget ? total / budget : 0;
  const pct = budget ? Math.round(ratio * 100) : 0;
  el.ring.style.strokeDashoffset = String(RING * (1 - Math.min(1, ratio)));
  el.ringWrap.classList.toggle('over', budget > 0 && total > budget);
  el.ringPct.textContent = budget ? `${pct}%` : '—';
  el.ringWrap.setAttribute(
    'aria-label',
    budget
      ? `${money(total)} of the ${money(budget)} budget spent, ${pct} percent${total > budget ? ', over budget' : ''}`
      : `No budget set. ${money(total)} spent`
  );
  el.left.textContent = !budget
    ? 'No budget set'
    : total > budget
      ? `${money(total - budget)} over`
      : `${money(budget - total)} left`;

  renderBreakdown(byCat, total);

  shown.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (a.time && b.time && a.time !== b.time) return a.time < b.time ? 1 : -1;
    if (a.time && !b.time) return -1;
    if (!a.time && b.time) return 1;
    return b.id.localeCompare(a.id);
  });
  el.items.replaceChildren(...shown.map(row));
  el.empty.hidden = shown.length > 0;
  el.empty.textContent =
    monthItems.length && !shown.length
      ? 'Nothing in this category this month.'
      : 'No expenses yet. Add the first one.';
  el.count.textContent = filter === 'all'
    ? `${monthItems.length} ${monthItems.length === 1 ? 'entry' : 'entries'}`
    : `${shown.length} of ${monthItems.length}`;

  el.tabs.querySelectorAll('.tab').forEach((tab) => {
    tab.setAttribute('aria-pressed', tab.dataset.filter === filter ? 'true' : 'false');
  });
  el.catChips.querySelectorAll('.chip').forEach((chip) => {
    chip.setAttribute('aria-pressed', chip.dataset.cat === selectedCat ? 'true' : 'false');
  });

  moveInk();
  if (!el.calendar.hidden) renderCalendar();
}

function renderBreakdown(byCat, total) {
  const rows = [...byCat]
    .map(([cat, amt]) => ({ cat, amt }))
    .filter((r) => r.amt > 0)
    .sort((a, b) => b.amt - a.amt);

  el.split.replaceChildren();
  el.legend.replaceChildren();
  el.split.hidden = rows.length === 0;
  el.legend.hidden = rows.length === 0;
  el.whereEmpty.hidden = rows.length > 0;
  if (!rows.length) return;

  for (const r of rows) {
    const segment = document.createElement('span');
    segment.className = 'segpart';
    segment.dataset.cat = r.cat;
    segment.style.flexGrow = '0';
    el.split.append(segment);
    requestAnimationFrame(() => {
      segment.style.flexGrow = String(r.amt);
    });

    const li = document.createElement('li');
    li.dataset.cat = r.cat;
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.textContent = catLabel(r.cat);
    const amount = document.createElement('b');
    amount.textContent = money(r.amt);
    li.append(dot, label, amount);
    el.legend.append(li);
  }
}

function row(it) {
  const li = document.createElement('li');
  li.className = 'item';
  li.dataset.cat = it.cat;

  const dot = document.createElement('span');
  dot.className = 'dot';
  dot.setAttribute('aria-hidden', 'true');

  const main = document.createElement('span');
  main.className = 'item-main';
  const note = document.createElement('span');
  note.className = 'note';
  note.textContent = it.note || catLabel(it.cat);
  const sub = document.createElement('span');
  sub.className = 'sub';
  sub.textContent = `${catLabel(it.cat)} · ${prettyDate(it.date)}${it.time ? ` · ${prettyTime(it.time)}` : ''}`;
  main.append(note, sub);

  const amt = document.createElement('span');
  amt.className = 'amt';
  amt.textContent = `−${money(it.amount)}`;

  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'del';
  del.dataset.id = it.id;
  del.setAttribute('aria-label', `Delete ${note.textContent}, ${money(it.amount)}`);
  del.textContent = '×';

  li.append(dot, main, amt, del);
  return li;
}

/* ── Tabs ──────────────────────────────────────────────── */

function moveInk() {
  const active = el.tabs.querySelector('.tab[aria-pressed="true"]');
  if (!active) return;
  el.tabInk.style.width = `${active.offsetWidth}px`;
  el.tabInk.style.transform = `translateX(${active.offsetLeft}px)`;
}

const FILTERS = [{ id: 'all', label: 'All' }, ...CATS.map((c) => ({ id: c.id, label: c.label }))];
for (const f of FILTERS) {
  const tab = document.createElement('button');
  tab.type = 'button';
  tab.className = 'tab';
  tab.dataset.filter = f.id;
  tab.textContent = f.label;
  tab.setAttribute('aria-pressed', 'false');
  tab.addEventListener('click', () => {
    filter = f.id;
    render();
  });
  el.tabs.append(tab);
}

for (const cat of CATS) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'chip';
  chip.dataset.cat = cat.id;
  chip.textContent = cat.label;
  chip.setAttribute('aria-pressed', 'false');
  chip.addEventListener('click', () => {
    selectedCat = cat.id;
    el.catChips.querySelectorAll('.chip').forEach((c) => {
      c.setAttribute('aria-pressed', c.dataset.cat === selectedCat ? 'true' : 'false');
    });
  });
  el.catChips.append(chip);
}

/* ── Month paging ──────────────────────────────────────── */

async function shiftMonth(delta) {
  if (busy) return;
  const next = (() => {
    const [y, mo] = month.split('-').map(Number);
    const d = new Date(y, mo - 1 + delta, 1);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  })();

  if (reduced) {
    month = next;
    render();
    return;
  }

  busy = true;
  const out = el.page.animate(
    [
      { opacity: 1, transform: 'translateX(0)' },
      { opacity: 0, transform: `translateX(${delta > 0 ? -14 : 14}px)` },
    ],
    { duration: 130, easing: 'cubic-bezier(.4,0,1,1)' }
  );
  try {
    await out.finished;
  } catch {
    /* interrupted */
  }
  month = next;
  render();
  el.page.animate(
    [
      { opacity: 0, transform: `translateX(${delta > 0 ? 14 : -14}px)` },
      { opacity: 1, transform: 'translateX(0)' },
    ],
    { duration: 240, easing: 'cubic-bezier(.32,.72,0,1)' }
  );
  busy = false;
}

el.prev.addEventListener('click', () => shiftMonth(-1));
el.next.addEventListener('click', () => shiftMonth(1));

/* ── Sheet ─────────────────────────────────────────────── */

function openSheet() {
  lastFocus = document.activeElement;
  el.sheet.hidden = false;
  el.scrim.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    el.sheet.classList.add('open');
    el.scrim.classList.add('show');
  });
  sheetOpen = true;
  el.amountErr.hidden = true;
  el.amount.setAttribute('aria-invalid', 'false');
  whenISO = todayISO();
  whenMin = nowMinutes();
  whenView = whenISO.slice(0, 7);
  closeWhen();
  renderWhen();
  window.setTimeout(() => el.amount.focus(), 120);
}

function closeSheet() {
  if (!sheetOpen) return;
  sheetOpen = false;
  el.sheet.classList.remove('open');
  el.scrim.classList.remove('show');
  document.body.style.overflow = '';
  window.setTimeout(() => {
    el.sheet.hidden = true;
    el.scrim.hidden = true;
  }, 320);
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}

el.openSheet.addEventListener('click', openSheet);
el.cancel.addEventListener('click', closeSheet);
el.scrim.addEventListener('click', closeSheet);

document.addEventListener('keydown', (event) => {
  if (!sheetOpen) {
    if (event.key === 'Escape' && !el.calendar.hidden) {
      closeCal();
      el.monthTrigger.focus();
    }
    return;
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    closeSheet();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = el.sheet.querySelectorAll('button, input, select, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

/* ── Add and delete ────────────────────────────────────── */

el.form.addEventListener('submit', (event) => {
  event.preventDefault();
  const amount = parseMoney(el.amount.value);
  const ok = Number.isFinite(amount) && amount > 0;

  el.amountErr.hidden = ok;
  el.amountErr.textContent = ok ? '' : 'Enter an amount above zero.';
  el.amount.setAttribute('aria-invalid', ok ? 'false' : 'true');

  if (!ok) {
    el.amount.focus();
    return;
  }

  const cat = CATS.some((c) => c.id === selectedCat) ? selectedCat : 'other';
  const date = whenISO;
  const note = el.note.value.trim().slice(0, 80) || catLabel(cat);
  const time = minutesToHHMM(whenMin);

  state.items.push({ id: String(Date.now()), amount, cat, note, date, time });
  save();

  month = date.slice(0, 7);
  if (filter !== 'all' && filter !== cat) filter = 'all';

  el.amount.value = '';
  el.note.value = '';
  closeSheet();
  render();
  toast(`Added ${money(amount)} · ${catLabel(cat)}`);
});

el.items.addEventListener('click', (event) => {
  const btn = event.target.closest('.del');
  if (!btn) return;
  const id = btn.dataset.id;
  const gone = state.items.find((it) => it.id === id);
  if (!gone) return;

  const li = btn.closest('.item');
  const remove = () => {
    state.items = state.items.filter((it) => it.id !== id);
    save();
    render();
    toast(`Deleted ${gone.note || catLabel(gone.cat)}`);
  };

  if (reduced || !li) {
    remove();
    return;
  }

  const height = li.offsetHeight;
  li.style.overflow = 'hidden';
  li.animate(
    [
      { height: `${height}px`, opacity: 1, transform: 'translateX(0)' },
      { height: '0px', opacity: 0, transform: 'translateX(-10px)' },
    ],
    { duration: 220, easing: 'cubic-bezier(.32,.72,0,1)', fill: 'forwards' }
  )
    .finished.then(remove)
    .catch(remove);
});

el.budget.addEventListener('change', () => {
  const cents = parseMoney(el.budget.value);
  if (!Number.isFinite(cents) || cents <= 0) {
    delete state.budgets[month];
  } else {
    state.budgets[month] = cents;
  }
  save();
  render();
});

el.budget.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    el.budget.blur();
  }
});

window.addEventListener('resize', moveInk);

/* ── When picker: date and time drawn by us, not by the OS ─ */

function whenValueLabel() {
  const [y, mo, d] = whenISO.split('-').map(Number);
  const date = new Date(y, mo - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${date} · ${prettyTime(minutesToHHMM(whenMin))}`;
}

function renderWhen() {
  el.whenValue.textContent = whenValueLabel();
  const [h, m] = minutesToHHMM(whenMin).split(':').map(Number);
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  el.hourVal.textContent = String(hour12);
  el.minVal.textContent = pad(m);
  el.amBtn.setAttribute('aria-pressed', h < 12 ? 'true' : 'false');
  el.pmBtn.setAttribute('aria-pressed', h >= 12 ? 'true' : 'false');
  renderWhenGrid();
}

function renderWhenGrid() {
  const [y, mo] = whenView.split('-').map(Number);
  el.whenMonth.textContent = monthLabel(whenView);
  const total = daysIn(whenView);
  const startDow = new Date(y, mo - 1, 1).getDay();
  const frag = document.createDocumentFragment();

  for (const dow of ['S', 'M', 'T', 'W', 'T', 'F', 'S']) {
    const cell = document.createElement('span');
    cell.className = 'cal-dow';
    cell.textContent = dow;
    frag.append(cell);
  }
  for (let i = 0; i < startDow; i++) {
    const blank = document.createElement('span');
    blank.className = 'cal-blank';
    frag.append(blank);
  }
  for (let d = 1; d <= total; d++) {
    const iso = `${whenView}-${pad(d)}`;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cal-day-btn';
    btn.dataset.iso = iso;
    btn.setAttribute('aria-pressed', iso === whenISO ? 'true' : 'false');
    btn.setAttribute(
      'aria-label',
      new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    );
    const num = document.createElement('span');
    num.textContent = String(d);
    btn.append(num);
    btn.addEventListener('click', () => {
      whenISO = iso;
      whenView = iso.slice(0, 7);
      renderWhen();
    });
    frag.append(btn);
  }
  el.whenGrid.replaceChildren(frag);
}

function bumpWhenMinutes(delta) {
  whenMin = (((whenMin + delta) % 1440) + 1440) % 1440;
  renderWhen();
}

function openWhen() {
  el.whenPanel.hidden = false;
  el.whenBtn.setAttribute('aria-expanded', 'true');
  renderWhen();
}

function closeWhen() {
  el.whenPanel.hidden = true;
  el.whenBtn.setAttribute('aria-expanded', 'false');
}

el.whenBtn.addEventListener('click', () => {
  if (el.whenPanel.hidden) openWhen();
  else closeWhen();
});

el.whenPrev.addEventListener('click', () => {
  const [y, mo] = whenView.split('-').map(Number);
  const d = new Date(y, mo - 2, 1);
  whenView = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  renderWhenGrid();
});

el.whenNext.addEventListener('click', () => {
  const [y, mo] = whenView.split('-').map(Number);
  const d = new Date(y, mo, 1);
  whenView = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  renderWhenGrid();
});

el.hourUp.addEventListener('click', () => bumpWhenMinutes(60));
el.hourDown.addEventListener('click', () => bumpWhenMinutes(-60));
el.minUp.addEventListener('click', () => bumpWhenMinutes(5));
el.minDown.addEventListener('click', () => bumpWhenMinutes(-5));

el.amBtn.addEventListener('click', () => {
  if (Math.floor(whenMin / 60) >= 12) whenMin -= 720;
  renderWhen();
});

el.pmBtn.addEventListener('click', () => {
  if (Math.floor(whenMin / 60) < 12) whenMin += 720;
  renderWhen();
});

/* ── Calendar ──────────────────────────────────────────── */

let calSel = '';

function renderCalendar() {
  const [y, mo] = month.split('-').map(Number);
  const total = daysIn(month);
  const startDow = new Date(y, mo - 1, 1).getDay();
  const today = todayISO();

  const byDay = new Map();
  for (const it of state.items) {
    if (!it.date.startsWith(month)) continue;
    const d = Number(it.date.slice(8, 10));
    const entry = byDay.get(d) || { total: 0, count: 0 };
    entry.total += it.amount;
    entry.count += 1;
    byDay.set(d, entry);
  }

  if (!calSel || !calSel.startsWith(month)) {
    calSel = today.startsWith(month) ? today : `${month}-01`;
  }

  el.calTitle.textContent = monthLabel(month);
  const frag = document.createDocumentFragment();

  for (const dow of ['S', 'M', 'T', 'W', 'T', 'F', 'S']) {
    const cell = document.createElement('span');
    cell.className = 'cal-dow';
    cell.textContent = dow;
    frag.append(cell);
  }
  for (let i = 0; i < startDow; i++) {
    const blank = document.createElement('span');
    blank.className = 'cal-blank';
    frag.append(blank);
  }

  for (let d = 1; d <= total; d++) {
    const iso = `${month}-${pad(d)}`;
    const info = byDay.get(d);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cal-day-btn';
    btn.dataset.iso = iso;
    btn.setAttribute('aria-pressed', iso === calSel ? 'true' : 'false');
    const readable = new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    btn.setAttribute(
      'aria-label',
      info
        ? `${readable}, ${money(info.total)} across ${info.count} ${info.count === 1 ? 'expense' : 'expenses'}`
        : `${readable}, no expenses`
    );
    if (iso === today) btn.classList.add('today');

    const num = document.createElement('span');
    num.textContent = String(d);
    btn.append(num);
    if (info) {
      const dot = document.createElement('span');
      dot.className = 'cal-dot';
      dot.setAttribute('aria-hidden', 'true');
      btn.append(dot);
    }
    btn.addEventListener('click', () => {
      calSel = iso;
      el.calGrid.querySelectorAll('.cal-day-btn').forEach((b) => {
        b.setAttribute('aria-pressed', b.dataset.iso === iso ? 'true' : 'false');
      });
      renderDayPanel();
    });
    frag.append(btn);
  }

  el.calGrid.replaceChildren(frag);
  renderDayPanel();
}

function renderDayPanel() {
  const items = state.items
    .filter((it) => it.date === calSel)
    .sort((a, b) => (a.time && b.time && a.time !== b.time ? (a.time < b.time ? 1 : -1) : 0));
  const dayTotal = items.reduce((sum, it) => sum + it.amount, 0);
  const label = calSel
    ? new Date(`${calSel}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'Pick a day';
  el.calDayLabel.textContent = items.length ? `${label} · ${money(dayTotal)}` : label;

  el.calList.replaceChildren(
    ...items.map((it) => {
      const li = document.createElement('li');
      const time = document.createElement('span');
      time.className = 'cal-time';
      time.textContent = it.time ? prettyTime(it.time) : '—';
      const note = document.createElement('span');
      note.className = 'cal-note';
      note.textContent = it.note || catLabel(it.cat);
      const amt = document.createElement('span');
      amt.className = 'cal-amt';
      amt.textContent = money(it.amount);
      li.append(time, note, amt);
      return li;
    })
  );
  el.calEmpty.hidden = items.length > 0;
}

function openCal() {
  calSel = '';
  el.calendar.hidden = false;
  el.monthTrigger.setAttribute('aria-expanded', 'true');
  renderCalendar();
  const target =
    el.calGrid.querySelector('.cal-day-btn[aria-pressed="true"]') || el.calGrid.querySelector('.cal-day-btn');
  if (target) target.focus();
}

function closeCal() {
  el.calendar.hidden = true;
  el.monthTrigger.setAttribute('aria-expanded', 'false');
}

el.monthTrigger.addEventListener('click', () => {
  if (el.calendar.hidden) openCal();
  else closeCal();
});

el.calClose.addEventListener('click', () => {
  closeCal();
  el.monthTrigger.focus();
});

document.addEventListener('click', (event) => {
  if (el.calendar.hidden) return;
  if (event.target.closest('.period-head')) return;
  closeCal();
});

/* ── Boot ──────────────────────────────────────────────── */

/* Hooks for the Android shell (native.js); inert in a browser. */
window.SpentNative = {
  back() {
    if (sheetOpen) {
      closeSheet();
      return true;
    }
    if (!el.calendar.hidden) {
      closeCal();
      return true;
    }
    if (month !== todayMonth()) {
      month = todayMonth();
      render();
      return true;
    }
    return false;
  },
  keyboard(open) {
    if (open && sheetOpen) el.sheet.scrollTo({ top: 0 });
  },
};

renderWhen();
render();
