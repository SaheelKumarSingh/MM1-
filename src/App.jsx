import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { StudentFeed } from './components/StudentFeed';
import { PublisherPortal } from './components/PublisherPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { ValidationHub } from './components/ValidationHub';
import { WhatsAppModal } from './components/WhatsAppModal';
import { NoticeDetailModal } from './components/NoticeDetailModal';
import { NotificationSettings } from './components/NotificationSettings';
import { NotificationPermissionBanner } from './components/NotificationBell';
import { X } from 'lucide-react';

const TOAST_TONE = {
  success: 'bg-accent text-accent-fg',
  critical: 'bg-critical text-white',
  urgent: 'bg-warn text-white',
  calm: 'bg-calm text-white',
};

const Toast = ({ toast, onOpenNotice, onDismiss, stacked = false }) => {
  const tone = TOAST_TONE[toast.type] || TOAST_TONE.success;
  const clickable = Boolean(toast.noticeId);
  return (
    <div
      className={`${stacked ? '' : 'fixed bottom-5 left-4 right-4 z-50 mx-auto max-w-sm '}w-full ${tone} px-4 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center justify-between gap-3`}
    >
      <button
        type="button"
        disabled={!clickable}
        onClick={() => clickable && onOpenNotice(toast.noticeId)}
        className={`flex-1 text-left ${clickable ? 'cursor-pointer hover:underline' : 'cursor-default'}`}
      >
        {toast.message}
      </button>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/20 transition-colors shrink-0 opacity-80 hover:opacity-100"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const MainLayout = () => {
  const { currentUser, role, toasts, dismissToast, openNotice, history, markRead } = useApp();

  const handleToastNotice = (noticeId) => {
    const match = (history || []).find((h) => h.noticeId === noticeId && !h.read);
    if (match) markRead(match.id);
    openNotice(noticeId);
  };

  const topToasts = (toasts || []).filter((t) => t.placement === 'top');
  const bottomToasts = (toasts || []).filter((t) => t.placement !== 'top');

  const renderStack = (list, position) =>
    list.length === 0 ? null : (
      <div
        className={`fixed left-4 right-4 z-[60] mx-auto max-w-md pointer-events-none ${
          position === 'top' ? 'top-4' : 'bottom-5'
        }`}
      >
        {list.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto mb-2 last:mb-0"
          >
            <Toast
              toast={toast}
              onOpenNotice={handleToastNotice}
              onDismiss={dismissToast}
              stacked
            />
          </div>
        ))}
      </div>
    );

  if (!currentUser) {
    return (
      <>
        <LoginScreen />
        {renderStack(topToasts, 'top')}
        {renderStack(bottomToasts, 'bottom')}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-page flex flex-col font-sans selection:bg-accent selection:text-accent-fg">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-5 pb-10">
        {role === 'student' && <NotificationPermissionBanner />}
        {role === 'student' && <StudentFeed />}
        {role === 'publisher' && <PublisherPortal />}
        {role === 'admin' && <AdminDashboard />}
        {role === 'pitch' && <ValidationHub />}
      </main>

      <footer className="border-t border-line bg-surface/80 py-4 px-4 text-center text-xs text-muted">
        <p className="font-semibold text-ink">PulseLine · IIM Visakhapatnam</p>
        <p className="mt-0.5">PGP deadline notices — PlaceCom, clubs & committees</p>
      </footer>

      {renderStack(topToasts, 'top')}
      {renderStack(bottomToasts, 'bottom')}
      <WhatsAppModal />
      <NoticeDetailModal />
      {role === 'student' && <NotificationSettings />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
