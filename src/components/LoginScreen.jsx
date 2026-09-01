import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS, AUTHORIZED_PUBLISHER_EMAILS } from '../data/seedData';
import {
  GraduationCap,
  Send,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Moon,
  Sun,
} from 'lucide-react';

const ROLE_TABS = [
  { id: 'student', label: 'Student', icon: GraduationCap, hint: 'View and track PGP deadlines' },
  {
    id: 'publisher',
    label: 'Club / Committee',
    icon: Send,
    hint: 'Authorised email unlocks only your body’s notices',
  },
  { id: 'admin', label: 'Admin', icon: Shield, hint: 'Institution oversight' },
];

export const LoginScreen = () => {
  const { login, theme, toggleTheme } = useApp();
  const [roleTab, setRoleTab] = useState('student');
  const [email, setEmail] = useState(DEMO_USERS.find((u) => u.role === 'student')?.email || '');
  const [password, setPassword] = useState('iimvpgp');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [matchedOrg, setMatchedOrg] = useState(null);

  const accountsForTab = DEMO_USERS.filter((u) => u.role === roleTab);

  const selectRoleTab = (id) => {
    setRoleTab(id);
    setError('');
    setMatchedOrg(null);
    const first = DEMO_USERS.find((u) => u.role === id);
    if (first) {
      setEmail(first.email);
      setPassword(first.password);
      if (id === 'publisher') setMatchedOrg(first.organization);
    }
  };

  const onEmailChange = (value) => {
    setEmail(value);
    setError('');
    if (roleTab === 'publisher') {
      const hit = AUTHORIZED_PUBLISHER_EMAILS.find(
        (p) => p.email.toLowerCase() === value.trim().toLowerCase()
      );
      setMatchedOrg(hit?.organization || null);
    } else {
      setMatchedOrg(null);
    }
  };

  const fillAccount = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setError('');
    if (user.role === 'publisher') setMatchedOrg(user.organization);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (roleTab === 'publisher') {
      const authorised = AUTHORIZED_PUBLISHER_EMAILS.some(
        (p) => p.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (!authorised) {
        setError(
          'Email not recognised. Only listed club/committee addresses may publish.'
        );
        return;
      }
    }

    const result = login(email.trim(), password, roleTab);
    if (!result.ok) setError(result.error);
  };

  return (
    <div className="min-h-screen bg-app flex flex-col">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md border border-line bg-surface text-muted hover:text-ink"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="text-center mb-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted mb-2">
            Indian Institute of Management Visakhapatnam
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink tracking-tight">
            PulseLine
          </h1>
          <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
            Official PGP deadline notices. Students browse; clubs and committees publish under
            their own authorised email.
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="flex gap-1 p-1 mb-3 bg-surface border border-line rounded-lg">
            {ROLE_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => selectRoleTab(id)}
                className={`flex-1 flex flex-col items-center gap-1 px-2 py-2.5 rounded-md text-[11px] font-semibold transition-colors ${
                  roleTab === id
                    ? 'bg-accent text-accent-fg'
                    : 'text-muted hover:text-ink hover:bg-app'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="leading-tight text-center">{label}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted text-center mb-4">
            {ROLE_TABS.find((t) => t.id === roleTab)?.hint}
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-surface border border-line rounded-lg p-5 space-y-4 shadow-sm"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5"
              >
                {roleTab === 'publisher' ? 'Authorised club / committee email' : 'Campus email'}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="w-full bg-app border border-line rounded-md px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                placeholder="you@iimv.ac.in"
                required
              />
              {roleTab === 'publisher' && matchedOrg && (
                <p className="mt-1.5 text-xs text-ok">
                  Recognised — access limited to <strong className="font-semibold">{matchedOrg}</strong>
                </p>
              )}
              {roleTab === 'publisher' && email.trim() && !matchedOrg && (
                <p className="mt-1.5 text-xs text-critical">
                  Not on the authorised publisher list
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-app border border-line rounded-md px-3 py-2.5 pr-10 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-critical bg-critical-soft border border-critical/20 rounded-md px-3 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-accent hover:opacity-90 text-accent-fg font-semibold text-sm py-2.5 rounded-md transition-opacity"
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-muted text-center font-medium">
              Demo · password <span className="text-ink">iimvpgp</span>
            </p>
            <div className="space-y-1.5">
              {accountsForTab.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => fillAccount(user)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md border text-left transition-colors ${
                    email === user.email
                      ? 'border-accent bg-accent-soft'
                      : 'border-line bg-surface hover:bg-app'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-ink truncate">{user.name}</p>
                    <p className="text-[10px] text-muted truncate font-mono">{user.email}</p>
                  </div>
                  <span className="text-[10px] text-muted shrink-0 text-right max-w-[40%]">
                    {user.organization || user.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
