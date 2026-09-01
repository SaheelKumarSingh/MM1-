import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CHECK_INTERVAL_MS,
  MAX_HISTORY,
  THRESHOLD_HOURS,
  browserPermission,
  formatRemaining,
  getCurrentThreshold,
  isBatchEligible,
  loadThresholdMap,
  loadUserHistory,
  loadUserSettings,
  notificationsSupported,
  playDeadlineAlertSound,
  saveThresholdMap,
  saveUserHistory,
  saveUserSettings,
  thresholdEnabled,
  thresholdLabel,
  unlockDeadlineAudio,
  urgencyFromRemaining,
} from '../utils/deadlineNotifications';

export const useDeadlineNotifications = ({
  currentUser,
  notices,
  bookmarks,
  appliedNotices,
  activeProfile,
  showToast,
  dismissToastsForNotices,
  setDetailModalNotice,
}) => {
  const userId = currentUser?.id || null;
  const isStudent = currentUser?.role === 'student';

  const [settings, setSettingsState] = useState(() => loadUserSettings(userId));
  const [history, setHistoryState] = useState(() => loadUserHistory(userId));
  const [settingsOpen, setSettingsOpen] = useState(false);

  const refs = useRef({});
  refs.current = {
    currentUser,
    notices,
    bookmarks,
    appliedNotices,
    activeProfile,
    settings,
    isStudent,
    showToast,
    dismissToastsForNotices,
    setDetailModalNotice,
  };

  useEffect(() => {
    setSettingsState(loadUserSettings(userId));
    setHistoryState(loadUserHistory(userId));
    setSettingsOpen(false);
  }, [userId]);

  const persistSettings = useCallback(
    (next) => {
      setSettingsState(next);
      saveUserSettings(userId, next);
    },
    [userId]
  );

  const persistHistory = useCallback(
    (next) => {
      const clipped = next.slice(0, MAX_HISTORY);
      setHistoryState(clipped);
      saveUserHistory(userId, clipped);
    },
    [userId]
  );

  const updateSettings = useCallback(
    (patch) => {
      persistSettings({ ...refs.current.settings, ...patch });
    },
    [persistSettings]
  );

  const toggleThreshold = useCallback(
    (hours) => {
      const current = refs.current.settings.enabledThresholds || [];
      const enabled = current.includes(hours)
        ? current.filter((h) => h !== hours)
        : [...current, hours].sort((a, b) => b - a);
      persistSettings({ ...refs.current.settings, enabledThresholds: enabled });
    },
    [persistSettings]
  );

  const markRead = useCallback(
    (id) => {
      persistHistory(
        loadUserHistory(userId).map((item) => (item.id === id ? { ...item, read: true } : item))
      );
    },
    [userId, persistHistory]
  );

  const markAllRead = useCallback(() => {
    persistHistory(loadUserHistory(userId).map((item) => ({ ...item, read: true })));
  }, [userId, persistHistory]);

  const openNotice = useCallback(
    (noticeId) => {
      const notice = refs.current.notices.find((n) => n.id === noticeId);
      if (notice) refs.current.setDetailModalNotice(notice);
    },
    []
  );

  const requestBrowserPermission = useCallback(async () => {
    const nextBase = {
      ...refs.current.settings,
      askedPermission: true,
    };

    if (!notificationsSupported()) {
      persistSettings({ ...nextBase, browserEnabled: false });
      refs.current.showToast(
        'This browser does not support desktop notifications. In-app toasts will still fire.',
        'calm'
      );
      return 'unsupported';
    }

    try {
      const result = await Notification.requestPermission();
      const granted = result === 'granted';
      persistSettings({ ...nextBase, browserEnabled: granted });
      refs.current.showToast(
        granted
          ? 'Browser notifications enabled'
          : 'Permission denied — deadline alerts will stay in-app only.',
        granted ? 'success' : 'urgent'
      );
      return result;
    } catch {
      persistSettings({ ...nextBase, browserEnabled: false });
      refs.current.showToast('Could not request notification permission. Using in-app alerts.', 'calm');
      return 'denied';
    }
  }, [persistSettings]);

  const dismissPermissionBanner = useCallback(() => {
    persistSettings({ ...refs.current.settings, askedPermission: true });
  }, [persistSettings]);

  const persistHistoryRef = useRef(persistHistory);
  persistHistoryRef.current = persistHistory;

  const fireAlert = useCallback((notice, thresholdHours, remainingMs) => {
    const { showToast: toast, setDetailModalNotice, settings: s } = refs.current;
    const remainingText = formatRemaining(remainingMs);
    const urgency = urgencyFromRemaining(remainingMs);
    const label = thresholdLabel(thresholdHours);

    playDeadlineAlertSound();

    toast(`${label} left · ${notice.title}`, urgency, {
      noticeId: notice.id,
      duration: 10000,
      placement: 'top',
      playSound: true,
    });

    const pushDesktop = () => {
      if (!notificationsSupported()) return;
      if (s.browserEnabled === false) return;
      if (browserPermission() !== 'granted') return;
      try {
        const n = new Notification(`PulseLine · ${label} left`, {
          body: `${notice.title}\n${notice.publisher} · ${remainingText} remaining`,
          tag: `pulseline-${notice.id}-${thresholdHours}`,
          silent: false,
          requireInteraction: true,
        });
        n.onclick = () => {
          window.focus();
          setDetailModalNotice(notice);
          n.close();
        };
      } catch {
        /* ignore Notification constructor errors */
      }
    };

    pushDesktop();

    return {
      id: `n-${Date.now()}-${notice.id}-${thresholdHours}`,
      noticeId: notice.id,
      title: notice.title,
      publisher: notice.publisher,
      threshold: thresholdHours,
      remainingMs,
      firedAt: new Date().toISOString(),
      read: false,
    };
  }, []);

  const tickRef = useRef(() => {});
  tickRef.current = () => {
    const {
      notices: liveNotices,
      bookmarks: saved,
      appliedNotices: applied,
      settings: s,
      currentUser: user,
      activeProfile: profile,
      dismissToastsForNotices,
    } = refs.current;
    if (!user || user.role !== 'student') return;

    const appliedSet = new Set(applied || []);
    const engaged = new Set(saved || []);
    const now = Date.now();
    const userMap = { ...loadThresholdMap(user.id) };

    if (appliedSet.size > 0 && dismissToastsForNotices) {
      dismissToastsForNotices(appliedSet);
    }

    const isWatched = (notice) => {
      if (appliedSet.has(notice.id)) return false;
      if (engaged.has(notice.id)) return true;
      const remaining = new Date(notice.deadline).getTime() - now;
      if (remaining <= 0) return false;
      return isBatchEligible(notice, profile);
    };

    for (const noticeId of Object.keys(userMap)) {
      const notice = liveNotices.find((n) => n.id === noticeId);
      if (!notice || !isWatched(notice)) delete userMap[noticeId];
    }

    const enabled = s.enabledThresholds || [];
    const newEntries = [];

    for (const notice of liveNotices) {
      if (!isWatched(notice)) continue;

      const remaining = new Date(notice.deadline).getTime() - now;
      if (remaining <= 0) continue;

      const current = getCurrentThreshold(remaining);
      if (current == null) {
        userMap[notice.id] = [];
        continue;
      }

      const remainingH = remaining / (1000 * 60 * 60);
      const crossed = THRESHOLD_HOURS.filter((t) => remainingH <= t);
      let fired = (userMap[notice.id] || []).filter((t) =>
        crossed.some((c) => Number(c) === Number(t))
      );

      for (const t of crossed) {
        if (t > current && !fired.some((f) => Number(f) === Number(t))) fired.push(t);
      }

      const already = fired.some((f) => Number(f) === Number(current));
      if (!already && thresholdEnabled(enabled, current)) {
        const entry = fireAlert(notice, current, remaining);
        if (entry) newEntries.push(entry);
        fired.push(current);
      }

      userMap[notice.id] = fired;
    }

    saveThresholdMap(user.id, userMap);
    if (newEntries.length > 0) {
      persistHistoryRef.current([...newEntries, ...loadUserHistory(user.id)]);
    }
  };

  useEffect(() => {
    if (!isStudent || !userId) return undefined;
    const onFirstGesture = async () => {
      unlockDeadlineAudio();
      if (notificationsSupported() && Notification.permission === 'default') {
        try {
          const result = await Notification.requestPermission();
          persistSettings({
            ...refs.current.settings,
            askedPermission: true,
            browserEnabled: result === 'granted',
          });
        } catch {
          persistSettings({ ...refs.current.settings, askedPermission: true });
        }
      }
    };
    document.addEventListener('pointerdown', onFirstGesture, { once: true });
    return () => document.removeEventListener('pointerdown', onFirstGesture);
  }, [isStudent, userId, persistSettings]);

  useEffect(() => {
    if (!isStudent || !userId) return undefined;
    tickRef.current();
    const id = window.setInterval(() => tickRef.current(), CHECK_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') tickRef.current();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [isStudent, userId]);

  useEffect(() => {
    if (!isStudent || !userId) return;
    tickRef.current();
  }, [isStudent, userId, bookmarks, appliedNotices, notices, settings.enabledThresholds, activeProfile]);

  const unreadCount = history.filter((item) => !item.read).length;
  const permission = browserPermission();
  const showPermissionBanner =
    isStudent &&
    !settings.askedPermission &&
    notificationsSupported() &&
    permission === 'default';

  return {
    settings,
    history,
    unreadCount,
    settingsOpen,
    setSettingsOpen,
    updateSettings,
    toggleThreshold,
    markRead,
    markAllRead,
    openNotice,
    requestBrowserPermission,
    dismissPermissionBanner,
    showPermissionBanner,
    permission,
    notificationsSupported: notificationsSupported(),
  };
};
