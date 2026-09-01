import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRemaining, thresholdLabel, urgencyFromRemaining } from '../utils/deadlineNotifications';
import { Bell, CheckCheck, Settings } from 'lucide-react';

const urgencyDot = {
  critical: 'bg-critical',
  urgent: 'bg-warn',
  calm: 'bg-calm',
};

export const NotificationBell = () => {
  const {
    history,
    unreadCount,
    markRead,
    markAllRead,
    openNotice,
    setSettingsOpen,
    appliedNotices = [],
  } = useApp();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const recent = history.slice(0, 15);

  const handleItem = (item) => {
    markRead(item.id);
    openNotice(item.noticeId);
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-md text-muted hover:text-ink hover:bg-app border border-transparent hover:border-line transition-colors"
        aria-label="Deadline notifications"
        title="Deadline notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[1rem] h-4 px-0.5 rounded-full bg-critical text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-[min(22rem,calc(100vw-2rem))] bg-surface border border-line rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-line">
            <p className="text-xs font-semibold text-ink">Alerts</p>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-muted hover:text-ink hover:bg-app"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => {
                  setOpen(false);
                  setSettingsOpen(true);
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-muted hover:text-ink hover:bg-app"
              >
                <Settings className="w-3 h-3" />
                Settings
              </button>
            </div>
          </div>

          {recent.length === 0 ? (
            <p className="px-3 py-8 text-center text-xs text-muted">
              No deadline alerts yet. Live batch notices will appear here as thresholds hit.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {recent.map((item) => {
                const band = urgencyFromRemaining(item.remainingMs);
                const isApplied = appliedNotices.includes(item.noticeId);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleItem(item)}
                      className={`w-full text-left px-3 py-2.5 border-b border-line last:border-0 hover:bg-app transition-colors ${
                        item.read ? '' : 'bg-accent-soft/50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${urgencyDot[band]}`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 justify-between">
                            <p className="text-xs font-semibold text-ink truncate">{item.title}</p>
                            {isApplied && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-ok-soft text-ok border border-ok/30 shrink-0">
                                Applied
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted truncate">
                            {item.publisher} · {thresholdLabel(item.threshold)} (
                            {formatRemaining(item.remainingMs)} left)
                          </p>
                          <p className="text-[10px] text-muted font-mono mt-0.5">
                            {new Date(item.firedAt).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {!item.read && (
                          <span className="text-[9px] font-bold uppercase tracking-wide text-accent shrink-0">
                            New
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export const NotificationPermissionBanner = () => {
  const { showPermissionBanner, requestBrowserPermission, dismissPermissionBanner } = useApp();
  if (!showPermissionBanner) return null;

  return (
    <div className="mb-4 rounded-xl border border-calm-border bg-calm-soft/60 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-ink">Enable desktop deadline alerts?</p>
        <p className="text-[11px] text-muted mt-0.5">
          Optional. In-app toasts always work for upcoming deadlines while this tab is open.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={dismissPermissionBanner}
          className="px-2.5 py-1.5 rounded-md text-xs font-medium text-muted hover:text-ink border border-line bg-surface"
        >
          Not now
        </button>
        <button
          onClick={requestBrowserPermission}
          className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-accent text-accent-fg"
        >
          Allow notifications
        </button>
      </div>
    </div>
  );
};
