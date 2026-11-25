'use strict';

const CATS = [
  { id: 'food', label: 'Food' },
  { id: 'transport', label: 'Transport' },
  { id: 'home', label: 'Home' },
  { id: 'health', label: 'Health' },
  { id: 'fun', label: 'Fun' },
  { id: 'other', label: 'Other' },
];

// Custom categories pick one of six muted tones, so they sit next to the fixed
// six instead of introducing a new colour for every word the user types.
const TONES = 6;

const DEFAULT_CURRENCY = { code: 'USD', symbol: '$', decimals: 2 };
const CURRENCIES = [
  { code: 'USD', symbol: '$', decimals: 2 },
  { code: 'EUR', symbol: '€', decimals: 2 },
  { code: 'GBP', symbol: '£', decimals: 2 },
  { code: 'JPY', symbol: '¥', decimals: 0 },
  { code: 'IDR', symbol: 'Rp', decimals: 0 },
  { code: 'INR', symbol: '₹', decimals: 2 },
  { code: 'CAD', symbol: 'CA$', decimals: 2 },
  { code: 'AUD', symbol: 'A$', decimals: 2 },
];

const KEY = 'tally.v1';
const RING = 2 * Math.PI * 32;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const el = {
  page: document.getElementById('page'),
  currencyBtn: document.getElementById('currencyBtn'),
  currencyPop: document.getElementById('currencyPop'),
  currencyClose: document.getElementById('currencyClose'),
  currencyGrid: document.getElementById('currencyGrid'),
  currencyCustomForm: document.getElementById('currencyCustomForm'),
  customSymbol: document.getElementById('customSymbol'),
  dec2Btn: document.getElementById('dec2Btn'),
  dec0Btn: document.getElementById('dec0Btn'),
  swipeViewport: document.getElementById('swipeViewport'),
  swipeTrack: document.getElementById('swipeTrack'),
  prevPanel: document.getElementById('prevPanel'),
  currPanel: document.getElementById('currPanel'),
  nextPanel: document.getElementById('nextPanel'),
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
  momDelta: document.getElementById('momDelta'),
  ring: document.getElementById('ring'),
  ringWrap: document.getElementById('ringWrap'),
  ringPct: document.getElementById('ringPct'),
  budgetPrefix: document.getElementById('budgetPrefix'),
  budget: document.getElementById('budget'),
  left: document.getElementById('left'),
  recurringBtn: document.getElementById('recurringBtn'),
  viewBreakBtn: document.getElementById('viewBreakBtn'),
  viewTrendBtn: document.getElementById('viewTrendBtn'),
  breakdownWrap: document.getElementById('breakdownWrap'),
  trendWrap: document.getElementById('trendWrap'),
  trendBars: document.getElementById('trendBars'),
  trendNote: document.getElementById('trendNote'),
  split: document.getElementById('split'),
  legend: document.getElementById('legend'),
  whereEmpty: document.getElementById('whereEmpty'),
  searchToggle: document.getElementById('searchToggle'),
  sortBtn: document.getElementById('sortBtn'),
  searchRow: document.getElementById('searchRow'),
  searchInput: document.getElementById('searchInput'),
  scopeMonthBtn: document.getElementById('scopeMonthBtn'),
  scopeAllBtn: document.getElementById('scopeAllBtn'),
  searchClear: document.getElementById('searchClear'),
  tabs: document.getElementById('tabs'),
  tabInk: document.getElementById('tabInk'),
  count: document.getElementById('count'),
  items: document.getElementById('items'),
  empty: document.getElementById('empty'),
  prev: document.getElementById('prev'),
  next: document.getElementById('next'),
  form: document.getElementById('form'),
  amountCurrency: document.getElementById('amountCurrency'),
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
  repeatRow: document.getElementById('repeatRow'),
  repeatSeg: document.getElementById('repeatSeg'),
  catChips: document.getElementById('catChips'),
  openSheet: document.getElementById('openSheet'),
  sheet: document.getElementById('sheet'),
  sheetTitle: document.getElementById('sheetTitle'),
  submitBtn: document.querySelector('#form button[type="submit"]'),
  recSheet: document.getElementById('recSheet'),
  recClose: document.getElementById('recClose'),
  recSummary: document.getElementById('recSummary'),
  recList: document.getElementById('recList'),
  recEmpty: document.getElementById('recEmpty'),
  recAddBtn: document.getElementById('recAddBtn'),
  scrim: document.getElementById('scrim'),
  cancel: document.getElementById('cancel'),
  toast: document.getElementById('toast'),
  wordmark: document.getElementById('wordmark'),
  toastText: document.getElementById('toastText'),
  toastAction: document.getElementById('toastAction'),
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
let selectedRepeat = 'never';
let sheetOpen = false;
let recOpen = false;
let lastFocus = null;
let whenISO = todayISO();
let whenMin = nowMinutes();
let whenView = whenISO.slice(0, 7);
let editingId = null;
let whereView = 'breakdown';
let searchQuery = '';
let searchScope = 'month';
let sortBy = 'date';
let customDecimals = 2;

/* ── Storage ───────────────────────────────────────────── */

function sanitizeCurrency(raw) {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_CURRENCY };
  const symbol = typeof raw.symbol === 'string' && raw.symbol.trim() ? raw.symbol.trim().slice(0, 4) : '$';
  const code = typeof raw.code === 'string' && raw.code.trim() ? raw.code.trim().slice(0, 6).toUpperCase() : symbol;
  const decimals = raw.decimals === 0 ? 0 : 2;
  return { code, symbol, decimals };
}

function load() {
  const blank = { items: [], budgets: {}, cats: [], recurring: [], currency: { ...DEFAULT_CURRENCY } };
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
    const cats = Array.isArray(raw.cats)
      ? raw.cats
          .filter(
            (c) =>
              c &&
              typeof c.id === 'string' &&
              /^c-/.test(c.id) &&
              typeof c.label === 'string' &&
              c.label.trim() &&
              !CATS.some((base) => base.id === c.id)
          )
          .map((c) => ({
            id: c.id,
            label: c.label.trim().slice(0, 20),
            tone: Number.isInteger(c.tone) && c.tone >= 1 && c.tone <= TONES ? c.tone : 1,
          }))
      : [];
    const recurring = Array.isArray(raw.recurring)
      ? raw.recurring
          .filter(
            (r) =>
              r &&
              typeof r.id === 'string' &&
              typeof r.amount === 'number' &&
              r.amount > 0 &&
              typeof r.startDate === 'string' &&
              /^\d{4}-\d{2}-\d{2}$/.test(r.startDate) &&
              ['weekly', 'monthly', 'yearly'].includes(r.freq)
          )
          .map((r) => ({
            id: r.id,
            amount: r.amount,
            cat: typeof r.cat === 'string' ? r.cat : 'other',
            note: typeof r.note === 'string' ? r.note.slice(0, 80) : '',
            freq: r.freq,
            startDate: r.startDate,
            time: typeof r.time === 'string' ? r.time : '09:00',
            active: r.active !== false,
            skippedDates: Array.isArray(r.skippedDates) ? r.skippedDates.filter((d) => typeof d === 'string') : [],
          }))
      : [];
    const currency = sanitizeCurrency(raw.currency);
    return { items, budgets, cats, recurring, currency };
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
  const prevM = shiftMonthStr(m, -1);
  return {
    items: [
      { id: 'f1', amount: 4200, cat: 'transport', note: 'Train pass', date: `${m}-14`, time: '07:20' },
      { id: 'f2', amount: 1230, cat: 'food', note: 'Lunch with Sam', date: `${m}-14`, time: '12:45' },
      { id: 'f3', amount: 2450, cat: 'fun', note: 'Cinema', date: `${m}-09`, time: '19:30' },
      { id: 'f4', amount: 8999, cat: 'home', note: 'Desk lamp', date: `${m}-03`, time: '16:10' },
      { id: 'f5', amount: 5400, cat: 'food', note: 'Groceries', date: `${prevM}-21`, time: '18:05' },
      { id: 'f6', amount: 14500, cat: 'home', note: 'Internet & utilities', date: `${prevM}-05`, time: '10:00' },
    ],
    budgets: { [prevM]: 60000, [m]: 60000 },
    cats: [],
    recurring: [],
    currency: { ...DEFAULT_CURRENCY },
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

function cur() {
  return state.currency && state.currency.symbol ? state.currency : DEFAULT_CURRENCY;
}

function money(cents) {
  const c = cur();
  const d = c.decimals === 0 ? 0 : 2;
  const val = d === 0 ? Math.round(cents / 100) : cents / 100;
  const abs = Math.abs(val);
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(abs);
  const space = /^[A-Za-z]{2,}$/.test(c.symbol) ? ' ' : '';
  return `${val < 0 ? '−' : ''}${c.symbol}${space}${formatted}`;
}

function compactMoney(cents) {
  const c = cur();
  const val = Math.round(cents / 100);
  const space = /^[A-Za-z]{2,}$/.test(c.symbol) ? ' ' : '';
  if (val >= 10000) return `${c.symbol}${space}${(val / 1000).toFixed(0)}k`;
  if (val >= 1000) return `${c.symbol}${space}${(val / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${c.symbol}${space}${val}`;
}

function formatInputMoney(cents) {
  const d = cur().decimals === 0 ? 0 : 2;
  const val = d === 0 ? Math.round(cents / 100) : cents / 100;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(val);
}

function syncCurrencyChrome() {
  const c = cur();
  if (el.currencyBtn) el.currencyBtn.textContent = c.code === c.symbol ? c.symbol : `${c.code} ${c.symbol}`;
  if (el.budgetPrefix) el.budgetPrefix.textContent = c.symbol;
  if (el.amountCurrency) el.amountCurrency.textContent = c.symbol;
  if (el.amount) el.amount.placeholder = c.decimals === 0 ? '0' : '0.00';
  if (sheetOpen) fitAmountInput();
}

function fitHeroTotal(node) {
  if (!node) return;
  const host = node.parentElement;
  const maxWidth = host ? host.clientWidth : 0;
  if (maxWidth <= 0) return;

  node.style.fontSize = '';
  const baseSize = parseFloat(window.getComputedStyle(node).fontSize) || 56;
  const needed = node.scrollWidth;
  if (needed <= maxWidth) return;

  let size = Math.max(22, Math.floor(baseSize * ((maxWidth - 2) / needed) * 10) / 10);
  node.style.fontSize = `${size}px`;
  while (node.scrollWidth > maxWidth && size > 22) {
    size = Math.max(22, size - 1);
    node.style.fontSize = `${size}px`;
  }
}

function fitAllHeroTotals() {
  document.querySelectorAll('.figure-total').forEach(fitHeroTotal);
}

function renderHeroTotal(node, cents, deferFit = false) {
  const c = cur();
  const d = c.decimals === 0 ? 0 : 2;
  const val = d === 0 ? Math.round(cents / 100) : cents / 100;
  const abs = Math.abs(val);
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(abs);
  const curSpan = document.createElement('span');
  curSpan.className = 'total-cur' + (/^[A-Za-z]{2,}$/.test(c.symbol) ? ' spaced' : '');
  curSpan.textContent = `${val < 0 ? '−' : ''}${c.symbol}`;
  const numSpan = document.createElement('span');
  numSpan.className = 'total-num';
  numSpan.textContent = formatted;
  node.replaceChildren(curSpan, numSpan);
  node.setAttribute('aria-label', money(cents));
  if (!deferFit) fitHeroTotal(node);
}

let amountMirror = null;

function measureInputTextWidth(input, text, fontSizePx) {
  if (!amountMirror) {
    amountMirror = document.createElement('span');
    amountMirror.setAttribute('aria-hidden', 'true');
    Object.assign(amountMirror.style, {
      position: 'fixed',
      top: '-9999px',
      left: '-9999px',
      visibility: 'hidden',
      whiteSpace: 'pre',
      pointerEvents: 'none',
    });
    document.body.append(amountMirror);
  }
  const cs = window.getComputedStyle(input);
  amountMirror.style.fontFamily = cs.fontFamily;
  amountMirror.style.fontWeight = cs.fontWeight;
  amountMirror.style.letterSpacing = cs.letterSpacing;
  amountMirror.style.fontVariantNumeric = cs.fontVariantNumeric;
  amountMirror.style.fontSize = `${fontSizePx}px`;
  amountMirror.textContent = text;
  return amountMirror.getBoundingClientRect().width;
}

function fitAmountInput() {
  if (!el.amount || el.sheet.hidden) return;
  const line = el.amount.parentElement;
  const lineWidth = line ? line.clientWidth : 0;
  if (lineWidth <= 0) return;

  const baseSize = 46;
  const minSize = 22;
  const text = el.amount.value || el.amount.placeholder || '0.00';

  const measureFits = (size) => {
    if (el.amountCurrency) {
      el.amountCurrency.style.fontSize = size === baseSize ? '' : `${Math.round(size * 0.65)}px`;
    }
    const curW = el.amountCurrency ? el.amountCurrency.getBoundingClientRect().width : 0;
    const avail = Math.max(60, lineWidth - curW - 10);
    return measureInputTextWidth(el.amount, text, size) <= avail;
  };

  if (measureFits(baseSize)) {
    el.amount.style.fontSize = '';
    if (el.amountCurrency) el.amountCurrency.style.fontSize = '';
    return;
  }

  const curBaseW = el.amountCurrency ? el.amountCurrency.getBoundingClientRect().width : 0;
  const approxAvail = Math.max(60, lineWidth - curBaseW - 10);
  const baseMeasured = measureInputTextWidth(el.amount, text, baseSize);
  let size = Math.max(minSize, Math.floor(baseSize * (approxAvail / baseMeasured) * 10) / 10);

  while (!measureFits(size) && size > minSize) {
    size = Math.max(minSize, size - 1);
  }
  el.amount.style.fontSize = `${size}px`;
}

function allCats() {
  return (state.cats || []).length ? CATS.concat(state.cats) : CATS;
}

function catInfo(id) {
  return allCats().find((c) => c.id === id) || null;
}

function catLabel(id) {
  const found = catInfo(id);
  return found ? found.label : 'Other';
}

// A category's colour lives in CSS (--cat); custom ones carry their tone along.
function paintCat(node, id) {
  node.dataset.cat = id;
  const found = catInfo(id);
  if (found && found.tone) node.dataset.tone = String(found.tone);
  else delete node.dataset.tone;
}

function prettyDate(iso, includeYear = false) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {}),
  });
}

function hhmmToMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
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
  let raw = String(value).trim().replace(/[\s\u00a0']/g, '');
  raw = raw.replace(/[^0-9.,]/g, '');
  if (!raw) return NaN;

  if (raw.includes(',') && !raw.includes('.')) {
    // A comma alone only counts as a thousands separator: 1,234 is fine, 12,50 is not.
    if (!/^\d{1,3}(,\d{3})+$/.test(raw)) return NaN;
    raw = raw.replace(/,/g, '');
  } else if (raw.includes(',') && raw.includes('.')) {
    // Both present: whichever comes last is the decimal mark.
    const decimal = raw.lastIndexOf('.') > raw.lastIndexOf(',') ? '.' : ',';
    const at = raw.lastIndexOf(decimal);
    raw = raw.slice(0, at).replace(/[.,]/g, '') + raw.slice(at).replace(',', '.');
  } else if ((raw.match(/\./g) || []).length > 1) {
    const at = raw.lastIndexOf('.');
    raw = raw.slice(0, at).replace(/\./g, '') + raw.slice(at);
  }

  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? Math.round(n * 100) : NaN;
}

function bindCalculatorInput(input, getDecimals, onFormatted) {
  let prevFormatted = input.value || '';

  const formatAndSet = (raw, selStart, inputType) => {
    const decimals = getDecimals();
    let work = String(raw || '');
    let cursor = typeof selStart === 'number' ? selStart : work.length;

    if (
      prevFormatted &&
      (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward' || !inputType) &&
      work.length === prevFormatted.length - 1 &&
      cursor >= 0 &&
      prevFormatted[cursor] === ',' &&
      work === prevFormatted.slice(0, cursor) + prevFormatted.slice(cursor + 1)
    ) {
      if (inputType === 'deleteContentForward') {
        if (cursor < work.length) work = work.slice(0, cursor) + work.slice(cursor + 1);
      } else if (cursor > 0) {
        work = work.slice(0, cursor - 1) + work.slice(cursor);
        cursor -= 1;
      }
    }

    let sigBefore = 0;
    let seenDotBefore = false;
    for (let i = 0; i < cursor && i < work.length; i++) {
      const ch = work[i];
      if (ch >= '0' && ch <= '9') {
        sigBefore++;
      } else if (ch === '.' && decimals > 0 && !seenDotBefore) {
        seenDotBefore = true;
        sigBefore++;
      }
    }

    let intDigits = '';
    let decDigits = '';
    let hasDot = false;
    for (let i = 0; i < work.length; i++) {
      const ch = work[i];
      if (ch >= '0' && ch <= '9') {
        if (hasDot) {
          if (decDigits.length < decimals) decDigits += ch;
        } else {
          intDigits += ch;
        }
      } else if (ch === '.' && decimals > 0 && !hasDot) {
        hasDot = true;
      }
    }

    const rawIntLen = intDigits.length;
    if (intDigits.length > 1) {
      intDigits = intDigits.replace(/^0+/, '') || '0';
    }
    const trimmedLeadingZeros = rawIntLen - intDigits.length;

    if (hasDot && intDigits === '') {
      intDigits = '0';
      if (seenDotBefore) sigBefore += 1;
    } else if (trimmedLeadingZeros > 0 && sigBefore > 0) {
      const intBeforeCursor = Math.min(sigBefore, rawIntLen);
      const removedBeforeCursor = Math.min(trimmedLeadingZeros, intBeforeCursor);
      sigBefore = Math.max(0, sigBefore - removedBeforeCursor);
    }

    const groupedInt = intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formatted = hasDot ? `${groupedInt}.${decDigits}` : groupedInt;

    let newCursor = 0;
    if (sigBefore > 0) {
      let seen = 0;
      for (let i = 0; i < formatted.length; i++) {
        const ch = formatted[i];
        if ((ch >= '0' && ch <= '9') || ch === '.') {
          seen++;
          if (seen === sigBefore) {
            newCursor = i + 1;
            break;
          }
        }
      }
      if (seen < sigBefore) newCursor = formatted.length;
    }

    input.value = formatted;
    prevFormatted = formatted;
    if (document.activeElement === input) {
      try {
        input.setSelectionRange(newCursor, newCursor);
      } catch {
        /* ignore unsupported input types */
      }
    }
    if (onFormatted) onFormatted(formatted);
  };

  input.addEventListener('input', (event) => {
    if (event.isComposing) return;
    formatAndSet(input.value, input.selectionStart, event.inputType);
  });

  input.addEventListener('compositionend', () => {
    formatAndSet(input.value, input.selectionStart, 'insertCompositionText');
  });

  input.addEventListener('blur', () => {
    if (input.value.endsWith('.')) {
      input.value = input.value.slice(0, -1);
    }
    prevFormatted = input.value;
  });

  return () => {
    prevFormatted = input.value || '';
  };
}

let toastTimer = 0;
let toastAction = null;

function toast(message, actionLabel, onAction) {
  el.toastText.textContent = message;
  toastAction = onAction || null;
  el.toastAction.hidden = !actionLabel;
  if (actionLabel) el.toastAction.textContent = actionLabel;
  el.toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(dismissToast, actionLabel ? 5200 : 2400);
}

function dismissToast() {
  el.toast.classList.remove('show');
  toastAction = null;
  el.toastAction.hidden = true;
}

el.toastAction.addEventListener('click', () => {
  const run = toastAction;
  dismissToast();
  if (run) run();
});

/* ── Render ────────────────────────────────────────────── */

// A month without its own budget keeps the last one that was set before it.
function budgetFor(key) {
  if (Object.prototype.hasOwnProperty.call(state.budgets, key)) return Number(state.budgets[key]) || 0;
  const earlier = Object.keys(state.budgets).filter((k) => k < key && state.budgets[k]).sort();
  return earlier.length ? Number(state.budgets[earlier[earlier.length - 1]]) : 0;
}

function paintChips() {
  el.catChips.querySelectorAll('.chip').forEach((chip) => {
    chip.setAttribute('aria-pressed', chip.dataset.cat === selectedCat ? 'true' : 'false');
  });
}

function shiftMonthStr(m, delta) {
  const [y, mo] = m.split('-').map(Number);
  const d = new Date(y, mo - 1 + delta, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

function sortExpenses(list) {
  return list.sort((a, b) => {
    if (sortBy === 'high' && a.amount !== b.amount) return b.amount - a.amount;
    if (sortBy === 'low' && a.amount !== b.amount) return a.amount - b.amount;
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (a.time && b.time && a.time !== b.time) return a.time < b.time ? 1 : -1;
    if (a.time && !b.time) return -1;
    if (!a.time && b.time) return 1;
    return b.id.localeCompare(a.id);
  });
}

function computeMoM(targetMonth, total, byCat) {
  const prevMonth = shiftMonthStr(targetMonth, -1);
  const prevItems = state.items.filter((it) => it.date.startsWith(prevMonth));
  const prevTotal = prevItems.reduce((sum, it) => sum + it.amount, 0);
  if (!prevTotal) return '';
  const prevShort = new Date(`${prevMonth}-01T00:00:00`).toLocaleDateString('en-US', { month: 'short' });
  if (total === 0) return `Last month (${prevShort}): ${money(prevTotal)}`;
  const diff = total - prevTotal;
  const pct = Math.round((Math.abs(diff) / prevTotal) * 100);
  if (diff === 0) return `Same as ${prevShort} (${money(prevTotal)})`;
  return `${pct}% ${diff < 0 ? 'less' : 'more'} than ${prevShort} · ${diff > 0 ? '+' : '−'}${money(Math.abs(diff))}`;
}

function computeMonthData(targetMonth, applySearch = false) {
  const label = monthLabel(targetMonth);
  const monthItems = state.items.filter((it) => it.date.startsWith(targetMonth));
  const total = monthItems.reduce((sum, it) => sum + it.amount, 0);

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

  const days = targetMonth === todayMonth() ? new Date().getDate() : daysIn(targetMonth);
  const perDay = monthItems.length ? Math.round(total / days) : 0;
  const lede = monthItems.length
    ? `${catLabel(topCat)} leads · ${money(perDay)} a day · ${monthItems.length} ${monthItems.length === 1 ? 'entry' : 'entries'}`
    : `Nothing logged in ${label}`;

  const momText = computeMoM(targetMonth, total, byCat);

  const budget = budgetFor(targetMonth);
  const ratio = budget ? total / budget : 0;
  const pct = budget ? Math.round(ratio * 100) : 0;
  const leftText = !budget
    ? 'No budget set'
    : total > budget
      ? `${money(total - budget)} over`
      : `${money(budget - total)} left`;

  const q = applySearch ? searchQuery.trim().toLowerCase() : '';
  const searchActive = applySearch && (Boolean(q) || (!el.searchRow.hidden && searchScope === 'all'));
  const pool = searchActive && searchScope === 'all' ? state.items : monthItems;
  let shown = filter === 'all' ? pool.slice() : pool.filter((it) => it.cat === filter);

  if (q) {
    shown = shown.filter((it) => {
      const note = (it.note || '').toLowerCase();
      const cat = catLabel(it.cat).toLowerCase();
      const amt = money(it.amount).toLowerCase();
      const rawAmt = formatInputMoney(it.amount);
      const plainAmt = rawAmt.replace(/,/g, '');
      const dateStr = `${it.date} ${prettyDate(it.date, true).toLowerCase()}`;
      return note.includes(q) || cat.includes(q) || amt.includes(q) || rawAmt.includes(q) || plainAmt.includes(q) || dateStr.includes(q);
    });
  }

  sortExpenses(shown);
  const shownSum = shown.reduce((sum, it) => sum + it.amount, 0);

  return {
    label,
    monthItems,
    shown,
    shownSum,
    searchActive,
    isAllScope: searchActive && searchScope === 'all',
    total,
    byCat,
    lede,
    momText,
    budget,
    ratio,
    pct,
    leftText,
  };
}

let previewRaf = 0;

function render(opts = {}) {
  const instant = Boolean(opts && opts.instant);
  const deferPreviews = Boolean(opts && opts.deferPreviews);
  disarmRow();
  syncCurrencyChrome();
  const data = computeMonthData(month, true);
  el.monthLabel.textContent = data.label;
  el.next.disabled = month >= todayMonth();

  renderTabs();

  renderHeroTotal(el.total, data.total);
  el.lede.textContent = data.lede;
  el.momDelta.textContent = data.momText;
  el.momDelta.hidden = !data.momText;

  if (document.activeElement !== el.budget) {
    el.budget.value = data.budget ? formatInputMoney(data.budget) : '';
    syncBudgetInput();
  }

  if (instant) el.ring.style.transition = 'none';
  el.ring.style.strokeDashoffset = String(RING * (1 - Math.min(1, data.ratio)));
  if (instant) {
    void el.ring.getBoundingClientRect();
    el.ring.style.transition = '';
  }

  el.ringWrap.classList.toggle('over', data.budget > 0 && data.total > data.budget);
  el.ringPct.textContent = data.budget ? `${data.pct}%` : '—';
  el.ringWrap.setAttribute(
    'aria-label',
    data.budget
      ? `${money(data.total)} of the ${money(data.budget)} budget spent, ${data.pct} percent${data.total > data.budget ? ', over budget' : ''}`
      : `No budget set. ${money(data.total)} spent`
  );
  el.left.textContent = data.leftText;

  const activeRecCount = (state.recurring || []).filter((r) => r.active).length;
  el.recurringBtn.textContent = activeRecCount ? `Recurring · ${activeRecCount}` : 'Recurring';

  renderWhereSection(data, instant);

  el.items.replaceChildren(...data.shown.map((it) => row(it, data.isAllScope)));
  el.empty.hidden = data.shown.length > 0;
  el.empty.textContent = data.searchActive
    ? 'No matching expenses.'
    : data.monthItems.length && !data.shown.length
      ? 'Nothing in this category this month.'
      : 'No expenses yet. Add the first one.';

  if (data.searchActive) {
    el.count.textContent = `${data.shown.length} ${data.shown.length === 1 ? 'match' : 'matches'} · ${money(data.shownSum)}`;
  } else {
    el.count.textContent = filter === 'all'
      ? `${data.monthItems.length} ${data.monthItems.length === 1 ? 'entry' : 'entries'}`
      : `${data.shown.length} of ${data.monthItems.length}`;
  }

  el.sortBtn.textContent = sortBy === 'date' ? 'Newest' : sortBy === 'high' ? 'Highest' : 'Lowest';
  el.scopeMonthBtn.setAttribute('aria-pressed', searchScope === 'month' ? 'true' : 'false');
  el.scopeAllBtn.setAttribute('aria-pressed', searchScope === 'all' ? 'true' : 'false');
  el.searchClear.hidden = !searchQuery;

  el.tabs.querySelectorAll('.tab').forEach((tab) => {
    tab.setAttribute('aria-pressed', tab.dataset.filter === filter ? 'true' : 'false');
  });
  paintChips();

  moveInk();
  window.cancelAnimationFrame(previewRaf);
  if (deferPreviews) {
    previewRaf = window.requestAnimationFrame(() => {
      renderPreviewPanel(el.prevPanel, shiftMonthStr(month, -1));
      renderPreviewPanel(el.nextPanel, shiftMonthStr(month, 1));
    });
  } else {
    renderPreviewPanel(el.prevPanel, shiftMonthStr(month, -1));
    renderPreviewPanel(el.nextPanel, shiftMonthStr(month, 1));
  }
  if (!el.calendar.hidden) renderCalendar();
  if (recOpen) renderRecurringSheet();
}

function renderWhereSection(data, instant) {
  const isTrend = whereView === 'trends';
  el.viewBreakBtn.setAttribute('aria-pressed', isTrend ? 'false' : 'true');
  el.viewTrendBtn.setAttribute('aria-pressed', isTrend ? 'true' : 'false');
  el.breakdownWrap.hidden = isTrend;
  el.trendWrap.hidden = !isTrend;
  if (isTrend) {
    renderTrends(data.byCat);
  } else {
    renderBreakdown(data.byCat, el.split, el.legend, el.whereEmpty, instant);
  }
}

function renderTrends(currByCat) {
  const months = [];
  for (let i = -5; i <= 0; i++) {
    months.push(shiftMonthStr(month, i));
  }

  const series = months.map((m) => {
    const mItems = state.items.filter((it) => it.date.startsWith(m));
    const total = mItems.reduce((s, it) => s + it.amount, 0);
    const budget = budgetFor(m);
    const short = new Date(`${m}-01T00:00:00`).toLocaleDateString('en-US', { month: 'short' });
    return { m, short, total, budget, over: budget > 0 && total > budget };
  });

  const maxVal = Math.max(1, ...series.map((s) => s.total));
  const frag = document.createDocumentFragment();

  for (const s of series) {
    const col = document.createElement('button');
    col.type = 'button';
    col.className = 'trend-col' + (s.over ? ' over' : '');
    if (s.m === month) col.setAttribute('aria-current', 'true');
    col.setAttribute('aria-label', `${monthLabel(s.m)}: ${money(s.total)}`);

    const val = document.createElement('span');
    val.className = 'trend-val';
    val.textContent = s.total ? compactMoney(s.total) : '—';

    const track = document.createElement('span');
    track.className = 'trend-track';
    const fill = document.createElement('span');
    fill.className = 'trend-fill';
    const h = s.total ? Math.max(4, Math.round((s.total / maxVal) * 54)) : 2;
    fill.style.height = `${h}px`;
    track.append(fill);

    const lbl = document.createElement('span');
    lbl.className = 'trend-lbl';
    lbl.textContent = s.short;

    col.append(val, track, lbl);
    col.addEventListener('click', () => jumpToMonth(s.m));
    frag.append(col);
  }

  el.trendBars.replaceChildren(frag);

  const nonZero = series.filter((s) => s.total > 0);
  const avg = nonZero.length ? Math.round(nonZero.reduce((sum, s) => sum + s.total, 0) / series.length) : 0;

  const prevMonth = shiftMonthStr(month, -1);
  const prevByCat = new Map();
  for (const it of state.items) {
    if (it.date.startsWith(prevMonth)) prevByCat.set(it.cat, (prevByCat.get(it.cat) || 0) + it.amount);
  }
  let topMover = '';
  let topDelta = 0;
  for (const c of allCats()) {
    const d = (currByCat.get(c.id) || 0) - (prevByCat.get(c.id) || 0);
    if (Math.abs(d) > Math.abs(topDelta)) {
      topDelta = d;
      topMover = c.label;
    }
  }

  const prevShort = new Date(`${prevMonth}-01T00:00:00`).toLocaleDateString('en-US', { month: 'short' });
  const parts = [`6-mo avg ${money(avg)}`];
  if (topMover && topDelta !== 0) {
    parts.push(`${topMover} ${topDelta > 0 ? '+' : '−'}${money(Math.abs(topDelta))} vs ${prevShort}`);
  }
  el.trendNote.textContent = parts.join(' · ');
}

function renderBreakdown(byCat, splitEl, legendEl, emptyEl, instant = false) {
  const rows = [...byCat]
    .map(([cat, amt]) => ({ cat, amt }))
    .filter((r) => r.amt > 0)
    .sort((a, b) => b.amt - a.amt);

  splitEl.replaceChildren();
  legendEl.replaceChildren();
  splitEl.hidden = rows.length === 0;
  legendEl.hidden = rows.length === 0;
  emptyEl.hidden = rows.length > 0;
  if (!rows.length) return;

  for (const r of rows) {
    const segment = document.createElement('span');
    segment.className = 'segpart';
    paintCat(segment, r.cat);
    if (instant) {
      segment.style.transition = 'none';
      segment.style.flexGrow = String(r.amt);
    } else {
      segment.style.flexGrow = '0';
      requestAnimationFrame(() => {
        segment.style.flexGrow = String(r.amt);
      });
    }
    splitEl.append(segment);

    const li = document.createElement('li');
    paintCat(li, r.cat);
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.textContent = catLabel(r.cat);
    const amount = document.createElement('b');
    amount.textContent = money(r.amt);
    li.append(dot, label, amount);
    legendEl.append(li);
  }
}

function renderPreviewPanel(panel, targetMonth) {
  if (!panel) return;
  if (targetMonth > todayMonth()) {
    panel.replaceChildren();
    return;
  }

  const data = computeMonthData(targetMonth, false);
  const frag = document.createDocumentFragment();

  const periodSec = document.createElement('section');
  periodSec.className = 'period';

  const fig = document.createElement('div');
  fig.className = 'figure';

  const figMain = document.createElement('div');
  figMain.className = 'figure-main';
  const figLabel = document.createElement('p');
  figLabel.className = 'figure-label';
  figLabel.textContent = 'This month';
  const figTotal = document.createElement('p');
  figTotal.className = 'figure-total';
  renderHeroTotal(figTotal, data.total, true);
  const figLede = document.createElement('p');
  figLede.className = 'figure-lede';
  figLede.textContent = data.lede;
  figMain.append(figLabel, figTotal, figLede);
  if (data.momText) {
    const mom = document.createElement('p');
    mom.className = 'figure-mom';
    mom.textContent = data.momText;
    figMain.append(mom);
  }

  const ringWrap = document.createElement('div');
  ringWrap.className = 'ring' + (data.budget > 0 && data.total > data.budget ? ' over' : '');
  ringWrap.innerHTML =
    '<svg viewBox="0 0 80 80" aria-hidden="true" focusable="false">' +
    '<circle class="ring-track" cx="40" cy="40" r="32"></circle>' +
    '<circle class="ring-fill" cx="40" cy="40" r="32"></circle>' +
    '</svg>';
  const ringFill = ringWrap.querySelector('.ring-fill');
  ringFill.style.transition = 'none';
  ringFill.style.strokeDashoffset = String(RING * (1 - Math.min(1, data.ratio)));
  const ringNote = document.createElement('span');
  ringNote.className = 'ring-note';
  ringNote.textContent = data.budget ? `${data.pct}%` : '—';
  ringWrap.append(ringNote);

  fig.append(figMain, ringWrap);

  const budgetLine = document.createElement('div');
  budgetLine.className = 'budgetline';
  const budgetRow = document.createElement('div');
  budgetRow.className = 'budget-row';
  const budgetLabel = document.createElement('span');
  budgetLabel.style.fontSize = '13px';
  budgetLabel.style.color = 'var(--muted)';
  budgetLabel.textContent = 'Monthly budget';
  const budgetField = document.createElement('div');
  budgetField.className = 'budget-field';
  const dollar = document.createElement('span');
  dollar.textContent = cur().symbol;
  const budgetInput = document.createElement('input');
  budgetInput.type = 'text';
  budgetInput.readOnly = true;
  budgetInput.tabIndex = -1;
  budgetInput.placeholder = '—';
  budgetInput.value = data.budget ? formatInputMoney(data.budget) : '';
  budgetField.append(dollar, budgetInput);
  budgetRow.append(budgetLabel, budgetField);
  const budgetSub = document.createElement('div');
  budgetSub.className = 'budget-sub';
  const budgetLeft = document.createElement('p');
  budgetLeft.className = 'budget-left';
  budgetLeft.textContent = data.leftText;
  budgetSub.append(budgetLeft);
  budgetLine.append(budgetRow, budgetSub);

  periodSec.append(fig, budgetLine);

  const whereSec = document.createElement('section');
  whereSec.className = 'where';
  const whereTitle = document.createElement('h2');
  whereTitle.className = 'section-label';
  whereTitle.textContent = 'Where it went';
  const splitEl = document.createElement('div');
  splitEl.className = 'split';
  const legendEl = document.createElement('ul');
  legendEl.className = 'legend';
  const whereEmpty = document.createElement('p');
  whereEmpty.className = 'muted-line';
  whereEmpty.textContent = 'Nothing to break down yet.';
  renderBreakdown(data.byCat, splitEl, legendEl, whereEmpty, true);
  whereSec.append(whereTitle, splitEl, legendEl, whereEmpty);

  const listSec = document.createElement('section');
  listSec.className = 'listing';
  const listHead = document.createElement('div');
  listHead.className = 'listing-head';
  const listTitle = document.createElement('h2');
  listTitle.className = 'section-label';
  listTitle.textContent = 'Expenses';
  const listCount = document.createElement('p');
  listCount.className = 'listing-count';
  listCount.textContent = filter === 'all'
    ? `${data.monthItems.length} ${data.monthItems.length === 1 ? 'entry' : 'entries'}`
    : `${data.shown.length} of ${data.monthItems.length}`;
  listHead.append(listTitle, listCount);

  const tabsEl = document.createElement('div');
  tabsEl.className = 'tabs';
  for (const f of [{ id: 'all', label: 'All' }, ...allCats()]) {
    const tab = document.createElement('span');
    tab.className = 'tab';
    tab.textContent = f.label;
    tab.setAttribute('aria-pressed', f.id === filter ? 'true' : 'false');
    if (f.id === filter) {
      tab.style.borderBottom = '1.5px solid var(--tab-ink)';
      tab.style.marginBottom = '-1px';
    }
    tabsEl.append(tab);
  }

  const itemsEl = document.createElement('ul');
  itemsEl.className = 'items';
  itemsEl.append(...data.shown.map((it) => {
    const li = row(it, false);
    li.tabIndex = -1;
    const del = li.querySelector('.del');
    if (del) del.tabIndex = -1;
    return li;
  }));

  const emptyEl = document.createElement('p');
  emptyEl.className = 'empty';
  emptyEl.hidden = data.shown.length > 0;
  emptyEl.textContent =
    data.monthItems.length && !data.shown.length
      ? 'Nothing in this category this month.'
      : 'No expenses yet. Add the first one.';

  listSec.append(listHead, tabsEl, itemsEl, emptyEl);

  frag.append(periodSec, whereSec, listSec);
  panel.replaceChildren(frag);
  fitHeroTotal(figTotal);
}

function row(it, includeYear = false) {
  const li = document.createElement('li');
  li.className = 'item';
  paintCat(li, it.cat);
  li.dataset.id = it.id;
  li.tabIndex = 0;
  li.setAttribute('aria-label', `Edit ${it.note || catLabel(it.cat)}, ${money(it.amount)}`);

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
  const recTag = it.recurringId ? ' · Recurring' : '';
  sub.textContent = `${catLabel(it.cat)} · ${prettyDate(it.date, includeYear)}${it.time ? ` · ${prettyTime(it.time)}` : ''}${recTag}`;
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

let tabsKey = '';

// Tabs are rebuilt only when the category set changes: rebuilding on every
// render would throw away focus and restart the ink transition.
function renderTabs() {
  const cats = allCats();
  const key = cats.map((c) => c.id + ':' + c.label).join('|');
  if (key === tabsKey) return;
  tabsKey = key;

  const frag = document.createDocumentFragment();
  for (const f of [{ id: 'all', label: 'All' }, ...cats]) {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tab';
    tab.dataset.filter = f.id;
    tab.textContent = f.label;
    tab.setAttribute('aria-pressed', f.id === filter ? 'true' : 'false');
    tab.addEventListener('click', () => {
      filter = f.id;
      render();
    });
    frag.append(tab);
  }
  // The ink is absolutely positioned, so it can stay at the end of the row.
  el.tabs.replaceChildren(frag, el.tabInk);
}

function renderChips() {
  const frag = document.createDocumentFragment();
  for (const cat of allCats()) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.dataset.cat = cat.id;
    chip.textContent = cat.label;
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', () => {
      selectedCat = cat.id;
      paintChips();
    });
    frag.append(chip);
  }

  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'chip chip-new';
  add.textContent = '+ New';
  add.setAttribute('aria-label', 'New category');
  add.addEventListener('click', openNewCat);
  frag.append(add);

  el.catChips.replaceChildren(frag);
  paintChips();
}

/* ── Custom categories ─────────────────────────────────── */

function nextTone() {
  const used = new Map();
  for (const c of state.cats) used.set(c.tone, (used.get(c.tone) || 0) + 1);
  let best = 1;
  for (let t = 1; t <= TONES; t++) {
    if ((used.get(t) || 0) < (used.get(best) || 0)) best = t;
  }
  return best;
}

function openNewCat() {
  if (el.catChips.querySelector('.chip-form')) return;
  el.catChips.querySelectorAll('.chip').forEach((chip) => {
    chip.hidden = true;
  });

  const form = document.createElement('form');
  form.className = 'chip-form';
  form.noValidate = true;

  const input = document.createElement('input');
  input.className = 'chip-input';
  input.type = 'text';
  input.maxLength = 20;
  input.autocomplete = 'off';
  input.placeholder = 'Name it';
  input.setAttribute('aria-label', 'New category name');

  const confirm = document.createElement('button');
  confirm.type = 'submit';
  confirm.className = 'chip-confirm';
  confirm.textContent = 'Add';

  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'chip-cancel';
  cancel.textContent = 'Cancel';
  cancel.addEventListener('click', () => closeNewCat(true));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    addCategory(input.value);
  });
  form.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    closeNewCat(true);
  });

  form.append(input, confirm, cancel);
  el.catChips.append(form);
  input.focus();
}

function closeNewCat(focusAdd) {
  const form = el.catChips.querySelector('.chip-form');
  if (!form) return;
  form.remove();
  el.catChips.querySelectorAll('.chip').forEach((chip) => {
    chip.hidden = false;
  });
  if (focusAdd) {
    const add = el.catChips.querySelector('.chip-new');
    if (add) add.focus();
  }
}

function addCategory(value) {
  const label = String(value).trim().replace(/\s+/g, ' ').slice(0, 20);
  if (!label) {
    closeNewCat(true);
    return null;
  }

  const existing = allCats().find((c) => c.label.toLowerCase() === label.toLowerCase());
  closeNewCat(false);

  if (existing) {
    selectedCat = existing.id;
    paintChips();
    return existing.id;
  }

  const cat = { id: `c-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`, label, tone: nextTone() };
  state.cats.push(cat);
  selectedCat = cat.id;
  save();
  renderChips();
  render();
  return cat.id;
}

/* ── Month paging & instant interruptible swipe ────────── */

let swipe = {
  source: null,
  pointerId: null,
  startX: 0,
  startY: 0,
  rawDx: 0,
  dx: 0,
  axisLock: null,
  samples: [],
  suppressClick: false,
  suppressTimer: 0,
};

let pendingAnim = null;

function viewportWidth() {
  return el.swipeViewport ? el.swipeViewport.clientWidth || window.innerWidth : window.innerWidth;
}

function setTrackX(dx, animate) {
  if (!el.swipeTrack) return;
  const w = viewportWidth();
  el.swipeTrack.classList.toggle('animating', Boolean(animate) && !reduced);
  el.swipeTrack.style.transform = `translate3d(${-w + dx}px, 0, 0)`;
}

function resetTrack() {
  if (!el.swipeTrack) return;
  swipe.dx = 0;
  swipe.rawDx = 0;
  el.swipeTrack.classList.remove('animating', 'dragging');
  el.swipeTrack.style.transform = 'translate3d(calc(-100% / 3), 0, 0)';
}

function flushPendingAnimation() {
  if (!pendingAnim) return;
  const finish = pendingAnim.finish;
  pendingAnim = null;
  finish(true);
}

function jumpToMonth(target) {
  if (!target || target > todayMonth() || target === month) return;
  flushPendingAnimation();
  month = target;
  render({ instant: true });
  resetTrack();
}

function animateToMonth(delta) {
  flushPendingAnimation();

  const w = viewportWidth();
  const target = delta !== 0 ? shiftMonthStr(month, delta) : month;
  if (delta > 0 && target > todayMonth()) delta = 0;

  if (reduced) {
    if (delta !== 0) {
      month = target;
      render({ instant: true });
    }
    resetTrack();
    return;
  }

  el.swipeTrack.classList.remove('dragging');

  if (delta === 0) {
    if (swipe.dx === 0) {
      resetTrack();
      return;
    }
    el.swipeTrack.classList.add('animating');
    void el.swipeTrack.offsetWidth;
    setTrackX(0, true);
  } else {
    el.monthLabel.textContent = monthLabel(target);
    el.next.disabled = target >= todayMonth();
    if (!el.calendar.hidden) closeCal();

    if (swipe.dx === 0) setTrackX(0, false);
    el.swipeTrack.classList.add('animating');
    void el.swipeTrack.offsetWidth;
    setTrackX(delta > 0 ? -w : w, true);
  }

  let done = false;
  let timer = 0;
  const finish = (interrupted) => {
    if (done) return;
    done = true;
    el.swipeTrack.removeEventListener('transitionend', onEnd);
    window.clearTimeout(timer);
    if (pendingAnim && pendingAnim.finish === finish) pendingAnim = null;

    if (delta !== 0) {
      month = target;
      render({ instant: true, deferPreviews: !interrupted });
    }
    resetTrack();
  };

  const onEnd = (event) => {
    if (event.target === el.swipeTrack && event.propertyName === 'transform') finish(false);
  };

  el.swipeTrack.addEventListener('transitionend', onEnd);
  timer = window.setTimeout(() => finish(false), 185);
  pendingAnim = { target, finish };
}

function shiftMonth(delta) {
  if (swipe.axisLock === 'x') return;
  if (delta > 0 && month >= todayMonth()) return;
  animateToMonth(delta);
}

function shouldIgnoreSwipeStart(target) {
  if (sheetOpen || recOpen || !el.calendar.hidden || !el.currencyPop.hidden) return true;
  if (!target || typeof target.closest !== 'function') return false;
  if (target.closest('input, textarea, select, [contenteditable="true"]')) return true;
  if (target.closest('.del, .keep, .cal, .trend-col')) return true;
  const tabs = target.closest('.tabs');
  if (tabs && tabs.scrollWidth > tabs.clientWidth + 1) return true;
  return false;
}

function applyResistance(rawDx) {
  if (month >= todayMonth() && rawDx < 0) return rawDx * 0.25;
  return rawDx;
}

function pushSample(x) {
  const now = performance.now();
  swipe.samples.push({ x, t: now });
  const cutoff = now - 120;
  while (swipe.samples.length > 2 && swipe.samples[0].t < cutoff) {
    swipe.samples.shift();
  }
}

function releaseVelocity() {
  const s = swipe.samples;
  if (s.length < 2) return 0;
  const first = s[0];
  const last = s[s.length - 1];
  const dt = last.t - first.t;
  return dt > 0 ? (last.x - first.x) / dt : 0;
}

function startGesture(source, pointerId, clientX, clientY, target) {
  if (shouldIgnoreSwipeStart(target)) return false;
  flushPendingAnimation();
  swipe.source = source;
  swipe.pointerId = pointerId;
  swipe.startX = clientX;
  swipe.startY = clientY;
  swipe.rawDx = 0;
  swipe.dx = 0;
  swipe.axisLock = null;
  swipe.samples = [{ x: clientX, t: performance.now() }];
  return true;
}

function moveGesture(clientX, clientY, onHorizontalLock) {
  const rawDx = clientX - swipe.startX;
  const rawDy = clientY - swipe.startY;

  if (swipe.axisLock === null) {
    if (Math.hypot(rawDx, rawDy) < 8) return false;
    if (Math.abs(rawDx) > Math.abs(rawDy)) {
      swipe.axisLock = 'x';
      el.swipeTrack.classList.remove('animating');
      el.swipeTrack.classList.add('dragging');
      disarmRow();
      if (onHorizontalLock) onHorizontalLock();
    } else {
      swipe.axisLock = 'y';
      swipe.source = null;
      swipe.pointerId = null;
      return false;
    }
  }

  if (swipe.axisLock !== 'x') return false;

  swipe.rawDx = rawDx;
  swipe.dx = applyResistance(rawDx);
  pushSample(clientX);
  setTrackX(swipe.dx, false);
  return true;
}

function endGesture(cancelled = false) {
  const wasHorizontal = swipe.axisLock === 'x';
  const rawDx = swipe.rawDx;
  const vx = releaseVelocity();

  swipe.source = null;
  swipe.pointerId = null;
  swipe.axisLock = null;
  swipe.samples = [];

  if (!wasHorizontal) return;

  if (Math.abs(rawDx) >= 8) {
    swipe.suppressClick = true;
    window.clearTimeout(swipe.suppressTimer);
    swipe.suppressTimer = window.setTimeout(() => {
      swipe.suppressClick = false;
    }, 80);
  }

  if (cancelled) {
    animateToMonth(0);
    return;
  }

  const w = viewportWidth();
  const atEnd = month >= todayMonth();
  const threshold = w * 0.3;
  let delta = 0;

  if (rawDx > threshold || (vx > 0.4 && rawDx > 20)) {
    delta = -1;
  } else if (!atEnd && (-rawDx > threshold || (vx < -0.4 && -rawDx > 20))) {
    delta = 1;
  }

  animateToMonth(delta);
}

if (el.swipeViewport) {
  el.swipeViewport.addEventListener(
    'touchstart',
    (event) => {
      if (event.touches.length !== 1) {
        if (swipe.source === 'touch') endGesture(true);
        return;
      }
      const t = event.touches[0];
      startGesture('touch', null, t.clientX, t.clientY, event.target);
    },
    { passive: true }
  );

  el.swipeViewport.addEventListener(
    'touchmove',
    (event) => {
      if (swipe.source !== 'touch' || event.touches.length !== 1) return;
      const t = event.touches[0];
      const locked = moveGesture(t.clientX, t.clientY);
      if (locked) event.preventDefault();
    },
    { passive: false }
  );

  el.swipeViewport.addEventListener('touchend', () => {
    if (swipe.source === 'touch') endGesture(false);
  });

  el.swipeViewport.addEventListener('touchcancel', () => {
    if (swipe.source === 'touch') endGesture(true);
  });

  el.swipeViewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') return;
    if (event.button !== 0) return;
    startGesture('pointer', event.pointerId, event.clientX, event.clientY, event.target);
  });

  window.addEventListener('pointermove', (event) => {
    if (swipe.source !== 'pointer' || event.pointerId !== swipe.pointerId) return;
    moveGesture(event.clientX, event.clientY, () => {
      try {
        el.swipeViewport.setPointerCapture(event.pointerId);
      } catch {
        /* ignore if pointer is no longer active */
      }
    });
  });

  const finishPointer = (cancelled) => (event) => {
    if (swipe.source !== 'pointer' || event.pointerId !== swipe.pointerId) return;
    try {
      if (el.swipeViewport.hasPointerCapture(event.pointerId)) {
        el.swipeViewport.releasePointerCapture(event.pointerId);
      }
    } catch {
      /* ignore */
    }
    endGesture(cancelled);
  };

  window.addEventListener('pointerup', finishPointer(false));
  window.addEventListener('pointercancel', finishPointer(true));

  el.swipeViewport.addEventListener(
    'click',
    (event) => {
      if (!swipe.suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      swipe.suppressClick = false;
    },
    true
  );
}

el.prev.addEventListener('click', () => shiftMonth(-1));
el.next.addEventListener('click', () => shiftMonth(1));

/* ── Recurring engine ──────────────────────────────────── */

function stepOccurrence(startDate, freq, step) {
  const [y, mo, d] = startDate.split('-').map(Number);
  if (freq === 'weekly') {
    const dt = new Date(y, mo - 1, d + step * 7);
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  }
  if (freq === 'monthly') {
    const targetMonth = shiftMonthStr(`${y}-${pad(mo)}`, step);
    const day = Math.min(d, daysIn(targetMonth));
    return `${targetMonth}-${pad(day)}`;
  }
  const targetYear = y + step;
  const ym = `${targetYear}-${pad(mo)}`;
  const day = Math.min(d, daysIn(ym));
  return `${ym}-${pad(day)}`;
}

function nextDueDate(rule) {
  const today = todayISO();
  for (let i = 0; i < 240; i++) {
    const occ = stepOccurrence(rule.startDate, rule.freq, i);
    if (occ > today) return occ;
  }
  return '';
}

function monthlyEquivalent(rule) {
  if (rule.freq === 'weekly') return Math.round((rule.amount * 52) / 12);
  if (rule.freq === 'yearly') return Math.round(rule.amount / 12);
  return rule.amount;
}

function syncRecurring(shouldSave = true) {
  const today = todayISO();
  let changed = false;
  const rules = state.recurring || [];
  for (const rule of rules) {
    if (!rule.active) continue;
    for (let i = 0; i < 120; i++) {
      const occ = stepOccurrence(rule.startDate, rule.freq, i);
      if (occ > today) break;
      if (rule.skippedDates && rule.skippedDates.includes(occ)) continue;
      const exists = state.items.some((it) => it.recurringId === rule.id && it.occurrenceDate === occ);
      if (exists) continue;
      state.items.push({
        id: `ri-${rule.id}-${occ}`,
        amount: rule.amount,
        cat: rule.cat,
        note: rule.note,
        date: occ,
        time: rule.time || '09:00',
        recurringId: rule.id,
        occurrenceDate: occ,
      });
      changed = true;
    }
  }
  if (changed && shouldSave) save();
  return changed;
}

function paintRepeat() {
  if (!el.repeatSeg) return;
  el.repeatSeg.querySelectorAll('.rep-btn').forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.dataset.freq === selectedRepeat ? 'true' : 'false');
  });
}

if (el.repeatSeg) {
  el.repeatSeg.addEventListener('click', (event) => {
    const btn = event.target.closest('.rep-btn');
    if (!btn) return;
    selectedRepeat = btn.dataset.freq;
    paintRepeat();
  });
}

function renderRecurringSheet() {
  const rules = state.recurring || [];
  const active = rules.filter((r) => r.active);
  const monthlyTotal = active.reduce((sum, r) => sum + monthlyEquivalent(r), 0);

  el.recSummary.textContent = rules.length
    ? `${active.length} active · ${money(monthlyTotal)} / month equivalent`
    : 'No recurring expenses yet.';

  el.recEmpty.hidden = rules.length > 0;
  el.recList.replaceChildren(
    ...rules.map((rule) => {
      const li = document.createElement('li');
      li.className = 'rec-item' + (rule.active ? '' : ' paused');
      paintCat(li, rule.cat);

      const dot = document.createElement('span');
      dot.className = 'dot';
      dot.setAttribute('aria-hidden', 'true');

      const main = document.createElement('div');
      main.className = 'rec-main';
      const title = document.createElement('span');
      title.className = 'rec-title';
      title.textContent = rule.note || catLabel(rule.cat);
      const sub = document.createElement('span');
      sub.className = 'rec-sub';
      const freqLabel = rule.freq[0].toUpperCase() + rule.freq.slice(1);
      const next = rule.active ? nextDueDate(rule) : '';
      sub.textContent = rule.active && next
        ? `${freqLabel} · Next ${prettyDate(next, true)}`
        : `${freqLabel} · Paused`;
      main.append(title, sub);

      const amt = document.createElement('span');
      amt.className = 'rec-amt';
      amt.textContent = money(rule.amount);

      const actions = document.createElement('div');
      actions.className = 'rec-actions';

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'rec-act';
      toggle.textContent = rule.active ? 'Pause' : 'Resume';
      toggle.addEventListener('click', () => {
        rule.active = !rule.active;
        if (rule.active) syncRecurring(false);
        save();
        render();
        toast(rule.active ? `Resumed ${title.textContent}` : `Paused ${title.textContent}`);
      });

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'rec-act danger';
      del.setAttribute('aria-label', `Delete recurring ${title.textContent}`);
      del.textContent = '×';
      del.addEventListener('click', () => {
        state.recurring = state.recurring.filter((r) => r.id !== rule.id);
        save();
        render();
        toast(`Stopped ${title.textContent}`, 'Undo', () => {
          state.recurring.push(rule);
          if (rule.active) syncRecurring(false);
          save();
          render();
        });
      });

      actions.append(toggle, del);
      li.append(dot, main, amt, actions);
      return li;
    })
  );
}

function openRecSheet() {
  lastFocus = document.activeElement;
  recOpen = true;
  renderRecurringSheet();
  el.recSheet.hidden = false;
  el.scrim.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    el.recSheet.classList.add('open');
    el.scrim.classList.add('show');
  });
  window.setTimeout(() => el.recClose.focus(), 100);
}

function closeRecSheet() {
  if (!recOpen) return;
  recOpen = false;
  el.recSheet.classList.remove('open');
  el.scrim.classList.remove('show');
  document.body.style.overflow = '';
  window.setTimeout(() => {
    el.recSheet.hidden = true;
    if (!sheetOpen) el.scrim.hidden = true;
  }, 240);
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}

el.recurringBtn.addEventListener('click', openRecSheet);
el.recClose.addEventListener('click', closeRecSheet);
el.recAddBtn.addEventListener('click', () => {
  closeRecSheet();
  window.setTimeout(() => openSheet(null, 'monthly'), 60);
});

/* ── Sheet ─────────────────────────────────────────────── */

function openSheet(item, defaultRepeat = 'never') {
  lastFocus = document.activeElement;
  editingId = item ? item.id : null;
  el.sheet.hidden = false;
  el.scrim.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    el.sheet.classList.add('open');
    el.scrim.classList.add('show');
    fitAmountInput();
  });
  sheetOpen = true;
  el.amountErr.hidden = true;
  el.amount.setAttribute('aria-invalid', 'false');
  el.sheetTitle.textContent = item ? 'Edit expense' : 'New expense';
  el.submitBtn.textContent = item ? 'Save changes' : 'Add expense';
  el.amount.value = item ? formatInputMoney(item.amount) : '';
  syncAmountInput();
  fitAmountInput();
  el.note.value = item ? item.note || '' : '';
  selectedCat = item ? item.cat : 'food';
  selectedRepeat = item ? 'never' : defaultRepeat;
  el.repeatRow.hidden = Boolean(item);
  paintRepeat();
  whenISO = item ? item.date : todayISO();
  whenMin = item && item.time ? hhmmToMinutes(item.time) : nowMinutes();
  whenView = whenISO.slice(0, 7);
  closeWhen();
  renderWhen();
  renderChips();
  window.setTimeout(() => {
    el.amount.focus();
    if (item) el.amount.select();
  }, 120);
}

function closeSheet() {
  if (!sheetOpen) return;
  sheetOpen = false;
  el.sheet.classList.remove('open');
  el.scrim.classList.remove('show');
  document.body.style.overflow = '';
  window.setTimeout(() => {
    el.sheet.hidden = true;
    if (!recOpen) el.scrim.hidden = true;
  }, 320);
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}

el.openSheet.addEventListener('click', () => openSheet());
el.cancel.addEventListener('click', closeSheet);
el.scrim.addEventListener('click', () => {
  if (sheetOpen) closeSheet();
  if (recOpen) closeRecSheet();
});

document.addEventListener('keydown', (event) => {
  if (!sheetOpen && !recOpen) {
    if (event.key === 'Escape' && !el.calendar.hidden) {
      closeCal();
      el.monthTrigger.focus();
    } else if (event.key === 'Escape' && !el.currencyPop.hidden) {
      closeCurrencyPop();
      el.currencyBtn.focus();
    }
    return;
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    if (recOpen) {
      closeRecSheet();
      return;
    }
    if (!el.whenPanel.hidden) {
      closeWhen();
      el.whenBtn.focus();
      return;
    }
    closeSheet();
    return;
  }
  if (event.key !== 'Tab') return;
  const activeDialog = recOpen ? el.recSheet : el.sheet;
  const focusable = activeDialog.querySelectorAll('button, input, select, [tabindex]:not([tabindex="-1"])');
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

  const cat = catInfo(selectedCat) ? selectedCat : 'other';
  const date = whenISO > todayISO() ? todayISO() : whenISO;
  const note = el.note.value.trim().slice(0, 80) || catLabel(cat);
  const time = minutesToHHMM(whenMin);
  const editing = editingId;
  const repeat = editing ? 'never' : selectedRepeat;

  if (editing) {
    const it = state.items.find((x) => x.id === editing);
    if (it) Object.assign(it, { amount, cat, note, date, time });
  } else if (repeat !== 'never') {
    const rule = {
      id: `r-${Date.now().toString(36)}`,
      amount,
      cat,
      note,
      freq: repeat,
      startDate: date,
      time,
      active: true,
      skippedDates: [],
    };
    state.recurring.push(rule);
    syncRecurring(false);
  } else {
    state.items.push({ id: String(Date.now()), amount, cat, note, date, time });
  }
  save();
  editingId = null;

  month = date.slice(0, 7);
  if (filter !== 'all' && filter !== cat) filter = 'all';

  el.amount.value = '';
  syncAmountInput();
  el.note.value = '';
  closeSheet();
  render();
  const verb = editing ? 'Saved' : repeat !== 'never' ? `Added ${repeat}` : 'Added';
  toast(`${verb} ${money(amount)} · ${catLabel(cat)}`);
});

let armedRow = null;

function disarmRow() {
  if (!armedRow) return;
  const { li, keep } = armedRow;
  li.classList.remove('armed');
  const del = li.querySelector('.del');
  if (del) del.textContent = '×';
  if (keep) keep.remove();
  armedRow = null;
}

function armRow(li, id) {
  disarmRow();
  const del = li.querySelector('.del');
  const keep = document.createElement('button');
  keep.type = 'button';
  keep.className = 'keep';
  keep.textContent = 'Keep';
  del.before(keep);
  li.classList.add('armed');
  del.textContent = 'Delete';
  armedRow = { li, id, keep };
}

function removeItem(id, li) {
  const gone = state.items.find((it) => it.id === id);
  if (!gone) return;

  const drop = () => {
    state.items = state.items.filter((it) => it.id !== id);
    if (gone.recurringId && gone.occurrenceDate) {
      const rule = (state.recurring || []).find((r) => r.id === gone.recurringId);
      if (rule) {
        rule.skippedDates = rule.skippedDates || [];
        if (!rule.skippedDates.includes(gone.occurrenceDate)) rule.skippedDates.push(gone.occurrenceDate);
      }
    }
    save();
    render();
    toast(`Deleted ${gone.note || catLabel(gone.cat)}`, 'Undo', () => {
      if (gone.recurringId && gone.occurrenceDate) {
        const rule = (state.recurring || []).find((r) => r.id === gone.recurringId);
        if (rule && rule.skippedDates) {
          rule.skippedDates = rule.skippedDates.filter((d) => d !== gone.occurrenceDate);
        }
      }
      state.items.push(gone);
      save();
      render();
    });
  };

  if (reduced || !li) {
    drop();
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
    .finished.then(drop)
    .catch(drop);
}

el.items.addEventListener('click', (event) => {
  if (event.target.closest('.keep')) {
    disarmRow();
    return;
  }

  const del = event.target.closest('.del');
  const li = event.target.closest('.item');
  if (!li) return;

  if (del) {
    const id = del.dataset.id;
    // The armed row only counts while that same row is still on screen. A list
    // that re-rendered underneath it starts fresh, so one tap can never delete.
    if (!armedRow || armedRow.id !== id || armedRow.li !== li || !li.isConnected) {
      armRow(li, id);
      return;
    }
    const rowNode = li;
    disarmRow();
    removeItem(id, rowNode);
    return;
  }

  disarmRow();
  openSheet(state.items.find((it) => it.id === li.dataset.id));
});

el.items.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  if (event.target.closest('button')) return;
  const li = event.target.closest('.item');
  if (!li) return;
  event.preventDefault();
  disarmRow();
  openSheet(state.items.find((it) => it.id === li.dataset.id));
});

const syncAmountInput = bindCalculatorInput(
  el.amount,
  () => (cur().decimals === 0 ? 0 : 2),
  (val) => {
    fitAmountInput();
    if (!el.amountErr.hidden) {
      const cents = parseMoney(val);
      if (Number.isFinite(cents) && cents > 0) {
        el.amountErr.hidden = true;
        el.amountErr.textContent = '';
        el.amount.setAttribute('aria-invalid', 'false');
      }
    }
  }
);

const syncBudgetInput = bindCalculatorInput(el.budget, () => (cur().decimals === 0 ? 0 : 2));

el.budget.addEventListener('change', () => {
  const cents = parseMoney(el.budget.value);
  // An explicit 0 means "no budget this month", rather than inheriting again.
  state.budgets[month] = Number.isFinite(cents) && cents > 0 ? cents : 0;
  save();
  render();
});

el.ringWrap.addEventListener('click', () => {
  el.budget.focus();
  el.budget.select();
  el.budget.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
});

el.budget.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    el.budget.blur();
  }
});

/* ── Delete everything: long-press the wordmark ────────── */

function wipeAll() {
  cancelPress();
  if (typeof store.clear === 'function') {
    try {
      store.clear();
    } catch {
      /* the in-memory reset below still applies */
    }
  }
  state = { items: [], budgets: {}, cats: [], recurring: [], currency: { ...DEFAULT_CURRENCY } };
  month = todayMonth();
  filter = 'all';
  selectedCat = 'food';
  selectedRepeat = 'never';
  searchQuery = '';
  el.searchInput.value = '';
  searchScope = 'month';
  el.searchRow.hidden = true;
  el.searchToggle.setAttribute('aria-expanded', 'false');
  sortBy = 'date';
  editingId = null;
  whenISO = todayISO();
  whenMin = nowMinutes();
  whenView = whenISO.slice(0, 7);
  closeNewCat(false);
  renderChips();
  render();
  toast('Everything deleted');
}

let pressTimer = 0;
let pressAt = null;

function cancelPress() {
  window.clearTimeout(pressTimer);
  pressTimer = 0;
  pressAt = null;
}

el.wordmark.addEventListener('pointerdown', (event) => {
  if (event.button !== undefined && event.button !== 0) return;
  cancelPress();
  pressAt = { x: event.clientX, y: event.clientY };
  pressTimer = window.setTimeout(() => {
    pressTimer = 0;
    pressAt = null;
    if (navigator.vibrate) navigator.vibrate(8);
    toast('Delete everything?', 'Delete', wipeAll);
  }, 620);
});

el.wordmark.addEventListener('pointermove', (event) => {
  if (!pressAt) return;
  if (Math.abs(event.clientX - pressAt.x) > 8 || Math.abs(event.clientY - pressAt.y) > 8) cancelPress();
});

for (const type of ['pointerup', 'pointercancel', 'pointerleave']) {
  el.wordmark.addEventListener(type, cancelPress);
}

// A long press on text would otherwise raise the system selection menu.
el.wordmark.addEventListener('contextmenu', (event) => event.preventDefault());

window.addEventListener('resize', () => {
  moveInk();
  fitAllHeroTotals();
  if (sheetOpen) fitAmountInput();
});

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    fitAllHeroTotals();
    if (sheetOpen) fitAmountInput();
  });
}

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
    const future = iso > todayISO();
    btn.disabled = future;
    btn.setAttribute('aria-pressed', iso === whenISO ? 'true' : 'false');
    btn.setAttribute(
      'aria-label',
      new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    );
    const num = document.createElement('span');
    num.textContent = String(d);
    btn.append(num);
    if (!future) {
      btn.addEventListener('click', () => {
        whenISO = iso;
        whenView = iso.slice(0, 7);
        renderWhen();
      });
    }
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

/* ── Currency, trends & search controls ────────────────── */

function renderCurrencyGrid() {
  const active = cur();
  const frag = document.createDocumentFragment();
  for (const c of CURRENCIES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cur-opt';
    const isMatch = active.code === c.code && active.symbol === c.symbol;
    btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    const sym = document.createElement('b');
    sym.textContent = c.symbol;
    const code = document.createElement('span');
    code.textContent = c.code;
    btn.append(sym, code);
    btn.addEventListener('click', () => {
      state.currency = { ...c };
      save();
      closeCurrencyPop();
      render();
      toast(`Currency set to ${c.code} (${c.symbol})`);
    });
    frag.append(btn);
  }
  el.currencyGrid.replaceChildren(frag);
  const preset = CURRENCIES.some((c) => c.code === active.code && c.symbol === active.symbol);
  el.customSymbol.value = preset ? '' : active.symbol;
  customDecimals = active.decimals === 0 ? 0 : 2;
  paintCustomDecimals();
}

function paintCustomDecimals() {
  el.dec2Btn.setAttribute('aria-pressed', customDecimals === 2 ? 'true' : 'false');
  el.dec0Btn.setAttribute('aria-pressed', customDecimals === 0 ? 'true' : 'false');
}

function openCurrencyPop() {
  if (!el.calendar.hidden) closeCal();
  renderCurrencyGrid();
  el.currencyPop.hidden = false;
  el.currencyBtn.setAttribute('aria-expanded', 'true');
}

function closeCurrencyPop() {
  el.currencyPop.hidden = true;
  el.currencyBtn.setAttribute('aria-expanded', 'false');
}

el.currencyBtn.addEventListener('click', () => {
  if (el.currencyPop.hidden) openCurrencyPop();
  else closeCurrencyPop();
});
el.currencyClose.addEventListener('click', () => {
  closeCurrencyPop();
  el.currencyBtn.focus();
});
el.dec2Btn.addEventListener('click', () => {
  customDecimals = 2;
  paintCustomDecimals();
});
el.dec0Btn.addEventListener('click', () => {
  customDecimals = 0;
  paintCustomDecimals();
});
el.currencyCustomForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const sym = el.customSymbol.value.trim().slice(0, 4);
  if (!sym) {
    el.customSymbol.focus();
    return;
  }
  state.currency = { code: sym.toUpperCase(), symbol: sym, decimals: customDecimals };
  save();
  closeCurrencyPop();
  render();
  toast(`Currency set to ${sym}`);
});

document.addEventListener('click', (event) => {
  if (el.currencyPop.hidden) return;
  if (event.target.closest('.top-in')) return;
  closeCurrencyPop();
});

el.viewBreakBtn.addEventListener('click', () => {
  if (whereView === 'breakdown') return;
  whereView = 'breakdown';
  render({ instant: false });
});
el.viewTrendBtn.addEventListener('click', () => {
  if (whereView === 'trends') return;
  whereView = 'trends';
  render({ instant: true });
});

el.searchToggle.addEventListener('click', () => {
  const opening = el.searchRow.hidden;
  el.searchRow.hidden = !opening;
  el.searchToggle.setAttribute('aria-expanded', opening ? 'true' : 'false');
  if (opening) {
    searchScope = 'all';
    render({ instant: true });
    el.searchInput.focus();
  } else {
    searchQuery = '';
    el.searchInput.value = '';
    searchScope = 'month';
    render({ instant: true });
  }
});

el.searchInput.addEventListener('input', () => {
  searchQuery = el.searchInput.value;
  render({ instant: true });
});

el.searchClear.addEventListener('click', () => {
  searchQuery = '';
  el.searchInput.value = '';
  render({ instant: true });
  el.searchInput.focus();
});

el.scopeMonthBtn.addEventListener('click', () => {
  if (searchScope === 'month') return;
  searchScope = 'month';
  render({ instant: true });
});

el.scopeAllBtn.addEventListener('click', () => {
  if (searchScope === 'all') return;
  searchScope = 'all';
  render({ instant: true });
});

el.sortBtn.addEventListener('click', () => {
  sortBy = sortBy === 'date' ? 'high' : sortBy === 'high' ? 'low' : 'date';
  render({ instant: true });
});

/* ── Boot ──────────────────────────────────────────────── */

/* Hooks for the Android shell (native.js); inert in a browser. */
window.SpentNative = {
  back() {
    if (recOpen) {
      closeRecSheet();
      return true;
    }
    if (sheetOpen && !el.whenPanel.hidden) {
      closeWhen();
      return true;
    }
    if (sheetOpen) {
      closeSheet();
      return true;
    }
    if (!el.calendar.hidden) {
      closeCal();
      return true;
    }
    if (!el.currencyPop.hidden) {
      closeCurrencyPop();
      return true;
    }
    if (!el.searchRow.hidden) {
      el.searchRow.hidden = true;
      el.searchToggle.setAttribute('aria-expanded', 'false');
      searchQuery = '';
      el.searchInput.value = '';
      searchScope = 'month';
      render({ instant: true });
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

syncRecurring(!FIXTURE);
renderWhen();
render();
