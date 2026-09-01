import React from 'react';
import { useApp } from '../context/AppContext';
import { NoticeCard } from './NoticeCard';
import { formatRemaining } from '../utils/deadlineNotifications';
import {
  Clock,
  Search,
  Bookmark,
  CheckCircle2,
  Archive,
  Info,
  Flame,
  AlertTriangle,
  Bell,
} from 'lucide-react';

export const StudentFeed = () => {
  const {
    notices,
    activeProfile,
    activeTab,
    setActiveTab,
    categoryFilter,
    setCategoryFilter,
    urgencyFilter,
    setUrgencyFilter,
    searchQuery,
    setSearchQuery,
    batchFilterEnabled,
    setBatchFilterEnabled,
    bookmarks,
    appliedNotices,
  } = useApp();

  const now = new Date().getTime();

  const filteredNotices = notices.filter((notice) => {
    const isExpired = new Date(notice.deadline).getTime() <= now;

    if (activeTab === 'live' && isExpired) return false;
    if (activeTab === 'archive' && !isExpired) return false;
    if (activeTab === 'bookmarks' && !bookmarks.includes(notice.id)) return false;
    if (activeTab === 'applied' && !appliedNotices.includes(notice.id)) return false;

    if (batchFilterEnabled && activeTab === 'live') {
      const isEligible =
        notice.eligibleBatches.includes(activeProfile.batch) ||
        notice.eligibleBatches.includes('All PGP') ||
        notice.eligibleBatches.includes('All Batches');
      if (!isEligible) return false;
    }

    if (categoryFilter !== 'ALL' && notice.category !== categoryFilter) return false;

    if (urgencyFilter !== 'ALL' && !isExpired) {
      const diff = new Date(notice.deadline).getTime() - now;
      if (urgencyFilter === 'CRITICAL' && diff > 2 * 60 * 60 * 1000) return false;
      if (
        urgencyFilter === 'URGENT' &&
        (diff <= 2 * 60 * 60 * 1000 || diff > 24 * 60 * 60 * 1000)
      )
        return false;
      if (urgencyFilter === 'CALM' && diff <= 24 * 60 * 60 * 1000) return false;
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchTitle = notice.title.toLowerCase().includes(query);
      const matchPublisher = notice.publisher.toLowerCase().includes(query);
      const matchCategory = notice.categoryLabel.toLowerCase().includes(query);
      if (!matchTitle && !matchPublisher && !matchCategory) return false;
    }

    return true;
  });

  const sortedNotices = [...filteredNotices].sort((a, b) => {
    const timeA = new Date(a.deadline).getTime();
    const timeB = new Date(b.deadline).getTime();

    // In archive tab, show most recently expired first
    if (activeTab === 'archive') return timeB - timeA;

    // In live (and saved/bookmarks) tab: unapplied items come first, applied items go to bottom
    if (activeTab === 'live' || activeTab === 'bookmarks') {
      const appliedA = appliedNotices.includes(a.id);
      const appliedB = appliedNotices.includes(b.id);
      if (appliedA !== appliedB) {
        return appliedA ? 1 : -1;
      }
    }

    // Closest deadlines first
    return timeA - timeB;
  });

  const liveNotices = notices.filter((n) => new Date(n.deadline).getTime() > now);
  const batchLive = liveNotices.filter(
    (n) =>
      !batchFilterEnabled ||
      n.eligibleBatches.includes(activeProfile.batch) ||
      n.eligibleBatches.includes('All PGP') ||
      n.eligibleBatches.includes('All Batches')
  );
  const criticalCount = batchLive.filter(
    (n) => new Date(n.deadline).getTime() - now <= 2 * 60 * 60 * 1000
  ).length;
  const urgentCount = batchLive.filter((n) => {
    const diff = new Date(n.deadline).getTime() - now;
    return diff > 2 * 60 * 60 * 1000 && diff <= 24 * 60 * 60 * 1000;
  }).length;
  const archiveCount = notices.filter((n) => new Date(n.deadline).getTime() <= now).length;

  const tabs = [
    { id: 'live', label: 'Live', count: batchLive.length, icon: Clock },
    { id: 'bookmarks', label: 'Saved', count: bookmarks.length, icon: Bookmark },
    { id: 'applied', label: 'Applied', count: appliedNotices.length, icon: CheckCircle2 },
    { id: 'archive', label: 'Expired', count: archiveCount, icon: Archive },
  ];

  return (
    <div className="space-y-5">
      {batchLive.filter(
        (n) => !appliedNotices.includes(n.id) && new Date(n.deadline).getTime() - now <= 2 * 60 * 60 * 1000
      ).length > 0 && (
        <div className="rounded-xl border border-critical-border bg-critical-soft px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-critical flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            Deadline reminder · under 2 hours
          </p>
          {batchLive
            .filter(
              (n) => !appliedNotices.includes(n.id) && new Date(n.deadline).getTime() - now <= 2 * 60 * 60 * 1000
            )
            .sort(
              (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            )
            .map((n) => (
              <p key={n.id} className="text-xs text-ink">
                <span className="font-semibold">{n.title}</span>
                <span className="text-muted">
                  {' '}
                  · {formatRemaining(new Date(n.deadline).getTime() - now)} left
                </span>
              </p>
            ))}
        </div>
      )}
      <div className="rounded-xl border border-line bg-surface shadow-card p-4 sm:p-5 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-soft/80 via-transparent to-transparent pointer-events-none" />
        <div className="relative space-y-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-1">
              IIM Visakhapatnam · PGP
            </p>
            <h1 className="font-display text-2xl sm:text-[1.75rem] font-semibold text-ink tracking-tight">
              Deadline board
            </h1>
            <p className="text-sm text-muted mt-1">
              {activeProfile.batch} · closing soonest first
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('live');
                setUrgencyFilter('CRITICAL');
              }}
              className={`rounded-lg border px-2.5 py-2.5 text-left transition-colors ${
                urgencyFilter === 'CRITICAL'
                  ? 'border-critical bg-critical-soft'
                  : 'border-critical-border/60 bg-critical-soft/50 hover:bg-critical-soft'
              }`}
            >
              <div className="flex items-center gap-1 text-critical text-[10px] font-bold uppercase tracking-wide">
                <Flame className="w-3 h-3" />
                Critical
              </div>
              <p className="text-xl font-display font-semibold text-ink mt-0.5 tabular-nums">
                {criticalCount}
              </p>
              <p className="text-[10px] text-muted">under 2 hours</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('live');
                setUrgencyFilter('URGENT');
              }}
              className={`rounded-lg border px-2.5 py-2.5 text-left transition-colors ${
                urgencyFilter === 'URGENT'
                  ? 'border-warn bg-warn-soft'
                  : 'border-warn-border/60 bg-warn-soft/50 hover:bg-warn-soft'
              }`}
            >
              <div className="flex items-center gap-1 text-warn text-[10px] font-bold uppercase tracking-wide">
                <AlertTriangle className="w-3 h-3" />
                Urgent
              </div>
              <p className="text-xl font-display font-semibold text-ink mt-0.5 tabular-nums">
                {urgentCount}
              </p>
              <p className="text-[10px] text-muted">2–24 hours</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('live');
                setUrgencyFilter('ALL');
              }}
              className={`rounded-lg border px-2.5 py-2.5 text-left transition-colors ${
                urgencyFilter === 'ALL' && activeTab === 'live'
                  ? 'border-calm bg-calm-soft'
                  : 'border-calm-border/60 bg-calm-soft/50 hover:bg-calm-soft'
              }`}
            >
              <div className="flex items-center gap-1 text-calm text-[10px] font-bold uppercase tracking-wide">
                <Clock className="w-3 h-3" />
                Live
              </div>
              <p className="text-xl font-display font-semibold text-ink mt-0.5 tabular-nums">
                {batchLive.length}
              </p>
              <p className="text-[10px] text-muted">open now</p>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl border border-line bg-surface shadow-sm">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-ink">My batch only</p>
          <p className="text-[11px] text-muted truncate">
            {batchFilterEnabled
              ? `Showing notices for ${activeProfile.batch}`
              : 'Showing all PGP batches'}
          </p>
        </div>
        <button
          onClick={() => setBatchFilterEnabled(!batchFilterEnabled)}
          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
            batchFilterEnabled ? 'bg-accent' : 'bg-line-strong'
          }`}
          title="Toggle batch filter"
          aria-pressed={batchFilterEnabled}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
              batchFilterEnabled ? 'translate-x-[1.25rem]' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-line -mx-1 px-1">
        {tabs.map(({ id, label, count, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeTab === id
                ? 'border-accent text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            <span
              className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === id ? 'bg-accent-soft text-accent' : 'bg-surface text-muted'
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, club, or title"
            className="w-full bg-surface border border-line rounded-xl pl-9 pr-3 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {[
            { id: 'ALL', label: 'All timing', tone: 'border-line text-muted' },
            {
              id: 'CRITICAL',
              label: '< 2h',
              tone: 'border-critical-border text-critical bg-critical-soft/40',
              icon: Flame,
            },
            {
              id: 'URGENT',
              label: '< 24h',
              tone: 'border-warn-border text-warn bg-warn-soft/40',
              icon: AlertTriangle,
            },
          ].map((u) => {
            const Icon = u.icon;
            const active = urgencyFilter === u.id;
            return (
              <button
                key={u.id}
                onClick={() => setUrgencyFilter(u.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  active
                    ? u.id === 'CRITICAL'
                      ? 'border-critical bg-critical text-white'
                      : u.id === 'URGENT'
                        ? 'border-warn bg-warn text-white'
                        : 'border-accent bg-accent text-accent-fg'
                    : `${u.tone} hover:opacity-90 bg-surface`
                }`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                {u.label}
              </button>
            );
          })}

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="ml-auto bg-surface border border-line rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink outline-none shadow-sm"
          >
            <option value="ALL">All categories</option>
            <option value="PLACEMENT">Placement</option>
            <option value="CASE_COMP">Case competition</option>
            <option value="WORKSHOP">Workshop</option>
            <option value="CLUB">Club</option>
          </select>
        </div>
      </div>

      {sortedNotices.length > 0 ? (
        <div className="space-y-3">
          {sortedNotices.map((notice, index) => {
            const isApplied = appliedNotices.includes(notice.id);
            const prevNotice = sortedNotices[index - 1];
            const prevApplied = prevNotice ? appliedNotices.includes(prevNotice.id) : false;
            const showAppliedDivider =
              (activeTab === 'live' || activeTab === 'bookmarks') &&
              isApplied &&
              !prevApplied &&
              index > 0;

            return (
              <React.Fragment key={notice.id}>
                {showAppliedDivider && (
                  <div className="pt-4 pb-1 flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-ok" />
                      Applied ({sortedNotices.filter((n) => appliedNotices.includes(n.id)).length})
                    </span>
                    <div className="h-px bg-line flex-1" />
                  </div>
                )}
                <NoticeCard notice={notice} isExpired={activeTab === 'archive'} />
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        <div className="border border-line rounded-xl bg-surface shadow-card p-10 text-center space-y-2">
          <Info className="w-5 h-5 text-muted mx-auto" />
          <h3 className="text-sm font-semibold text-ink">No deadlines found</h3>
          <p className="text-xs text-muted max-w-xs mx-auto">
            {activeTab === 'bookmarks'
              ? 'Save a notice to see it here.'
              : activeTab === 'applied'
                ? 'Mark a notice as applied to track it here.'
                : 'Nothing matches your filters for this batch.'}
          </p>
          {(categoryFilter !== 'ALL' || urgencyFilter !== 'ALL' || searchQuery !== '') && (
            <button
              onClick={() => {
                setCategoryFilter('ALL');
                setUrgencyFilter('ALL');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-accent underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
