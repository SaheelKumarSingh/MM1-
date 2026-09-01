import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { SEED_NOTICES, STUDENT_PROFILES, DEMO_USERS } from '../data/seedData';
import { useDeadlineNotifications } from '../hooks/useDeadlineNotifications';

const AppContext = createContext();
const AUTH_KEY = 'pulseline_iimv_auth_v2';
const NOTICES_KEY = 'pulseline_iimv_notices_v2';
const BOOKMARKS_KEY = 'pulseline_iimv_bookmarks_v2';
const APPLIED_KEY = 'pulseline_iimv_applied_v2';
const THEME_KEY = 'pulseline_iimv_theme';

const loadSession = () => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const { userId } = JSON.parse(raw);
    return DEMO_USERS.find((u) => u.id === userId) || null;
  } catch {
    return null;
  }
};

const loadTheme = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return 'light';
};

const applyThemeClass = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => loadSession());
  const [role, setRole] = useState(() => loadSession()?.role || 'student');
  const [theme, setThemeState] = useState(() => loadTheme());
  const [activeTab, setActiveTab] = useState('live');

  const [activeProfile, setActiveProfile] = useState(() => {
    const session = loadSession();
    if (session?.profileId) {
      return STUDENT_PROFILES.find((p) => p.id === session.profileId) || STUDENT_PROFILES[0];
    }
    return STUDENT_PROFILES[0];
  });

  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem(NOTICES_KEY);
    return saved ? JSON.parse(saved) : SEED_NOTICES;
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem(BOOKMARKS_KEY);
    return saved ? JSON.parse(saved) : ['notice-1', 'notice-3'];
  });

  const [appliedNotices, setAppliedNotices] = useState(() => {
    const saved = localStorage.getItem(APPLIED_KEY);
    return saved ? JSON.parse(saved) : ['notice-2'];
  });

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilterEnabled, setBatchFilterEnabled] = useState(true);

  const [whatsAppModalNotice, setWhatsAppModalNotice] = useState(null);
  const [calendarModalNotice, setCalendarModalNotice] = useState(null);
  const [detailModalNotice, setDetailModalNotice] = useState(null);
  const [toasts, setToasts] = useState([]);
  const toastTimersRef = useRef([]);

  useEffect(() => {
    applyThemeClass(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(NOTICES_KEY, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(APPLIED_KEY, JSON.stringify(appliedNotices));
  }, [appliedNotices]);

  const setTheme = (next) => setThemeState(next);
  const toggleTheme = () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));

  const showToast = (message, type = 'success', extra = {}) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const toast = {
      id,
      message,
      type,
      noticeId: extra.noticeId || null,
      placement: extra.placement || 'bottom',
    };
    setToasts((prev) => [...prev, toast].slice(-4));
    const timer = window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, extra.duration || 4000);
    toastTimersRef.current.push(timer);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const dismissToastsForNotices = (noticeIds) => {
    const idSet = noticeIds instanceof Set ? noticeIds : new Set(noticeIds);
    setToasts((prev) => prev.filter((t) => !t.noticeId || !idSet.has(t.noticeId)));
  };

  useEffect(() => {
    return () => {
      toastTimersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const login = (email, password, expectedRole) => {
    const normalized = email.trim().toLowerCase();
    const user = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === normalized && u.password === password
    );

    if (!user) {
      if (expectedRole === 'publisher') {
        return {
          ok: false,
          error: 'This email is not on the authorised club/committee list. Contact PlaceCom / CAO to be added.',
        };
      }
      return { ok: false, error: 'Invalid email or password.' };
    }
    if (expectedRole && user.role !== expectedRole) {
      const label =
        expectedRole === 'publisher'
          ? 'club / committee head'
          : expectedRole === 'admin'
            ? 'admin'
            : 'student';
      return {
        ok: false,
        error: `This account is not a ${label}. Switch the role tab and try again.`,
      };
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: user.id }));
    setCurrentUser(user);
    setRole(user.role);

    if (user.role === 'student' && user.profileId) {
      const profile = STUDENT_PROFILES.find((p) => p.id === user.profileId);
      if (profile) setActiveProfile(profile);
    }

    const welcome =
      user.role === 'publisher'
        ? `Signed in to ${user.organization}`
        : `Welcome, ${user.name}`;
    showToast(welcome);
    return { ok: true, user };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setCurrentUser(null);
    setRole('student');
    showToast('Signed out');
  };

  /** Publishers stay inside their own portal only */
  const canAccessRole = (target) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return target === 'admin' || target === 'pitch';
    if (currentUser.role === 'publisher') return target === 'publisher';
    if (currentUser.role === 'student') return target === 'student';
    return false;
  };

  const switchRole = (target) => {
    if (!canAccessRole(target)) {
      showToast('Your account cannot open that workspace.');
      return;
    }
    setRole(target);
  };

  const ownsNotice = (notice) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role !== 'publisher') return false;
    return notice.publisher === currentUser.organization;
  };

  const myNotices = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return notices;
    if (currentUser.role === 'publisher') {
      return notices.filter((n) => n.publisher === currentUser.organization);
    }
    return notices;
  };

  const toggleBookmark = (noticeId) => {
    setBookmarks((prev) => {
      const exists = prev.includes(noticeId);
      const updated = exists ? prev.filter((id) => id !== noticeId) : [...prev, noticeId];
      showToast(exists ? 'Removed from saved' : 'Saved');
      return updated;
    });
  };

  const markApplied = (noticeId) => {
    setAppliedNotices((prev) => {
      const exists = prev.includes(noticeId);
      if (!exists) {
        showToast('Marked as applied');
        setToasts((curr) => curr.filter((t) => t.noticeId !== noticeId));
        return [...prev, noticeId];
      }
      showToast('Removed applied status');
      return prev.filter((id) => id !== noticeId);
    });
  };

  const createNotice = (newNoticeData) => {
    if (!currentUser || (currentUser.role !== 'publisher' && currentUser.role !== 'admin')) {
      showToast('Only authorised club / committee accounts can publish.');
      return;
    }

    const isPlaceComUser =
      currentUser.role === 'admin' ||
      (currentUser.organization && currentUser.organization.toLowerCase().includes('placecom')) ||
      (currentUser.organization && currentUser.organization.toLowerCase().includes('placement'));

    if (newNoticeData.category === 'PLACEMENT' && !isPlaceComUser) {
      showToast('Only Placement Committee (PlaceCom) can publish Placement & Internship notices.', 'critical');
      return;
    }

    // Force scoped publisher identity — cannot post as another body
    const publisherName =
      currentUser.role === 'publisher'
        ? currentUser.organization
        : newNoticeData.publisher || currentUser.name;

    const newNotice = {
      id: `notice-${Date.now()}`,
      publisherVerified: true,
      stats: { views: 1, applied: 0, calendarAdded: 0 },
      history: [
        {
          timestamp: new Date().toISOString(),
          note: `Published by ${publisherName} (${currentUser.name} · ${currentUser.email})`,
        },
      ],
      ...newNoticeData,
      publisher: publisherName,
      publisherRole:
        currentUser.publisherRole ||
        newNoticeData.publisherRole ||
        'Club / Committee Head',
    };

    setNotices((prev) => [newNotice, ...prev]);
    showToast('Notice published');
  };

  const updateNoticeDeadline = (noticeId, newDeadlineIso, changeReason) => {
    if (!currentUser || (currentUser.role !== 'publisher' && currentUser.role !== 'admin')) {
      showToast('Only authorised publishers can update deadlines.');
      return;
    }

    const target = notices.find((n) => n.id === noticeId);
    if (!target || !ownsNotice(target)) {
      showToast('You can only update notices from your own club / committee.');
      return;
    }

    setNotices((prev) =>
      prev.map((n) => {
        if (n.id !== noticeId) return n;
        return {
          ...n,
          deadline: newDeadlineIso,
          history: [
            ...(n.history || []),
            {
              timestamp: new Date().toISOString(),
              note: `Deadline updated to ${new Date(newDeadlineIso).toLocaleString()}: ${changeReason}`,
            },
          ],
        };
      })
    );
    showToast('Deadline updated');
  };

  const downloadICS = (notice) => {
    const startDate = new Date(notice.deadline);
    const startTime = new Date(startDate.getTime() - 60 * 60 * 1000);

    const formatDate = (date) => date.toISOString().replace(/-|:|\.\d+/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PulseLine IIMV PGP//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:DEADLINE: ${notice.title}`,
      `DESCRIPTION:${notice.description}\\n\\nApply: ${notice.applicationUrl}`,
      `LOCATION:${notice.location || 'IIM Visakhapatnam'}`,
      `DTSTART:${formatDate(startTime)}`,
      `DTEND:${formatDate(startDate)}`,
      `URL:${notice.applicationUrl}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT2H',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${notice.title}`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute(
      'download',
      `${notice.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_deadline.ics`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotices((prev) =>
      prev.map((n) =>
        n.id === notice.id
          ? { ...n, stats: { ...n.stats, calendarAdded: n.stats.calendarAdded + 1 } }
          : n
      )
    );
    showToast('Calendar file downloaded');
  };

  const notifications = useDeadlineNotifications({
    currentUser,
    notices,
    bookmarks,
    appliedNotices,
    activeProfile,
    showToast,
    dismissToastsForNotices,
    setDetailModalNotice,
  });

  const getGoogleCalendarUrl = (notice) => {
    const endDate = new Date(notice.deadline);
    const startDate = new Date(endDate.getTime() - 60 * 60 * 1000);
    const fmt = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');

    const details = encodeURIComponent(
      `${notice.description}\n\nApply: ${notice.applicationUrl}\nEligible: ${notice.eligibleBatches.join(', ')}`
    );
    const title = encodeURIComponent(`[DEADLINE] ${notice.title}`);
    const location = encodeURIComponent(notice.location || 'IIM Visakhapatnam');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(startDate)}/${fmt(endDate)}&details=${details}&location=${location}`;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        canAccessRole,
        switchRole,
        ownsNotice,
        myNotices,
        role,
        setRole: switchRole,
        theme,
        setTheme,
        toggleTheme,
        activeTab,
        setActiveTab,
        activeProfile,
        setActiveProfile,
        notices,
        setNotices,
        bookmarks,
        toggleBookmark,
        appliedNotices,
        markApplied,
        categoryFilter,
        setCategoryFilter,
        urgencyFilter,
        setUrgencyFilter,
        searchQuery,
        setSearchQuery,
        batchFilterEnabled,
        setBatchFilterEnabled,
        whatsAppModalNotice,
        setWhatsAppModalNotice,
        calendarModalNotice,
        setCalendarModalNotice,
        detailModalNotice,
        setDetailModalNotice,
        toastMessage: toasts[toasts.length - 1] || null,
        toasts,
        showToast,
        dismissToast,
        createNotice,
        updateNoticeDeadline,
        downloadICS,
        getGoogleCalendarUrl,
        ...notifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
