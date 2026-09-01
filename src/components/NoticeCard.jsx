import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  ExternalLink,
  Calendar,
  Share2,
  Bookmark,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Users,
  Flame,
  AlertTriangle,
} from 'lucide-react';

export const NoticeCard = ({ notice, isExpired = false }) => {
  const {
    activeProfile,
    bookmarks,
    toggleBookmark,
    appliedNotices,
    markApplied,
    downloadICS,
    setWhatsAppModalNotice,
    setDetailModalNotice,
  } = useApp();

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, totalMs: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(notice.deadline).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, totalMs: diff });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [notice.deadline]);

  const isCritical = !isExpired && timeLeft.totalMs > 0 && timeLeft.totalMs <= 2 * 60 * 60 * 1000;
  const isUrgent =
    !isExpired && timeLeft.totalMs > 2 * 60 * 60 * 1000 && timeLeft.totalMs <= 24 * 60 * 60 * 1000;
  const isCalm = !isExpired && timeLeft.totalMs > 24 * 60 * 60 * 1000;
  const isBookmarked = bookmarks.includes(notice.id);
  const isApplied = appliedNotices.includes(notice.id);

  const isEligible =
    notice.eligibleBatches.includes(activeProfile.batch) ||
    notice.eligibleBatches.includes('All PGP') ||
    notice.eligibleBatches.includes('All Batches');

  const formatDigit = (num) => String(num).padStart(2, '0');

  const categoryTone = {
    PLACEMENT: 'bg-critical-soft text-critical border-critical-border',
    CASE_COMP: 'bg-warn-soft text-warn border-warn-border',
    WORKSHOP: 'bg-calm-soft text-calm border-calm-border',
    CLUB: 'bg-accent-soft text-accent border-line',
  };

  const railClass = isExpired
    ? ''
    : isCritical
      ? 'urgency-rail-critical bg-critical-soft/40'
      : isUrgent
        ? 'urgency-rail-urgent'
        : isCalm
          ? 'urgency-rail-calm'
          : '';

  const UrgencyIcon = isCritical ? Flame : isUrgent ? AlertTriangle : Clock;

  return (
    <article
      className={`rounded-xl border bg-card overflow-hidden shadow-card transition-shadow hover:shadow-md ${
        isExpired
          ? 'border-line opacity-75'
          : isCritical
            ? 'border-critical-border'
            : isUrgent
              ? 'border-warn-border'
              : 'border-line'
      } ${railClass}`}
    >
      {/* Urgency banner */}
      <div
        className={`flex items-center justify-between gap-2 px-4 py-2 border-b text-xs ${
          isExpired
            ? 'bg-surface border-line'
            : isCritical
              ? 'bg-critical-soft border-critical-border'
              : isUrgent
                ? 'bg-warn-soft border-warn-border'
                : 'bg-surface border-line'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border truncate ${
              categoryTone[notice.category] || 'bg-accent-soft text-ink border-line'
            }`}
          >
            {notice.categoryLabel}
          </span>
          {notice.publisherVerified && (
            <span className="inline-flex items-center gap-0.5 text-ok shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold">Verified</span>
            </span>
          )}
        </div>

        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide shrink-0 ${
            isExpired
              ? 'text-muted'
              : isCritical
                ? 'text-critical animate-urgency-pulse'
                : isUrgent
                  ? 'text-warn'
                  : 'text-calm'
          }`}
        >
          <UrgencyIcon className="w-3.5 h-3.5" />
          {isExpired ? 'Expired' : isCritical ? 'Critical · <2h' : isUrgent ? 'Urgent · <24h' : 'Scheduled'}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wide">
              {notice.publisher}
            </p>
            <h3
              onClick={() => setDetailModalNotice(notice)}
              className="font-display text-[1.05rem] font-semibold text-ink mt-0.5 leading-snug cursor-pointer hover:text-accent"
            >
              {notice.title}
            </h3>
          </div>

          {!isExpired ? (
            <div
              className={`shrink-0 min-w-[7.5rem] text-center font-mono tabular-nums px-2.5 py-2 rounded-lg border ${
                isCritical
                  ? 'border-critical-border bg-critical text-white'
                  : isUrgent
                    ? 'border-warn-border bg-warn-soft text-warn'
                    : 'border-calm-border bg-calm-soft text-calm'
              }`}
            >
              <div
                className={`flex items-center justify-center gap-1 text-[10px] font-sans font-semibold mb-0.5 ${
                  isCritical ? 'text-white/80' : ''
                }`}
              >
                <Clock className="w-3 h-3" />
                Time left
              </div>
              <div className={`text-base font-bold leading-none ${isCritical ? 'text-white' : ''}`}>
                {timeLeft.hours > 0 && (
                  <>
                    {formatDigit(timeLeft.hours)}
                    <span className="text-[10px] font-medium opacity-70">h </span>
                  </>
                )}
                {formatDigit(timeLeft.minutes)}
                <span className="text-[10px] font-medium opacity-70">m </span>
                <span className="text-sm">{formatDigit(timeLeft.seconds)}</span>
                <span className="text-[10px] font-medium opacity-70">s</span>
              </div>
            </div>
          ) : (
            <span className="text-xs font-mono font-semibold text-muted uppercase px-2 py-1 border border-line rounded-md">
              Closed
            </span>
          )}
        </div>

        <p className="text-sm text-muted leading-relaxed line-clamp-2">{notice.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-surface border border-line text-muted">
            <Users className="w-3.5 h-3.5 shrink-0 text-accent" />
            <span className="truncate">
              <span className={isEligible ? 'text-ink font-semibold' : ''}>
                {notice.eligibleBatches.join(', ')}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-surface border border-line text-muted">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {notice.location || 'Campus'} · {notice.registrationFee}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line">
          <button
            onClick={() => toggleBookmark(notice.id)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
              isBookmarked
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-line text-muted hover:text-ink hover:bg-surface'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            Save
          </button>

          <button
            onClick={() => markApplied(notice.id)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
              isApplied
                ? 'border-ok bg-ok-soft text-ok'
                : 'border-line text-muted hover:text-ink hover:bg-surface'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isApplied ? 'Applied' : 'Applied?'}
          </button>

          <button
            onClick={() => downloadICS(notice)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-line text-muted hover:text-ink hover:bg-surface"
          >
            <Calendar className="w-3.5 h-3.5" />
            Calendar
          </button>

          <button
            onClick={() => setWhatsAppModalNotice(notice)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-line text-muted hover:text-ink hover:bg-surface"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>

          <div className="flex-1" />

          <button
            onClick={() => setDetailModalNotice(notice)}
            className="text-xs font-semibold text-muted hover:text-accent"
          >
            Details
          </button>

          {!isExpired && (
            <a
              href={notice.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-opacity hover:opacity-90 ${
                isCritical
                  ? 'bg-critical text-white'
                  : 'bg-accent text-accent-fg'
              }`}
            >
              Apply
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
