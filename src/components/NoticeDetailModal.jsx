import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Bookmark, 
  History,
  AlertCircle
} from 'lucide-react';

export const NoticeDetailModal = () => {
  const { 
    detailModalNotice, 
    setDetailModalNotice, 
    activeProfile, 
    bookmarks, toggleBookmark, 
    appliedNotices, markApplied, 
    downloadICS, getGoogleCalendarUrl 
  } = useApp();

  if (!detailModalNotice) return null;

  const isBookmarked = bookmarks.includes(detailModalNotice.id);
  const isApplied = appliedNotices.includes(detailModalNotice.id);
  const isEligible =
    detailModalNotice.eligibleBatches.includes(activeProfile.batch) ||
    detailModalNotice.eligibleBatches.includes('All PGP') ||
    detailModalNotice.eligibleBatches.includes('All Batches');

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-line rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close button */}
        <button 
          onClick={() => setDetailModalNotice(null)}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-muted hover:text-ink hover:bg-app transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center space-x-2">
            <span className="bg-accent-soft text-accent border border-line text-xs px-2.5 py-0.5 rounded-full font-bold font-mono">
              {detailModalNotice.categoryLabel}
            </span>
            {detailModalNotice.publisherVerified && (
              <span className="flex items-center space-x-1 text-xs text-ok bg-ok-soft px-2.5 py-0.5 rounded-full border border-ok/30 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Publisher Record</span>
              </span>
            )}
          </div>

          <h2 className="text-xl font-extrabold text-ink tracking-tight">{detailModalNotice.title}</h2>
          <p className="text-xs text-muted font-semibold">{detailModalNotice.publisher} • {detailModalNotice.publisherRole}</p>
        </div>

        {/* Deadline Box */}
        <div className="bg-app p-4 rounded-xl border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">Hard Registration Closing Time</span>
            <div className="text-sm font-bold text-ink font-mono mt-0.5">
              {new Date(detailModalNotice.deadline).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => downloadICS(detailModalNotice)}
              className="px-3 py-1.5 bg-surface hover:bg-app border border-line text-xs font-semibold text-ink rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <span>Download .ics</span>
            </button>
            <a
              href={getGoogleCalendarUrl(detailModalNotice)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-calm-soft hover:bg-calm-soft/80 border border-calm-border text-xs font-semibold text-calm rounded-xl transition-colors"
            >
              Google Calendar
            </a>
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-app p-3.5 rounded-xl border border-line">
            <span className="text-[10px] font-mono text-muted uppercase block mb-1">Eligible Student Batches</span>
            <div className={`font-semibold ${isEligible ? 'text-ok font-bold' : 'text-ink'}`}>
              {detailModalNotice.eligibleBatches.join(', ')}
            </div>
          </div>

          <div className="bg-app p-3.5 rounded-xl border border-line">
            <span className="text-[10px] font-mono text-muted uppercase block mb-1">Location & Registration Fee</span>
            <div className="font-semibold text-ink">
              {detailModalNotice.location} ({detailModalNotice.registrationFee})
            </div>
          </div>
        </div>

        {/* Detailed Requirements & Rules */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-ink flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-accent" />
            <span>Requirements & Instructions</span>
          </h4>
          <p className="text-ink bg-app p-3.5 rounded-xl border border-line leading-relaxed">
            {detailModalNotice.requirements}
          </p>
        </div>

        {/* Official Publisher Note */}
        {detailModalNotice.officialNote && (
          <div className="bg-warn-soft border border-warn-border p-3.5 rounded-xl flex items-start space-x-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-warn shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="text-warn block font-mono text-[10px] font-bold uppercase tracking-wider">
                Official Note from Publisher:
              </strong>
              <span className="text-ink font-medium leading-relaxed block">{detailModalNotice.officialNote}</span>
            </div>
          </div>
        )}

        {/* Notice Change History Audit Log */}
        {detailModalNotice.history && detailModalNotice.history.length > 0 && (
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-ink flex items-center space-x-1.5">
              <History className="w-4 h-4 text-accent" />
              <span>Publisher Audit History</span>
            </h4>
            <div className="space-y-1.5">
              {detailModalNotice.history.map((h, idx) => (
                <div key={idx} className="bg-app p-2.5 rounded-lg border border-line text-[11px] font-mono text-muted flex justify-between">
                  <span>{h.note}</span>
                  <span className="text-muted">{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-line">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleBookmark(detailModalNotice.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-colors ${
                isBookmarked ? 'bg-accent text-accent-fg border-accent' : 'bg-surface text-muted border-line hover:text-ink hover:bg-app'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'Saved' : 'Save Notice'}</span>
            </button>

            <button
              onClick={() => markApplied(detailModalNotice.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 border transition-colors ${
                isApplied ? 'bg-ok-soft text-ok border-ok/40' : 'bg-surface text-muted border-line hover:text-ink hover:bg-app'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isApplied ? 'Applied' : 'Mark Applied'}</span>
            </button>
          </div>

          <a
            href={detailModalNotice.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-accent hover:opacity-90 text-white font-extrabold text-xs rounded-xl flex items-center space-x-2 shadow-md transition-all"
          >
            <span className="text-white">Proceed to Official Application</span>
            <ExternalLink className="w-4 h-4 text-white" />
          </a>
        </div>

      </div>
    </div>
  );
};
