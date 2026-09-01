import React from 'react';
import { useApp } from '../context/AppContext';
import {
  THRESHOLD_OPTIONS,
  formatRemaining,
  playDeadlineAlertSound,
  thresholdLabel,
  unlockDeadlineAudio,
} from '../utils/deadlineNotifications';
import { Bell, BellOff, Info, Volume2, X } from 'lucide-react';

export const NotificationSettings = () => {
  const {
    settingsOpen,
    setSettingsOpen,
    settings,
    updateSettings,
    toggleThreshold,
    history,
    requestBrowserPermission,
    permission,
    notificationsSupported,
    showToast,
  } = useApp();

  if (!settingsOpen) return null;

  const browserOn = settings.browserEnabled && permission === 'granted';

  const handleBrowserToggle = async () => {
    if (browserOn) {
      updateSettings({ browserEnabled: false });
      return;
    }
    if (permission === 'granted') {
      updateSettings({ browserEnabled: true, askedPermission: true });
      return;
    }
    await requestBrowserPermission();
  };

  const playTestAlert = async () => {
    unlockDeadlineAudio();
    if (permission !== 'granted') {
      await requestBrowserPermission();
    }
    playDeadlineAlertSound();
    showToast('Test reminder · PulseLine deadline alert', 'critical', {
      duration: 8000,
      placement: 'top',
    });
    if (notificationsSupported && Notification.permission === 'granted') {
      try {
        const n = new Notification('PulseLine · Test reminder', {
          body: 'This is how deadline alerts look and sound.',
          silent: false,
          requireInteraction: true,
          tag: 'pulseline-test',
        });
        n.onclick = () => {
          window.focus();
          n.close();
        };
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-line rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 space-y-5 shadow-xl relative">
        <button
          onClick={() => setSettingsOpen(false)}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-md text-muted hover:text-ink hover:bg-app"
          aria-label="Close notification settings"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h3 className="font-display text-lg font-semibold text-ink">Deadline alerts</h3>
          <p className="text-xs text-muted mt-1">
            Alerts fire for live unapplied notices in your PGP batch, plus anything you have Saved. Once marked Applied, deadline alerts stop automatically.
          </p>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-lg border border-line bg-app text-xs text-muted">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
          <p>
            Alerts only fire while this tab is open. This prototype has no backend push, email, or
            SMS.
          </p>
        </div>

        <section className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Browser notifications
          </h4>
          <div className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl border border-line bg-surface">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ink flex items-center gap-1.5">
                {browserOn ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                Desktop alerts
              </p>
              <p className="text-[11px] text-muted">
                {!notificationsSupported
                  ? 'Not supported in this browser'
                  : permission === 'denied'
                    ? 'Blocked in browser settings — toasts still work'
                    : permission === 'granted'
                      ? 'Permission granted'
                      : 'Requires permission'}
              </p>
            </div>
            <button
              onClick={handleBrowserToggle}
              disabled={permission === 'denied' || !notificationsSupported}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                browserOn ? 'bg-accent' : 'bg-line-strong'
              } ${permission === 'denied' || !notificationsSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-pressed={browserOn}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  browserOn ? 'translate-x-[1.25rem]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          {permission === 'denied' && (
            <p className="text-[11px] text-muted">
              Browser alerts are blocked. Change the site permission in your browser, or keep using
              in-app toasts.
            </p>
          )}
          <button
            type="button"
            onClick={playTestAlert}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-semibold border border-line bg-app text-ink hover:bg-surface"
          >
            <Volume2 className="w-4 h-4" />
            Play test alert (sound + banner)
          </button>
        </section>

        <section className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Remind me when remaining time is
          </h4>
          <div className="grid grid-cols-2 gap-1.5">
            {THRESHOLD_OPTIONS.map(({ hours, label }) => {
              const on = (settings.enabledThresholds || []).includes(hours);
              return (
                <button
                  key={hours}
                  type="button"
                  onClick={() => toggleThreshold(hours)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border text-left transition-colors ${
                    on
                      ? 'border-accent bg-accent-soft text-ink'
                      : 'border-line bg-app text-muted hover:text-ink'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Recent alerts
          </h4>
          {history.length === 0 ? (
            <p className="text-xs text-muted py-3 text-center border border-dashed border-line rounded-lg">
              No alerts yet. Save a live notice to start tracking.
            </p>
          ) : (
            <ul className="space-y-1.5 max-h-48 overflow-y-auto">
              {history.slice(0, 20).map((item) => (
                <li
                  key={item.id}
                  className="px-3 py-2 rounded-lg border border-line bg-app text-xs"
                >
                  <p className="font-semibold text-ink truncate">{item.title}</p>
                  <p className="text-[11px] text-muted">
                    {thresholdLabel(item.threshold)} · {formatRemaining(item.remainingMs)} left ·{' '}
                    {new Date(item.firedAt).toLocaleString([], {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
