'use strict';

const CATS = [
  { id: 'food', label: 'Food' },
  { id: 'transport', label: 'Transport' },
  { id: 'home', label: 'Home' },
  { id: 'health', label: 'Health' },
  { id: 'fun', label: 'Fun' },
  { id: 'other', label: 'Other' },
];

const INCOME_CATS = [
  { id: 'inc-salary', label: 'Salary' },
  { id: 'inc-freelance', label: 'Freelance' },
  { id: 'inc-gift', label: 'Gift' },
  { id: 'inc-refund', label: 'Refund' },
  { id: 'inc-invest', label: 'Invest' },
  { id: 'inc-other', label: 'Other' },
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
  backupBtn: document.getElementById('backupBtn'),
  backupPop: document.getElementById('backupPop'),
  backupClose: document.getElementById('backupClose'),
  exportCsvBtn: document.getElementById('exportCsvBtn'),
  exportJsonBtn: document.getElementById('exportJsonBtn'),
  restoreBtn: document.getElementById('restoreBtn'),
  restoreFile: document.getElementById('restoreFile'),
  restoreConfirm: document.getElementById('restoreConfirm'),
  restoreMsg: document.getElementById('restoreMsg'),
  restoreMergeBtn: document.getElementById('restoreMergeBtn'),
  restoreReplaceBtn: document.getElementById('restoreReplaceBtn'),
  restoreCancelBtn: document.getElementById('restoreCancelBtn'),
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
  cashflowLine: document.getElementById('cashflowLine'),
  ring: document.getElementById('ring'),
  ringWrap: document.getElementById('ringWrap'),
  ringPct: document.getElementById('ringPct'),
  budgetPrefix: document.getElementById('budgetPrefix'),
  budget: document.getElementById('budget'),
  left: document.getElementById('left'),
  recurringBtn: document.getElementById('recurringBtn'),
  recurringLabel: document.getElementById('recurringLabel'),
  whereLabel: document.getElementById('whereLabel'),
  whereSeg: document.getElementById('whereSeg'),
  viewBreakBtn: document.getElementById('viewBreakBtn'),
  viewTrendBtn: document.getElementById('viewTrendBtn'),
  breakdownWrap: document.getElementById('breakdownWrap'),
  trendWrap: document.getElementById('trendWrap'),
  trendBars: document.getElementById('trendBars'),
  trendNote: document.getElementById('trendNote'),
  split: document.getElementById('split'),
  legend: document.getElementById('legend'),
  whereEmpty: document.getElementById('whereEmpty'),
  listLabel: document.getElementById('listLabel'),
  typeSeg: document.getElementById('typeSeg'),
  searchToggle: document.getElementById('searchToggle'),
  sortBtn: document.getElementById('sortBtn'),
  searchRow: document.getElementById('searchRow'),
  searchInput: document.getElementById('searchInput'),
  scopeMonthBtn: document.getElementById('scopeMonthBtn'),
  scopeAllBtn: document.getElementById('scopeAllBtn'),
  searchClear: document.getElementById('searchClear'),
  tabs: document.getElementById('tabs'),
  tabsTrack: document.getElementById('tabsTrack'),
  tabInk: document.getElementById('tabInk'),
  count: document.getElementById('count'),
  items: document.getElementById('items'),
  empty: document.getElementById('empty'),
  prev: document.getElementById('prev'),
  next: document.getElementById('next'),
  form: document.getElementById('form'),
  entryTypeSeg: document.getElementById('entryTypeSeg'),
  amountCurrency: document.getElementById('amountCurrency'),
  amount: document.getElementById('amount'),
  calcToggle: document.getElementById('calcToggle'),
  calcExpr: document.getElementById('calcExpr'),
  calcPad: document.getElementById('calcPad'),
  amountErr: document.getElementById('amountErr'),
  noteLabel: document.getElementById('noteLabel'),
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
  chipInk: document.getElementById('chipInk'),
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
let typeFilter = 'all';
let filter = 'all';
let selectedType = 'expense';
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

function normalizeState(raw) {
  const blank = { items: [], budgets: {}, cats: [], recurring: [], currency: { ...DEFAULT_CURRENCY } };
  if (!raw || typeof raw !== 'object') return blank;

  const items = Array.isArray(raw.items)
    ? raw.items
        .filter(
          (it) =>
            it &&
            typeof it.amount === 'number' &&
            Number.isFinite(it.amount) &&
            it.amount > 0 &&
            typeof it.date === 'string' &&
            /^\d{4}-\d{2}-\d{2}$/.test(it.date) &&
            typeof it.id === 'string' &&
            it.id.trim()
        )
        .map((it) => {
          const type = it.type === 'income' ? 'income' : 'expense';
          const out = {
            id: it.id,
            type,
            amount: Math.round(it.amount),
            cat: typeof it.cat === 'string' && it.cat ? it.cat : type === 'income' ? 'inc-other' : 'other',
            note: typeof it.note === 'string' ? it.note.slice(0, 80) : '',
            date: it.date,
            time: typeof it.time === 'string' && /^\d{2}:\d{2}$/.test(it.time) ? it.time : '09:00',
          };
          if (typeof it.recurringId === 'string' && it.recurringId) out.recurringId = it.recurringId;
          if (typeof it.occurrenceDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(it.occurrenceDate)) {
            out.occurrenceDate = it.occurrenceDate;
          }
          return out;
        })
    : [];

  const budgets = {};
  if (raw.budgets && typeof raw.budgets === 'object') {
    for (const [k, v] of Object.entries(raw.budgets)) {
      if (/^\d{4}-\d{2}$/.test(k) && typeof v === 'number' && Number.isFinite(v) && v >= 0) {
        budgets[k] = Math.round(v);
      }
    }
  }

  const cats = Array.isArray(raw.cats)
    ? raw.cats
        .filter(
          (c) =>
            c &&
            typeof c.id === 'string' &&
            /^c-/.test(c.id) &&
            typeof c.label === 'string' &&
            c.label.trim() &&
            !CATS.some((base) => base.id === c.id) &&
            !INCOME_CATS.some((base) => base.id === c.id)
        )
        .map((c) => ({
          id: c.id,
          label: c.label.trim().slice(0, 20),
          tone: Number.isInteger(c.tone) && c.tone >= 1 && c.tone <= TONES ? c.tone : 1,
          kind: c.kind === 'income' ? 'income' : 'expense',
        }))
    : [];

  const recurring = Array.isArray(raw.recurring)
    ? raw.recurring
        .filter(
          (r) =>
            r &&
            typeof r.id === 'string' &&
            typeof r.amount === 'number' &&
            Number.isFinite(r.amount) &&
            r.amount > 0 &&
            typeof r.startDate === 'string' &&
            /^\d{4}-\d{2}-\d{2}$/.test(r.startDate) &&
            ['weekly', 'monthly', 'yearly'].includes(r.freq)
        )
        .map((r) => {
          const type = r.type === 'income' ? 'income' : 'expense';
          return {
            id: r.id,
            type,
            amount: Math.round(r.amount),
            cat: typeof r.cat === 'string' && r.cat ? r.cat : type === 'income' ? 'inc-other' : 'other',
            note: typeof r.note === 'string' ? r.note.slice(0, 80) : '',
            freq: r.freq,
            startDate: r.startDate,
            time: typeof r.time === 'string' && /^\d{2}:\d{2}$/.test(r.time) ? r.time : '09:00',
            active: r.active !== false,
            skippedDates: Array.isArray(r.skippedDates) ? r.skippedDates.filter((d) => typeof d === 'string') : [],
          };
        })
    : [];

  const currency = sanitizeCurrency(raw.currency);
  return { items, budgets, cats, recurring, currency };
}

function load() {
  try {
    const raw = JSON.parse(store.read() || '{}');
    return normalizeState(raw);
  } catch {
    return { items: [], budgets: {}, cats: [], recurring: [], currency: { ...DEFAULT_CURRENCY } };
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
  if (el.calcPad) {
    const dotBtn = el.calcPad.querySelector('[data-calc="dot"]');
    if (dotBtn) dotBtn.disabled = c.decimals === 0;
  }
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

function itemType(it) {
  return it && it.type === 'income' ? 'income' : 'expense';
}

function catsFor(kind) {
  const target = kind === 'income' ? 'income' : 'expense';
  const base = target === 'income' ? INCOME_CATS : CATS;
  const custom = (state.cats || []).filter((c) => (c.kind || 'expense') === target);
  return custom.length ? base.concat(custom) : base;
}

function allCats() {
  return CATS.concat(INCOME_CATS, state.cats || []);
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

function moveChipInk(instant = false) {
  if (!el.chipInk) return;
  const active = el.catChips.querySelector('.chip[aria-pressed="true"]');
  if (!active || active.hidden || el.catChips.querySelector('.chip-form') || !active.offsetWidth) {
    el.chipInk.style.opacity = '0';
    return;
  }
  const firstPaint = !el.chipInk.style.width || el.chipInk.style.width === '0px';
  const snap = instant || reduced || firstPaint;
  if (snap) el.chipInk.style.transition = 'none';
  el.chipInk.style.opacity = '1';
  el.chipInk.style.width = `${active.offsetWidth}px`;
  el.chipInk.style.height = `${active.offsetHeight}px`;
  el.chipInk.style.transform = `translate3d(${active.offsetLeft}px, ${active.offsetTop}px, 0)`;
  if (snap) {
    void el.chipInk.offsetWidth;
    el.chipInk.style.transition = '';
  }
}

function moveSegInk(segEl, instant = false) {
  if (!segEl) return;
  const ink = segEl.querySelector('.seg-ink');
  const active = segEl.querySelector('[aria-pressed="true"]');
  if (!ink || !active || !active.offsetWidth) return;
  const firstPaint = !ink.style.width || ink.style.width === '0px';
  const snap = instant || reduced || firstPaint;
  if (snap) ink.style.transition = 'none';
  ink.style.width = `${active.offsetWidth}px`;
  ink.style.height = `${active.offsetHeight}px`;
  ink.style.transform = `translate3d(${active.offsetLeft}px, ${active.offsetTop}px, 0)`;
  if (snap) {
    void ink.offsetWidth;
    ink.style.transition = '';
  }
}

function paintChips(instant = false) {
  el.catChips.querySelectorAll('.chip').forEach((chip) => {
    chip.setAttribute('aria-pressed', chip.dataset.cat === selectedCat ? 'true' : 'false');
  });
  moveChipInk(instant);
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

function computeMoM(targetMonth, total) {
  const prevMonth = shiftMonthStr(targetMonth, -1);
  const prevItems = state.items.filter((it) => it.date.startsWith(prevMonth) && itemType(it) === 'expense');
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
  const monthAllItems = state.items.filter((it) => it.date.startsWith(targetMonth));
  const expenseItems = monthAllItems.filter((it) => itemType(it) === 'expense');
  const incomeItems = monthAllItems.filter((it) => itemType(it) === 'income');

  const total = expenseItems.reduce((sum, it) => sum + it.amount, 0);
  const incomeTotal = incomeItems.reduce((sum, it) => sum + it.amount, 0);
  const netTotal = incomeTotal - total;

  const byCat = new Map();
  for (const it of expenseItems) byCat.set(it.cat, (byCat.get(it.cat) || 0) + it.amount);
  const byIncomeCat = new Map();
  for (const it of incomeItems) byIncomeCat.set(it.cat, (byIncomeCat.get(it.cat) || 0) + it.amount);

  let topCat = '';
  let topAmt = 0;
  for (const [cat, amt] of byCat) {
    if (amt > topAmt) {
      topCat = cat;
      topAmt = amt;
    }
  }

  const days = targetMonth === todayMonth() ? new Date().getDate() : daysIn(targetMonth);
  const perDay = expenseItems.length ? Math.round(total / days) : 0;
  const lede = expenseItems.length
    ? `${catLabel(topCat)} leads · ${money(perDay)} a day · ${expenseItems.length} ${expenseItems.length === 1 ? 'expense' : 'expenses'}`
    : incomeItems.length
      ? `No expenses yet · ${incomeItems.length} income ${incomeItems.length === 1 ? 'entry' : 'entries'}`
      : `Nothing logged in ${label}`;

  const momText = computeMoM(targetMonth, total);

  const budget = budgetFor(targetMonth);
  const ratio = budget ? total / budget : 0;
  const pct = budget ? Math.round(ratio * 100) : 0;
  const leftText = !budget
    ? 'Tap to set a budget'
    : total > budget
      ? `${money(total - budget)} over`
      : `${money(budget - total)} left`;

  const q = applySearch ? searchQuery.trim().toLowerCase() : '';
  const searchActive = applySearch && (Boolean(q) || (!el.searchRow.hidden && searchScope === 'all'));
  const pool = searchActive && searchScope === 'all' ? state.items : monthAllItems;
  const activeType = applySearch ? typeFilter : 'all';

  let shown = activeType === 'all' ? pool.slice() : pool.filter((it) => itemType(it) === activeType);
  if (filter !== 'all') {
    shown = shown.filter((it) => it.cat === filter);
  }

  if (q) {
    shown = shown.filter((it) => {
      const note = (it.note || '').toLowerCase();
      const cat = catLabel(it.cat).toLowerCase();
      const tLabel = itemType(it);
      const amt = money(it.amount).toLowerCase();
      const rawAmt = formatInputMoney(it.amount);
      const plainAmt = rawAmt.replace(/,/g, '');
      const dateStr = `${it.date} ${prettyDate(it.date, true).toLowerCase()}`;
      return (
        note.includes(q) ||
        cat.includes(q) ||
        tLabel.includes(q) ||
        amt.includes(q) ||
        rawAmt.includes(q) ||
        plainAmt.includes(q) ||
        dateStr.includes(q)
      );
    });
  }

  sortExpenses(shown);
  const shownExpenseSum = shown.reduce((sum, it) => sum + (itemType(it) === 'expense' ? it.amount : 0), 0);
  const shownIncomeSum = shown.reduce((sum, it) => sum + (itemType(it) === 'income' ? it.amount : 0), 0);
  const shownNet = shownIncomeSum - shownExpenseSum;

  return {
    label,
    monthItems: monthAllItems,
    expenseItems,
    incomeItems,
    shown,
    shownExpenseSum,
    shownIncomeSum,
    shownNet,
    searchActive,
    isAllScope: searchActive && searchScope === 'all',
    total,
    incomeTotal,
    netTotal,
    byCat,
    byIncomeCat,
    lede,
    momText,
    budget,
    ratio,
    pct,
    leftText,
  };
}

function renderCashflow(node, incomeTotal, netTotal) {
  if (!node) return;
  if (!incomeTotal) {
    node.hidden = true;
    node.replaceChildren();
    return;
  }
  node.hidden = false;
  const incSpan = document.createElement('span');
  incSpan.className = 'cashflow-inc';
  incSpan.textContent = `+${money(incomeTotal)}`;
  const netSpan = document.createElement('span');
  netSpan.className = `cashflow-net ${netTotal >= 0 ? 'pos' : 'neg'}`;
  netSpan.textContent = `${netTotal >= 0 ? '+' : '−'}${money(Math.abs(netTotal))}`;
  node.replaceChildren(
    document.createTextNode('Income '),
    incSpan,
    document.createTextNode(' · Net '),
    netSpan
  );
}

let previewRaf = 0;

function render(opts = {}) {
  const instant = Boolean(opts && opts.instant);
  const animateWhereSeg = Boolean(opts && opts.animateWhereSeg);
  const deferPreviews = Boolean(opts && opts.deferPreviews);
  disarmRow();
  closeSwipedRow();
  syncCurrencyChrome();
  renderTabs();
  const data = computeMonthData(month, true);
  el.monthLabel.textContent = data.label;
  el.next.disabled = month >= todayMonth();

  renderHeroTotal(el.total, data.total);
  el.lede.textContent = data.lede;
  el.momDelta.textContent = data.momText;
  el.momDelta.hidden = !data.momText;
  renderCashflow(el.cashflowLine, data.incomeTotal, data.netTotal);

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
  el.ringWrap.classList.toggle('unset', !data.budget);
  el.ringPct.textContent = data.budget ? `${data.pct}%` : 'Set';
  el.ringWrap.setAttribute(
    'aria-label',
    data.budget
      ? `${money(data.total)} of the ${money(data.budget)} budget spent, ${data.pct} percent${data.total > data.budget ? ', over budget' : ''}. Tap to edit budget`
      : `No budget set. ${money(data.total)} spent. Tap to set budget`
  );
  el.left.textContent = data.leftText;
  el.left.classList.toggle('unset', !data.budget);

  const activeRecCount = (state.recurring || []).filter((r) => r.active).length;
  if (el.recurringLabel) {
    el.recurringLabel.textContent = activeRecCount ? `Recurring · ${activeRecCount}` : 'Recurring';
  }

  renderWhereSection(data, instant, animateWhereSeg);

  if (el.typeSeg) {
    el.typeSeg.querySelectorAll('.type-btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.dataset.type === typeFilter ? 'true' : 'false');
    });
    moveSegInk(el.typeSeg, instant);
  }

  el.items.replaceChildren(...data.shown.map((it) => row(it, data.isAllScope)));
  el.empty.hidden = data.shown.length > 0;
  el.empty.textContent = data.searchActive
    ? 'No matching entries.'
    : data.monthItems.length && !data.shown.length
      ? typeFilter === 'income'
        ? 'No income entries match this filter.'
        : 'Nothing in this filter this month.'
      : 'No entries yet. Add the first one.';

  if (data.searchActive) {
    let sumText = '';
    if (typeFilter === 'income') {
      sumText = `+${money(data.shownIncomeSum)}`;
    } else if (typeFilter === 'expense' || !data.shownIncomeSum) {
      sumText = money(data.shownExpenseSum);
    } else {
      sumText = `${data.shownNet >= 0 ? '+' : '−'}${money(Math.abs(data.shownNet))} net`;
    }
    el.count.textContent = `${data.shown.length} ${data.shown.length === 1 ? 'match' : 'matches'} · ${sumText}`;
  } else {
    el.count.textContent =
      filter === 'all' && typeFilter === 'all'
        ? `${data.monthItems.length} ${data.monthItems.length === 1 ? 'entry' : 'entries'}`
        : `${data.shown.length} of ${data.monthItems.length}`;
  }

  el.sortBtn.textContent = sortBy === 'date' ? 'Newest' : sortBy === 'high' ? 'Highest' : 'Lowest';
  el.scopeMonthBtn.setAttribute('aria-pressed', searchScope === 'month' ? 'true' : 'false');
  el.scopeAllBtn.setAttribute('aria-pressed', searchScope === 'all' ? 'true' : 'false');
  el.searchClear.hidden = !searchQuery;

  const tabsHost = el.tabsTrack || el.tabs;
  tabsHost.querySelectorAll('.tab').forEach((tab) => {
    tab.setAttribute('aria-pressed', tab.dataset.filter === filter ? 'true' : 'false');
  });
  paintChips(true);

  moveInk(instant || tabsNeedInstant);
  tabsNeedInstant = false;
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

function renderWhereSection(data, instant, animateWhereSeg = false) {
  const isTrend = whereView === 'trends';
  const showIncomeBreakdown = !isTrend && typeFilter === 'income';
  if (el.whereLabel) {
    el.whereLabel.textContent = showIncomeBreakdown ? 'Where it came from' : 'Where it went';
  }
  if (el.whereEmpty) {
    el.whereEmpty.textContent = showIncomeBreakdown ? 'No income logged this month.' : 'Nothing to break down yet.';
  }
  el.viewBreakBtn.setAttribute('aria-pressed', isTrend ? 'false' : 'true');
  el.viewTrendBtn.setAttribute('aria-pressed', isTrend ? 'true' : 'false');
  moveSegInk(el.whereSeg, instant && !animateWhereSeg);
  el.breakdownWrap.hidden = isTrend;
  el.trendWrap.hidden = !isTrend;
  if (isTrend) {
    renderTrends(data.byCat);
  } else {
    const map = showIncomeBreakdown ? data.byIncomeCat : data.byCat;
    renderBreakdown(map, el.split, el.legend, el.whereEmpty, instant);
  }
}

function renderTrends(currByCat) {
  const months = [];
  for (let i = -5; i <= 0; i++) {
    months.push(shiftMonthStr(month, i));
  }

  const series = months.map((m) => {
    const mItems = state.items.filter((it) => it.date.startsWith(m) && itemType(it) === 'expense');
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
    if (it.date.startsWith(prevMonth) && itemType(it) === 'expense') {
      prevByCat.set(it.cat, (prevByCat.get(it.cat) || 0) + it.amount);
    }
  }
  let topMover = '';
  let topDelta = 0;
  for (const c of catsFor('expense')) {
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
  figLabel.textContent = 'Spent this month';
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
  if (data.incomeTotal) {
    const cf = document.createElement('p');
    cf.className = 'figure-cashflow';
    renderCashflow(cf, data.incomeTotal, data.netTotal);
    figMain.append(cf);
  }

  const ringWrap = document.createElement('div');
  ringWrap.className = 'ring' + (data.budget > 0 && data.total > data.budget ? ' over' : !data.budget ? ' unset' : '');
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
  ringNote.textContent = data.budget ? `${data.pct}%` : 'Set';
  ringWrap.append(ringNote);

  fig.append(figMain, ringWrap);

  const budgetLine = document.createElement('div');
  budgetLine.className = 'budgetline';
  const budgetRow = document.createElement('div');
  budgetRow.className = 'budget-row';
  const budgetLabel = document.createElement('span');
  budgetLabel.className = 'budget-lbl';
  budgetLabel.textContent = 'Monthly budget';
  const budgetField = document.createElement('div');
  budgetField.className = 'budget-field';
  const dollar = document.createElement('span');
  dollar.textContent = cur().symbol;
  const budgetInput = document.createElement('input');
  budgetInput.type = 'text';
  budgetInput.readOnly = true;
  budgetInput.tabIndex = -1;
  budgetInput.placeholder = 'Set budget';
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
  listTitle.textContent = 'Activity';
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
      tab.style.background = 'var(--ink)';
      tab.style.color = 'var(--paper)';
      tab.style.borderRadius = '999px';
    }
    tabsEl.append(tab);
  }

  const itemsEl = document.createElement('ul');
  itemsEl.className = 'items';
  itemsEl.append(...data.shown.map((it) => {
    const li = row(it, false);
    li.tabIndex = -1;
    li.querySelectorAll('button').forEach((b) => {
      b.tabIndex = -1;
    });
    return li;
  }));

  const emptyEl = document.createElement('p');
  emptyEl.className = 'empty';
  emptyEl.hidden = data.shown.length > 0;
  emptyEl.textContent =
    data.monthItems.length && !data.shown.length
      ? 'Nothing in this filter this month.'
      : 'No entries yet. Add the first one.';

  listSec.append(listHead, tabsEl, itemsEl, emptyEl);

  frag.append(periodSec, whereSec, listSec);
  panel.replaceChildren(frag);
  fitHeroTotal(figTotal);
}

const EDIT_SVG =
  '<svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true" focusable="false">' +
  '<path d="M9.8 2.2a1.4 1.4 0 0 1 2 2L4.9 11.1l-2.7.7.7-2.7 6.9-6.9Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>' +
  '</svg>';

function row(it, includeYear = false) {
  const isIncome = itemType(it) === 'income';
  const li = document.createElement('li');
  li.className = 'item';
  paintCat(li, it.cat);
  li.dataset.id = it.id;
  li.tabIndex = 0;
  li.setAttribute('aria-label', `Edit ${it.note || catLabel(it.cat)}, ${isIncome ? 'income ' : ''}${money(it.amount)}`);

  const bg = document.createElement('div');
  bg.className = 'item-bg';
  const swipeDel = document.createElement('button');
  swipeDel.type = 'button';
  swipeDel.className = 'swipe-del-btn';
  swipeDel.dataset.id = it.id;
  swipeDel.tabIndex = -1;
  swipeDel.setAttribute('aria-label', `Delete ${it.note || catLabel(it.cat)}`);
  swipeDel.textContent = 'Delete';
  bg.append(swipeDel);

  const fg = document.createElement('div');
  fg.className = 'item-fg';

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
  const incTag = isIncome ? ' · Income' : '';
  sub.textContent = `${catLabel(it.cat)}${incTag} · ${prettyDate(it.date, includeYear)}${it.time ? ` · ${prettyTime(it.time)}` : ''}${recTag}`;
  main.append(note, sub);

  const amt = document.createElement('span');
  amt.className = 'amt' + (isIncome ? ' income' : '');
  amt.textContent = `${isIncome ? '+' : '−'}${money(it.amount)}`;

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'edit-btn';
  editBtn.dataset.id = it.id;
  editBtn.setAttribute('aria-label', `Edit ${note.textContent}`);
  editBtn.innerHTML = EDIT_SVG;

  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'del';
  del.dataset.id = it.id;
  del.setAttribute('aria-label', `Delete ${note.textContent}, ${money(it.amount)}`);
  del.textContent = '×';

  fg.append(dot, main, amt, editBtn, del);
  li.append(bg, fg);
  return li;
}

/* ── Tabs ──────────────────────────────────────────────── */

let tabsKey = '';
let tabsNeedInstant = true;

function moveInk(instant = false) {
  if (!el.tabInk) return;
  const tabsHost = el.tabsTrack || el.tabs;
  const active = tabsHost.querySelector('.tab[aria-pressed="true"]');
  if (!active || !active.offsetWidth) return;
  const firstPaint = !el.tabInk.style.width || el.tabInk.style.width === '0px';
  const snap = instant || reduced || firstPaint;
  if (snap) el.tabInk.style.transition = 'none';
  el.tabInk.style.width = `${active.offsetWidth}px`;
  el.tabInk.style.height = `${active.offsetHeight}px`;
  el.tabInk.style.transform = `translate3d(${active.offsetLeft}px, ${active.offsetTop}px, 0)`;
  if (snap) {
    void el.tabInk.offsetWidth;
    el.tabInk.style.transition = '';
  } else if (el.tabs.scrollWidth > el.tabs.clientWidth + 1 && typeof active.scrollIntoView === 'function') {
    active.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest' });
  }
}

function visibleTabCats() {
  if (typeFilter === 'expense') return catsFor('expense');
  if (typeFilter === 'income') return catsFor('income');
  return allCats();
}

// Tabs are rebuilt only when the category set changes: rebuilding on every
// render would throw away focus and restart the ink transition.
function renderTabs() {
  const cats = visibleTabCats();
  if (filter !== 'all' && !cats.some((c) => c.id === filter)) {
    filter = 'all';
  }
  const key = typeFilter + '|' + cats.map((c) => c.id + ':' + c.label).join('|');
  if (key === tabsKey) return;
  tabsKey = key;
  tabsNeedInstant = true;

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
  // The ink lives inside #tabsTrack so horizontal scrolling stays locked to the tabs.
  const tabsHost = el.tabsTrack || el.tabs;
  tabsHost.replaceChildren(frag, el.tabInk);
}

function renderChips() {
  const frag = document.createDocumentFragment();
  for (const cat of catsFor(selectedType)) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.dataset.cat = cat.id;
    chip.textContent = cat.label;
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', () => {
      selectedCat = cat.id;
      paintChips(false);
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

  el.catChips.replaceChildren(frag, el.chipInk);
  paintChips(true);
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
  if (el.chipInk) el.chipInk.style.opacity = '0';

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
  moveChipInk(true);
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

  const existing = catsFor(selectedType).find((c) => c.label.toLowerCase() === label.toLowerCase());
  closeNewCat(false);

  if (existing) {
    selectedCat = existing.id;
    paintChips(true);
    return existing.id;
  }

  const cat = {
    id: `c-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
    label,
    tone: nextTone(),
    kind: selectedType,
  };
  state.cats.push(cat);
  selectedCat = cat.id;
  save();
  renderChips();
  render();
  return cat.id;
}

/* ── Month paging & instant interruptible swipe ────────── */

let swipedRow = null;

function closeSwipedRow(exceptLi = null) {
  if (!swipedRow || swipedRow === exceptLi) return;
  const fg = swipedRow.querySelector('.item-fg');
  swipedRow.classList.remove('swiped', 'swiping');
  if (fg) fg.style.transform = '';
  swipedRow = null;
}

function openSwipedRow(li) {
  if (!li) return;
  closeSwipedRow(li);
  const fg = li.querySelector('.item-fg');
  li.classList.remove('swiping');
  li.classList.add('swiped');
  if (fg) fg.style.transform = 'translate3d(-84px, 0, 0)';
  swipedRow = li;
}

let swipe = {
  source: null,
  pointerId: null,
  startX: 0,
  startY: 0,
  rawDx: 0,
  dx: 0,
  axisLock: null,
  mode: null,
  startRow: null,
  rowFg: null,
  rowStartTx: 0,
  rowTx: 0,
  rowWidth: 0,
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
  if (sheetOpen || recOpen || !el.calendar.hidden || !el.currencyPop.hidden || !el.backupPop.hidden) return true;
  if (!target || typeof target.closest !== 'function') return false;
  if (target.closest('input, textarea, select, [contenteditable="true"]')) return true;
  if (target.closest('.edit-btn, .del, .keep, .swipe-del-btn, .cal, .trend-col')) return true;
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
  const rowItem = target && typeof target.closest === 'function' ? target.closest('.item') : null;
  swipe.source = source;
  swipe.pointerId = pointerId;
  swipe.startX = clientX;
  swipe.startY = clientY;
  swipe.rawDx = 0;
  swipe.dx = 0;
  swipe.axisLock = null;
  swipe.mode = null;
  swipe.startRow = rowItem;
  swipe.rowFg = rowItem ? rowItem.querySelector('.item-fg') : null;
  swipe.rowStartTx = rowItem && rowItem.classList.contains('swiped') ? -84 : 0;
  swipe.rowTx = swipe.rowStartTx;
  swipe.rowWidth = rowItem ? rowItem.clientWidth || viewportWidth() : 0;
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
      disarmRow();
      if (swipe.startRow && swipe.rowFg && (rawDx < 0 || swipe.startRow.classList.contains('swiped'))) {
        swipe.mode = 'row';
        closeSwipedRow(swipe.startRow);
        swipe.startRow.classList.add('swiping');
      } else {
        swipe.mode = 'month';
        closeSwipedRow();
        el.swipeTrack.classList.remove('animating');
        el.swipeTrack.classList.add('dragging');
      }
      if (onHorizontalLock) onHorizontalLock();
    } else {
      swipe.axisLock = 'y';
      swipe.source = null;
      swipe.pointerId = null;
      swipe.startRow = null;
      swipe.rowFg = null;
      return false;
    }
  }

  if (swipe.axisLock !== 'x') return false;

  swipe.rawDx = rawDx;
  pushSample(clientX);

  if (swipe.mode === 'row' && swipe.rowFg) {
    const tx = Math.max(-swipe.rowWidth, Math.min(0, swipe.rowStartTx + rawDx));
    swipe.rowTx = tx;
    swipe.rowFg.style.transform = `translate3d(${tx}px, 0, 0)`;
    return true;
  }

  swipe.dx = applyResistance(rawDx);
  setTrackX(swipe.dx, false);
  return true;
}

function endGesture(cancelled = false) {
  const wasHorizontal = swipe.axisLock === 'x';
  const mode = swipe.mode;
  const rawDx = swipe.rawDx;
  const rowLi = swipe.startRow;
  const rowTx = swipe.rowTx;
  const rowWidth = swipe.rowWidth;
  const vx = releaseVelocity();

  swipe.source = null;
  swipe.pointerId = null;
  swipe.axisLock = null;
  swipe.mode = null;
  swipe.startRow = null;
  swipe.rowFg = null;
  swipe.samples = [];

  if (!wasHorizontal) return;

  if (Math.abs(rawDx) >= 8) {
    swipe.suppressClick = true;
    window.clearTimeout(swipe.suppressTimer);
    swipe.suppressTimer = window.setTimeout(() => {
      swipe.suppressClick = false;
    }, 80);
  }

  if (mode === 'row' && rowLi) {
    rowLi.classList.remove('swiping');
    if (cancelled) {
      closeSwipedRow();
      return;
    }
    const pulled = -rowTx;
    if (pulled > rowWidth * 0.55 || (vx < -0.9 && pulled > rowWidth * 0.35)) {
      closeSwipedRow();
      removeItem(rowLi.dataset.id, rowLi);
    } else if (pulled > 42 || (vx < -0.35 && -rawDx > 16)) {
      openSwipedRow(rowLi);
    } else {
      rowLi.classList.remove('swiped');
      const fg = rowLi.querySelector('.item-fg');
      if (fg) fg.style.transform = '';
      if (swipedRow === rowLi) swipedRow = null;
    }
    return;
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
    const type = rule.type === 'income' ? 'income' : 'expense';
    for (let i = 0; i < 120; i++) {
      const occ = stepOccurrence(rule.startDate, rule.freq, i);
      if (occ > today) break;
      if (rule.skippedDates && rule.skippedDates.includes(occ)) continue;
      const exists = state.items.some((it) => it.recurringId === rule.id && it.occurrenceDate === occ);
      if (exists) continue;
      state.items.push({
        id: `ri-${rule.id}-${occ}`,
        type,
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

function paintRepeat(instant = false) {
  if (!el.repeatSeg) return;
  el.repeatSeg.querySelectorAll('.rep-btn').forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.dataset.freq === selectedRepeat ? 'true' : 'false');
  });
  moveSegInk(el.repeatSeg, instant);
}

if (el.repeatSeg) {
  el.repeatSeg.addEventListener('click', (event) => {
    const btn = event.target.closest('.rep-btn');
    if (!btn) return;
    selectedRepeat = btn.dataset.freq;
    paintRepeat(false);
  });
}

function renderRecurringSheet() {
  const rules = state.recurring || [];
  const active = rules.filter((r) => r.active);
  const activeExp = active.filter((r) => itemType(r) === 'expense').reduce((sum, r) => sum + monthlyEquivalent(r), 0);
  const activeInc = active.filter((r) => itemType(r) === 'income').reduce((sum, r) => sum + monthlyEquivalent(r), 0);

  if (!rules.length) {
    el.recSummary.textContent = 'No recurring entries yet.';
  } else {
    const parts = [`${active.length} active`];
    if (activeExp) parts.push(`${money(activeExp)}/mo spent`);
    if (activeInc) parts.push(`+${money(activeInc)}/mo income`);
    el.recSummary.textContent = parts.join(' · ');
  }

  el.recEmpty.hidden = rules.length > 0;
  el.recList.replaceChildren(
    ...rules.map((rule) => {
      const isIncome = itemType(rule) === 'income';
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
      const kindTag = isIncome ? ' · Income' : '';
      sub.textContent = rule.active && next
        ? `${freqLabel}${kindTag} · Next ${prettyDate(next, true)}`
        : `${freqLabel}${kindTag} · Paused`;
      main.append(title, sub);

      const amt = document.createElement('span');
      amt.className = 'rec-amt' + (isIncome ? ' income' : '');
      amt.textContent = `${isIncome ? '+' : ''}${money(rule.amount)}`;

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

/* ── Entry type & mini calculator ──────────────────────── */

function setEntryType(type, instant = false) {
  selectedType = type === 'income' ? 'income' : 'expense';
  if (el.entryTypeSeg) {
    el.entryTypeSeg.querySelectorAll('.entry-type-btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.dataset.type === selectedType ? 'true' : 'false');
    });
    moveSegInk(el.entryTypeSeg, instant);
  }
  const editing = Boolean(editingId);
  el.sheetTitle.textContent = editing
    ? selectedType === 'income'
      ? 'Edit income'
      : 'Edit expense'
    : selectedType === 'income'
      ? 'New income'
      : 'New expense';
  el.submitBtn.textContent = editing ? 'Save changes' : selectedType === 'income' ? 'Add income' : 'Add expense';
  if (el.noteLabel) {
    el.noteLabel.textContent = selectedType === 'income' ? 'Where from' : 'What was it';
  }
  el.note.placeholder = selectedType === 'income' ? 'Monthly paycheck' : 'Lunch with Sam';

  const validCats = catsFor(selectedType);
  if (!validCats.some((c) => c.id === selectedCat)) {
    selectedCat = selectedType === 'income' ? 'inc-salary' : 'food';
  }
  closeNewCat(false);
  renderChips();
}

const calc = { open: false, lhs: null, op: null, freshRhs: false, exprDone: '' };

function resetCalcState() {
  calc.lhs = null;
  calc.op = null;
  calc.freshRhs = false;
  calc.exprDone = '';
  renderCalcExpr();
}

function setCalcOpen(open) {
  calc.open = Boolean(open);
  if (el.calcPad) el.calcPad.hidden = !calc.open;
  if (el.calcToggle) el.calcToggle.setAttribute('aria-expanded', calc.open ? 'true' : 'false');
  renderCalcExpr();
}

function opSymbol(op) {
  if (op === '/') return '÷';
  if (op === '*') return '×';
  if (op === '-') return '−';
  return '+';
}

function formatCalcNum(num) {
  const d = cur().decimals === 0 ? 0 : 2;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: d,
  }).format(num);
}

function renderCalcExpr() {
  if (!el.calcExpr) return;
  if (calc.op && calc.lhs !== null) {
    el.calcExpr.textContent = `${formatCalcNum(calc.lhs)} ${opSymbol(calc.op)}`;
    el.calcExpr.hidden = false;
  } else if (calc.exprDone) {
    el.calcExpr.textContent = calc.exprDone;
    el.calcExpr.hidden = false;
  } else {
    el.calcExpr.textContent = '';
    el.calcExpr.hidden = true;
  }
}

function parseRawFloat(val) {
  const clean = String(val || '').replace(/,/g, '').trim();
  if (!clean) return NaN;
  const n = Number.parseFloat(clean);
  return Number.isFinite(n) ? n : NaN;
}

function setAmountBuffer(rawStr) {
  const decimals = cur().decimals === 0 ? 0 : 2;
  let intDigits = '';
  let decDigits = '';
  let hasDot = false;
  for (let i = 0; i < rawStr.length; i++) {
    const ch = rawStr[i];
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
  if (intDigits.length > 1) intDigits = intDigits.replace(/^0+/, '') || '0';
  if (hasDot && intDigits === '') intDigits = '0';
  const grouped = intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  el.amount.value = hasDot ? `${grouped}.${decDigits}` : grouped;
  syncAmountInput();
  fitAmountInput();
  const cents = parseMoney(el.amount.value);
  if (Number.isFinite(cents) && cents > 0 && !el.amountErr.hidden) {
    el.amountErr.hidden = true;
    el.amountErr.textContent = '';
    el.amount.setAttribute('aria-invalid', 'false');
  }
}

function evalCalcOp(lhs, op, rhs) {
  if (op === '+') return lhs + rhs;
  if (op === '-') return lhs - rhs;
  if (op === '*') return lhs * rhs;
  if (op === '/') return rhs === 0 ? NaN : lhs / rhs;
  return rhs;
}

function commitCalcEquals() {
  if (!calc.op || calc.lhs === null) return true;
  const rhs = calc.freshRhs ? calc.lhs : parseRawFloat(el.amount.value);
  if (!Number.isFinite(rhs)) {
    const cents = Math.max(0, Math.round(calc.lhs * 100));
    el.amount.value = cents > 0 ? formatInputMoney(cents) : '';
    syncAmountInput();
    fitAmountInput();
    calc.lhs = null;
    calc.op = null;
    calc.freshRhs = true;
    calc.exprDone = '';
    renderCalcExpr();
    return true;
  }
  const res = evalCalcOp(calc.lhs, calc.op, rhs);
  if (!Number.isFinite(res)) {
    toast('Cannot divide by zero');
    return false;
  }
  const clamped = Math.max(0, res);
  const cents = Math.round(clamped * 100);
  calc.exprDone = `${formatCalcNum(calc.lhs)} ${opSymbol(calc.op)} ${formatCalcNum(rhs)} =`;
  calc.lhs = null;
  calc.op = null;
  calc.freshRhs = true;
  el.amount.value = cents > 0 ? formatInputMoney(cents) : '0';
  syncAmountInput();
  fitAmountInput();
  renderCalcExpr();
  return true;
}

/* ── Sheet ─────────────────────────────────────────────── */

function openSheet(item, defaultRepeat = 'never') {
  lastFocus = document.activeElement;
  editingId = item ? item.id : null;
  if (!el.currencyPop.hidden) closeCurrencyPop();
  if (!el.backupPop.hidden) closeBackupPop();
  el.sheet.hidden = false;
  el.scrim.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    el.sheet.classList.add('open');
    el.scrim.classList.add('show');
    fitAmountInput();
    moveChipInk(true);
    moveSegInk(el.entryTypeSeg, true);
    moveSegInk(el.repeatSeg, true);
  });
  sheetOpen = true;
  el.amountErr.hidden = true;
  el.amount.setAttribute('aria-invalid', 'false');

  const initialType = item ? itemType(item) : typeFilter === 'income' ? 'income' : 'expense';
  selectedCat = item ? item.cat : initialType === 'income' ? 'inc-salary' : 'food';
  setEntryType(initialType, true);

  el.amount.value = item ? formatInputMoney(item.amount) : '';
  syncAmountInput();
  fitAmountInput();
  resetCalcState();
  setCalcOpen(false);

  el.note.value = item ? item.note || '' : '';
  selectedRepeat = item ? 'never' : defaultRepeat;
  el.repeatRow.hidden = Boolean(item);
  paintRepeat(true);
  whenISO = item ? item.date : todayISO();
  whenMin = item && item.time ? hhmmToMinutes(item.time) : nowMinutes();
  whenView = whenISO.slice(0, 7);
  closeWhen();
  renderWhen();
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
    } else if (event.key === 'Escape' && !el.backupPop.hidden) {
      closeBackupPop();
      el.backupBtn.focus();
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
  if (calc.op && calc.lhs !== null) {
    if (!commitCalcEquals()) return;
  }
  const amount = parseMoney(el.amount.value);
  const ok = Number.isFinite(amount) && amount > 0;

  el.amountErr.hidden = ok;
  el.amountErr.textContent = ok ? '' : 'Enter an amount above zero.';
  el.amount.setAttribute('aria-invalid', ok ? 'false' : 'true');

  if (!ok) {
    el.amount.focus();
    return;
  }

  const type = selectedType === 'income' ? 'income' : 'expense';
  const validCats = catsFor(type);
  const cat = validCats.some((c) => c.id === selectedCat) ? selectedCat : type === 'income' ? 'inc-other' : 'other';
  const date = whenISO > todayISO() ? todayISO() : whenISO;
  const note = el.note.value.trim().slice(0, 80) || catLabel(cat);
  const time = minutesToHHMM(whenMin);
  const editing = editingId;
  const repeat = editing ? 'never' : selectedRepeat;

  if (editing) {
    const it = state.items.find((x) => x.id === editing);
    if (it) Object.assign(it, { type, amount, cat, note, date, time });
  } else if (repeat !== 'never') {
    const rule = {
      id: `r-${Date.now().toString(36)}`,
      type,
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
    state.items.push({ id: String(Date.now()), type, amount, cat, note, date, time });
  }
  save();
  editingId = null;

  month = date.slice(0, 7);
  if (typeFilter !== 'all' && typeFilter !== type) typeFilter = type;
  if (filter !== 'all' && filter !== cat) filter = 'all';

  el.amount.value = '';
  syncAmountInput();
  resetCalcState();
  setCalcOpen(false);
  el.note.value = '';
  closeSheet();
  render();
  const verb = editing ? 'Saved' : repeat !== 'never' ? `Added ${repeat}` : 'Added';
  toast(`${verb} ${type === 'income' ? '+' : ''}${money(amount)} · ${catLabel(cat)}`);
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
  closeSwipedRow();
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
  const swipeDel = event.target.closest('.swipe-del-btn');
  if (swipeDel) {
    const li = swipeDel.closest('.item');
    closeSwipedRow();
    removeItem(swipeDel.dataset.id, li);
    return;
  }

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

  const editBtn = event.target.closest('.edit-btn');
  if (editBtn) {
    disarmRow();
    closeSwipedRow();
    openSheet(state.items.find((it) => it.id === editBtn.dataset.id));
    return;
  }

  if (li.classList.contains('swiped')) {
    closeSwipedRow();
    return;
  }

  disarmRow();
  closeSwipedRow();
  openSheet(state.items.find((it) => it.id === li.dataset.id));
});

el.items.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  if (event.target.closest('button')) return;
  const li = event.target.closest('.item');
  if (!li) return;
  event.preventDefault();
  disarmRow();
  closeSwipedRow();
  openSheet(state.items.find((it) => it.id === li.dataset.id));
});

document.addEventListener('click', (event) => {
  if (!swipedRow) return;
  if (event.target.closest('.item.swiped')) return;
  closeSwipedRow();
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

const focusBudgetField = () => {
  el.budget.focus();
  el.budget.select();
  el.budget.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
};

el.ringWrap.addEventListener('click', focusBudgetField);
if (el.left) el.left.addEventListener('click', focusBudgetField);

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
  typeFilter = 'all';
  filter = 'all';
  selectedType = 'expense';
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
  moveInk(true);
  moveSegInk(el.whereSeg, true);
  moveSegInk(el.typeSeg, true);
  fitAllHeroTotals();
  if (sheetOpen) {
    fitAmountInput();
    moveChipInk(true);
    moveSegInk(el.entryTypeSeg, true);
    moveSegInk(el.repeatSeg, true);
  }
});

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    moveInk(true);
    moveSegInk(el.whereSeg, true);
    moveSegInk(el.typeSeg, true);
    fitAllHeroTotals();
    if (sheetOpen) {
      fitAmountInput();
      moveChipInk(true);
      moveSegInk(el.entryTypeSeg, true);
      moveSegInk(el.repeatSeg, true);
    }
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
    const entry = byDay.get(d) || { spent: 0, income: 0, count: 0 };
    if (itemType(it) === 'income') entry.income += it.amount;
    else entry.spent += it.amount;
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
        ? `${readable}, ${info.spent ? `${money(info.spent)} spent` : ''}${info.spent && info.income ? ', ' : ''}${info.income ? `+${money(info.income)} income` : ''} across ${info.count} ${info.count === 1 ? 'entry' : 'entries'}`
        : `${readable}, no entries`
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
  const spentTotal = items.reduce((sum, it) => sum + (itemType(it) === 'expense' ? it.amount : 0), 0);
  const incTotal = items.reduce((sum, it) => sum + (itemType(it) === 'income' ? it.amount : 0), 0);
  const label = calSel
    ? new Date(`${calSel}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'Pick a day';
  const summaryParts = [];
  if (spentTotal) summaryParts.push(money(spentTotal));
  if (incTotal) summaryParts.push(`+${money(incTotal)}`);
  el.calDayLabel.textContent = summaryParts.length ? `${label} · ${summaryParts.join(' · ')}` : label;

  el.calList.replaceChildren(
    ...items.map((it) => {
      const isIncome = itemType(it) === 'income';
      const li = document.createElement('li');
      const time = document.createElement('span');
      time.className = 'cal-time';
      time.textContent = it.time ? prettyTime(it.time) : '—';
      const note = document.createElement('span');
      note.className = 'cal-note';
      note.textContent = it.note || catLabel(it.cat);
      const amt = document.createElement('span');
      amt.className = 'cal-amt' + (isIncome ? ' cashflow-inc' : '');
      amt.textContent = `${isIncome ? '+' : ''}${money(it.amount)}`;
      li.append(time, note, amt);
      return li;
    })
  );
  el.calEmpty.textContent = 'No entries that day.';
  el.calEmpty.hidden = items.length > 0;
}

function openCal() {
  if (!el.currencyPop.hidden) closeCurrencyPop();
  if (!el.backupPop.hidden) closeBackupPop();
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

/* ── Currency, backup, trends & search controls ────────── */

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
  if (!el.backupPop.hidden) closeBackupPop();
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

/* ── CSV export & JSON backup/restore ──────────────────── */

let pendingRestore = null;

function openBackupPop() {
  if (!el.calendar.hidden) closeCal();
  if (!el.currencyPop.hidden) closeCurrencyPop();
  pendingRestore = null;
  if (el.restoreConfirm) el.restoreConfirm.hidden = true;
  if (el.restoreFile) el.restoreFile.value = '';
  el.backupPop.hidden = false;
  el.backupBtn.setAttribute('aria-expanded', 'true');
}

function closeBackupPop() {
  if (!el.backupPop) return;
  pendingRestore = null;
  if (el.restoreConfirm) el.restoreConfirm.hidden = true;
  if (el.restoreFile) el.restoreFile.value = '';
  el.backupPop.hidden = true;
  el.backupBtn.setAttribute('aria-expanded', 'false');
}

function csvCell(val) {
  let s = String(val == null ? '' : val);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function downloadTextFile(filename, mime, content) {
  const blob = new Blob([content], { type: mime });
  const isNative = Boolean(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
  if (isNative && typeof File !== 'undefined' && navigator.canShare && navigator.share) {
    try {
      const file = new File([blob], filename, { type: mime });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: filename });
        return true;
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return false;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.append(a);
  a.click();
  window.setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 1000);
  return true;
}

async function exportCSV() {
  const c = cur();
  const d = c.decimals === 0 ? 0 : 2;
  const sorted = sortExpenses(state.items.slice());
  const lines = [['Date', 'Time', 'Type', 'Category', 'Note', 'Amount', 'Currency', 'Recurring'].join(',')];
  for (const it of sorted) {
    const type = itemType(it) === 'income' ? 'Income' : 'Expense';
    const amt = d === 0 ? String(Math.round(it.amount / 100)) : (it.amount / 100).toFixed(2);
    lines.push(
      [
        csvCell(it.date),
        csvCell(it.time || ''),
        csvCell(type),
        csvCell(catLabel(it.cat)),
        csvCell(it.note || ''),
        csvCell(amt),
        csvCell(c.code || c.symbol),
        csvCell(it.recurringId ? 'Yes' : 'No'),
      ].join(',')
    );
  }
  const ok = await downloadTextFile(`spent-entries-${todayISO()}.csv`, 'text/csv;charset=utf-8', '\uFEFF' + lines.join('\r\n'));
  closeBackupPop();
  if (ok) toast(`Exported ${sorted.length} ${sorted.length === 1 ? 'entry' : 'entries'} to CSV`);
}

async function exportJSON() {
  const payload = {
    app: 'spent',
    version: 2,
    exportedAt: new Date().toISOString(),
    data: state,
  };
  const ok = await downloadTextFile(
    `spent-backup-${todayISO()}.json`,
    'application/json;charset=utf-8',
    JSON.stringify(payload, null, 2)
  );
  closeBackupPop();
  if (ok) toast('Backup downloaded');
}

function readFileAsText(file) {
  if (typeof file.text === 'function') return file.text();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('Read failed'));
    reader.readAsText(file);
  });
}

function cloneStateSnapshot(s) {
  return JSON.parse(JSON.stringify(s));
}

if (el.backupBtn) {
  el.backupBtn.addEventListener('click', () => {
    if (el.backupPop.hidden) openBackupPop();
    else closeBackupPop();
  });
  el.backupClose.addEventListener('click', () => {
    closeBackupPop();
    el.backupBtn.focus();
  });
  el.exportCsvBtn.addEventListener('click', exportCSV);
  el.exportJsonBtn.addEventListener('click', exportJSON);
  el.restoreBtn.addEventListener('click', () => {
    el.restoreFile.click();
  });
  el.restoreFile.addEventListener('change', async () => {
    const file = el.restoreFile.files && el.restoreFile.files[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const parsed = JSON.parse(text);
      const source = parsed && typeof parsed === 'object' && parsed.app === 'spent' && parsed.data ? parsed.data : parsed;
      if (!source || typeof source !== 'object' || (!Array.isArray(source.items) && !source.budgets && !Array.isArray(source.recurring))) {
        toast('Not a valid Spent backup file');
        el.restoreFile.value = '';
        return;
      }
      pendingRestore = normalizeState(source);
      const entryCount = pendingRestore.items.length;
      const budgetCount = Object.keys(pendingRestore.budgets).length;
      el.restoreMsg.textContent = `Found ${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}${budgetCount ? ` and ${budgetCount} ${budgetCount === 1 ? 'budget' : 'budgets'}` : ''}. Merge or replace existing data?`;
      el.restoreConfirm.hidden = false;
    } catch {
      toast('Could not read that backup file');
      el.restoreFile.value = '';
    }
  });
  el.restoreCancelBtn.addEventListener('click', () => {
    pendingRestore = null;
    el.restoreConfirm.hidden = true;
    el.restoreFile.value = '';
  });
  el.restoreMergeBtn.addEventListener('click', () => {
    if (!pendingRestore) return;
    const prev = cloneStateSnapshot(state);
    const incoming = pendingRestore;
    const seenIds = new Set(state.items.map((it) => it.id));
    let added = 0;
    for (const it of incoming.items) {
      if (!seenIds.has(it.id)) {
        state.items.push(it);
        seenIds.add(it.id);
        added++;
      }
    }
    const seenCats = new Set(state.cats.map((c) => c.id));
    for (const c of incoming.cats) {
      if (!seenCats.has(c.id)) {
        state.cats.push(c);
        seenCats.add(c.id);
      }
    }
    const seenRec = new Set(state.recurring.map((r) => r.id));
    for (const r of incoming.recurring) {
      if (!seenRec.has(r.id)) {
        state.recurring.push(r);
        seenRec.add(r.id);
      }
    }
    state.budgets = { ...incoming.budgets, ...state.budgets };
    syncRecurring(false);
    save();
    closeBackupPop();
    render();
    toast(`Merged ${added} new ${added === 1 ? 'entry' : 'entries'}`, 'Undo', () => {
      state = prev;
      save();
      render();
    });
  });
  el.restoreReplaceBtn.addEventListener('click', () => {
    if (!pendingRestore) return;
    const prev = cloneStateSnapshot(state);
    state = pendingRestore;
    typeFilter = 'all';
    filter = 'all';
    syncRecurring(false);
    save();
    closeBackupPop();
    render();
    toast(`Restored ${state.items.length} ${state.items.length === 1 ? 'entry' : 'entries'}`, 'Undo', () => {
      state = prev;
      save();
      render();
    });
  });
}

document.addEventListener('click', (event) => {
  if (event.target.closest('.top-in')) return;
  if (!el.currencyPop.hidden) closeCurrencyPop();
  if (el.backupPop && !el.backupPop.hidden) closeBackupPop();
});

/* ── Entry type, mini calculator & activity filters ────── */

if (el.typeSeg) {
  el.typeSeg.addEventListener('click', (event) => {
    const btn = event.target.closest('.type-btn');
    if (!btn || btn.dataset.type === typeFilter) return;
    typeFilter = btn.dataset.type;
    filter = 'all';
    render({ instant: false });
  });
}

if (el.entryTypeSeg) {
  el.entryTypeSeg.addEventListener('click', (event) => {
    const btn = event.target.closest('.entry-type-btn');
    if (!btn || btn.dataset.type === selectedType) return;
    setEntryType(btn.dataset.type, false);
  });
}

if (el.calcToggle) {
  el.calcToggle.addEventListener('click', () => {
    setCalcOpen(!calc.open);
    if (!calc.open) el.amount.focus();
  });
}

if (el.calcPad) {
  el.calcPad.addEventListener('click', (event) => {
    const key = event.target.closest('.calc-key');
    if (!key || key.disabled) return;
    const digit = key.dataset.digit;
    const op = key.dataset.op;
    const act = key.dataset.calc;

    if (digit !== undefined) {
      const currentRaw = calc.freshRhs ? '' : el.amount.value.replace(/,/g, '');
      if (currentRaw.replace('.', '').length >= 13) return;
      if (calc.freshRhs && !calc.op) calc.exprDone = '';
      calc.freshRhs = false;
      setAmountBuffer(currentRaw + digit);
      renderCalcExpr();
      return;
    }

    if (act === 'dot') {
      if (cur().decimals === 0) return;
      if (calc.freshRhs && !calc.op) calc.exprDone = '';
      const currentRaw = calc.freshRhs ? '' : el.amount.value.replace(/,/g, '');
      calc.freshRhs = false;
      if (!currentRaw.includes('.')) {
        setAmountBuffer((currentRaw || '0') + '.');
      }
      renderCalcExpr();
      return;
    }

    if (act === 'clear') {
      resetCalcState();
      setAmountBuffer('');
      return;
    }

    if (act === 'back') {
      if (calc.freshRhs) {
        calc.freshRhs = false;
        setAmountBuffer('');
        return;
      }
      const currentRaw = el.amount.value.replace(/,/g, '');
      setAmountBuffer(currentRaw.slice(0, -1));
      return;
    }

    if (op) {
      const curr = parseRawFloat(el.amount.value);
      if (calc.op && calc.lhs !== null && !calc.freshRhs && Number.isFinite(curr)) {
        const res = evalCalcOp(calc.lhs, calc.op, curr);
        if (!Number.isFinite(res)) {
          toast('Cannot divide by zero');
          return;
        }
        calc.lhs = Math.max(0, res);
        const cents = Math.round(calc.lhs * 100);
        el.amount.value = cents > 0 ? formatInputMoney(cents) : '0';
        syncAmountInput();
        fitAmountInput();
      } else if (Number.isFinite(curr)) {
        calc.lhs = curr;
      } else if (calc.lhs === null) {
        calc.lhs = 0;
      }
      calc.op = op;
      calc.freshRhs = true;
      calc.exprDone = '';
      renderCalcExpr();
      return;
    }

    if (act === 'eq') {
      commitCalcEquals();
      return;
    }

    if (act === 'done') {
      if (calc.op && calc.lhs !== null && !calc.freshRhs) {
        if (!commitCalcEquals()) return;
      }
      setCalcOpen(false);
    }
  });
}

el.viewBreakBtn.addEventListener('click', () => {
  if (whereView === 'breakdown') return;
  whereView = 'breakdown';
  render({ instant: false });
});
el.viewTrendBtn.addEventListener('click', () => {
  if (whereView === 'trends') return;
  whereView = 'trends';
  render({ instant: true, animateWhereSeg: true });
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
    if (el.backupPop && !el.backupPop.hidden) {
      closeBackupPop();
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
render({ instant: true });
