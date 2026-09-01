import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, Moon, Sun, BarChart3, FileText } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

export const Header = () => {
  const {
    role,
    setRole,
    currentUser,
    logout,
    canAccessRole,
    theme,
    toggleTheme,
  } = useApp();

  const adminNav = [
    { id: 'admin', label: 'Dashboard', icon: BarChart3 },
    { id: 'pitch', label: 'Research', icon: FileText },
  ].filter((item) => canAccessRole(item.id));

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-line shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent text-accent-fg flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-sm">
            P
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-semibold text-ink tracking-tight">
                PulseLine
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                IIM Vizag
              </span>
            </div>
            <p className="text-xs text-muted truncate">
              {currentUser?.role === 'publisher'
                ? currentUser.organization
                : currentUser?.role === 'admin'
                  ? 'Career Development Office'
                  : `${currentUser?.name || ''} · ${currentUser?.title || 'PGP'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {currentUser?.role === 'student' && <NotificationBell />}
          {adminNav.length > 1 && (
            <nav className="hidden sm:flex items-center gap-0.5 mr-1 border border-line rounded-md p-0.5 bg-app">
              {adminNav.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setRole(id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    role === id
                      ? 'bg-accent text-accent-fg'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </nav>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-muted hover:text-ink hover:bg-app border border-transparent hover:border-line transition-colors"
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            aria-label="Toggle colour theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted hover:text-ink border border-line hover:bg-app transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
