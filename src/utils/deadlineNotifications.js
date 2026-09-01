export const THRESHOLDS_KEY = 'pulseline_iimv_notif_thresholds_v1';
export const SETTINGS_KEY = 'pulseline_iimv_notif_settings_v1';
export const HISTORY_KEY = 'pulseline_iimv_notif_history_v1';

/** Hours before deadline. 0.5 = 30 minutes. */
export const THRESHOLD_HOURS = [24, 12, 6, 3, 1, 0.5];

export const THRESHOLD_OPTIONS = [
  { hours: 24, label: '24 hours' },
  { hours: 12, label: '12 hours' },
  { hours: 6, label: '6 hours' },
  { hours: 3, label: '3 hours' },
  { hours: 1, label: '1 hour' },
  { hours: 0.5, label: '30 minutes' },
];

export const CHECK_INTERVAL_MS = 10000;
export const MAX_HISTORY = 20;

export const defaultSettings = () => ({
  browserEnabled: true,
  askedPermission: false,
  enabledThresholds: [...THRESHOLD_HOURS],
});

export const readStore = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const writeStore = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadUserSettings = (userId) => {
  if (!userId) return defaultSettings();
  const all = readStore(SETTINGS_KEY, {});
  return { ...defaultSettings(), ...(all[userId] || {}) };
};

export const saveUserSettings = (userId, settings) => {
  if (!userId) return;
  const all = readStore(SETTINGS_KEY, {});
  all[userId] = settings;
  writeStore(SETTINGS_KEY, all);
};

export const loadUserHistory = (userId) => {
  if (!userId) return [];
  const all = readStore(HISTORY_KEY, {});
  return all[userId] || [];
};

export const saveUserHistory = (userId, history) => {
  if (!userId) return;
  const all = readStore(HISTORY_KEY, {});
  all[userId] = history.slice(0, MAX_HISTORY);
  writeStore(HISTORY_KEY, all);
};

export const loadThresholdMap = (userId) => {
  if (!userId) return {};
  const all = readStore(THRESHOLDS_KEY, {});
  return all[userId] || {};
};

export const saveThresholdMap = (userId, userMap) => {
  if (!userId) return;
  const all = readStore(THRESHOLDS_KEY, {});
  all[userId] = userMap;
  writeStore(THRESHOLDS_KEY, all);
};

export const notificationsSupported = () =>
  typeof window !== 'undefined' && 'Notification' in window;

export const browserPermission = () => {
  if (!notificationsSupported()) return 'unsupported';
  return Notification.permission;
};

export const formatRemaining = (ms) => {
  const totalMin = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h >= 24 && m === 0) return `${h} hours`;
  if (h >= 1) return m ? `${h}h ${m}m` : `${h}h`;
  if (totalMin === 1) return '1 minute';
  return `${totalMin} minutes`;
};

export const thresholdLabel = (hours) =>
  THRESHOLD_OPTIONS.find((o) => o.hours === hours)?.label || `${hours}h`;

/** Same bands as the student feed: <2h critical, 2–24h urgent, else calm. */
export const urgencyFromRemaining = (remainingMs) => {
  if (remainingMs <= 2 * 60 * 60 * 1000) return 'critical';
  if (remainingMs <= 24 * 60 * 60 * 1000) return 'urgent';
  return 'calm';
};

export const getCurrentThreshold = (remainingMs) => {
  if (remainingMs <= 0) return null;
  const remainingH = remainingMs / (1000 * 60 * 60);
  const crossed = THRESHOLD_HOURS.filter((t) => remainingH <= t);
  if (crossed.length === 0) return null;
  return Math.min(...crossed);
};

export const thresholdEnabled = (enabled, hours) =>
  (enabled || []).some((t) => Number(t) === Number(hours));

export const isBatchEligible = (notice, profile) => {
  const batch = profile?.batch;
  if (!batch) return true;
  return (
    notice.eligibleBatches?.includes(batch) ||
    notice.eligibleBatches?.includes('All PGP') ||
    notice.eligibleBatches?.includes('All Batches')
  );
};

let audioCtx = null;

export const unlockDeadlineAudio = () => {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch {
    /* ignore */
  }
};

/** Short two-tone chime — browsers block this until the user has clicked once. */
export const playDeadlineAlertSound = () => {
  try {
    unlockDeadlineAudio();
    if (!audioCtx) return;
    const ctx = audioCtx;
    const now = ctx.currentTime;
    const tone = (freq, start, dur, peak = 0.18) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);
      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(peak, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.05);
    };
    tone(880, 0, 0.14);
    tone(1174.7, 0.13, 0.22);
  } catch {
    /* ignore */
  }
};
