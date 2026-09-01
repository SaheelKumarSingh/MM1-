import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Lock,
  Check,
  Link as LinkIcon,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';

const BATCH_OPTIONS = ['PGP 2026', 'PGP 2025', 'All PGP'];

const pad2 = (n) => String(n).padStart(2, '0');

/** datetime-local values are local wall-clock, not UTC. */
const toDatetimeLocalValue = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const datetimeLocalToIso = (localValue) => {
  if (!localValue) return '';
  const d = new Date(localValue);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString();
};

export const PublisherPortal = () => {
  const { createNotice, updateNoticeDeadline, showToast, currentUser, myNotices } = useApp();

  const orgName = currentUser?.organization || 'Your committee';
  const orgRole = currentUser?.publisherRole || 'Authorised publisher';

  const isPlaceCom =
    orgName.toLowerCase().includes('placecom') ||
    orgName.toLowerCase().includes('placement') ||
    orgRole.toLowerCase().includes('placecom') ||
    currentUser?.role === 'admin';

  const ALL_CATEGORY_OPTIONS = [
    { value: 'PLACEMENT', label: 'Placement & Internship', placeComOnly: true },
    { value: 'CASE_COMP', label: 'Case Competition', placeComOnly: false },
    { value: 'WORKSHOP', label: 'Workshop & Masterclass', placeComOnly: false },
    { value: 'CLUB', label: 'Club Event', placeComOnly: false },
  ];

  const categoryOptions = ALL_CATEGORY_OPTIONS.filter(
    (opt) => !opt.placeComOnly || isPlaceCom
  );

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(
    isPlaceCom ? 'PLACEMENT' : 'CLUB'
  );
  const [eligibleBatches, setEligibleBatches] = useState(['PGP 2026']);
  const [applicationUrl, setApplicationUrl] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('23:59');
  const [location, setLocation] = useState('Lecture Hall Complex / PlaceCom Portal');
  const [registrationFee, setRegistrationFee] = useState('Free');
  const [description, setDescription] = useState('');
  const [isVerifiedCheck, setIsVerifiedCheck] = useState(false);

  React.useEffect(() => {
    if (!isPlaceCom && category === 'PLACEMENT') {
      setCategory('CLUB');
    }
  }, [isPlaceCom, category]);

  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [newDeadlineIso, setNewDeadlineIso] = useState('');
  const [updateReason, setUpdateReason] = useState('');

  const orgNotices = myNotices();

  const toggleBatch = (batch) => {
    if (batch === 'All PGP') {
      setEligibleBatches(['All PGP']);
      return;
    }
    setEligibleBatches((prev) => {
      const filtered = prev.filter((b) => b !== 'All PGP' && b !== 'All Batches');
      if (filtered.includes(batch)) {
        const next = filtered.filter((b) => b !== batch);
        return next.length === 0 ? ['PGP 2026'] : next;
      }
      return [...filtered, batch];
    });
  };

  const categoryLabels = {
    PLACEMENT: 'Placement & Internship',
    CASE_COMP: 'Case Competition',
    WORKSHOP: 'Workshop & Masterclass',
    CLUB: 'Club Event',
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isTitleValid = title.trim().length >= 5;
  const isUrlValid = isValidUrl(applicationUrl);
  const isDeadlineValid = deadlineDate !== '';
  const isBatchesValid = eligibleBatches.length > 0;
  const isFormComplete =
    isTitleValid && isUrlValid && isDeadlineValid && isBatchesValid && isVerifiedCheck;

  const getDeadlineIso = () => {
    if (!deadlineDate) return new Date().toISOString();
    return new Date(`${deadlineDate}T${deadlineTime || '23:59'}:00`).toISOString();
  };

  const generateWhatsAppPreview = () => {
    const timeStr = deadlineDate ? `${deadlineDate} at ${deadlineTime}` : 'Select deadline';
    return `*IIMV OFFICIAL NOTICE*\n*${title || 'Title'}*\nPublisher: ${orgName}\nEligible: ${eligibleBatches.join(', ')}\nDeadline: ${timeStr}\nApply: ${applicationUrl || 'https://...'}\nLocation: ${location}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormComplete) return;

    if (!isPlaceCom && category === 'PLACEMENT') {
      showToast('Placement & Internship notices can only be published by PlaceCom.');
      return;
    }

    createNotice({
      title,
      publisher: orgName,
      publisherRole: orgRole,
      category,
      categoryLabel: categoryLabels[category],
      eligibleBatches,
      applicationUrl,
      deadline: getDeadlineIso(),
      location,
      registrationFee: registrationFee || 'Free',
      requirements: 'As stated in notice.',
      description:
        description || 'Official IIM Visakhapatnam PGP notice with strict registration rules.',
      officialNote: `Published under ${orgName} authorisation.`,
      whatsappFormatted: generateWhatsAppPreview(),
    });

    setTitle('');
    setApplicationUrl('');
    setDeadlineDate('');
    setDescription('');
    setIsVerifiedCheck(false);
  };

  const handleUpdateNotice = (noticeId) => {
    if (!newDeadlineIso || !updateReason) {
      showToast('Enter new time and reason.');
      return;
    }
    updateNoticeDeadline(noticeId, newDeadlineIso, updateReason);
    setEditingNoticeId(null);
    setUpdateReason('');
  };

  const fieldClass =
    'w-full bg-app border border-line rounded-md px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent';
  const labelClass = 'block text-xs font-semibold text-ink mb-1';

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
          <Lock className="w-3.5 h-3.5" />
          Scoped publisher access
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink tracking-tight">
          {orgName}
        </h1>
        <p className="text-sm text-muted">
          Signed in as {currentUser?.email}. You may only create and edit notices for this body.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <section className="bg-surface border border-line rounded-lg p-4 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold text-ink border-b border-line pb-3">
            Publish notice
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Publishing as</label>
                <input
                  type="text"
                  value={orgName}
                  readOnly
                  className={`${fieldClass} bg-app/80 text-muted cursor-not-allowed`}
                />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={fieldClass}
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {!isPlaceCom && (
                  <p className="text-[11px] text-muted mt-1">
                    *Placement &amp; Internship is restricted to Placement Committee (PlaceCom).
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Title {!isTitleValid && title.length > 0 && (
                  <span className="text-critical font-normal">(min 5 characters)</span>
                )}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. McKinsey Summer Associate — registration"
                className={fieldClass}
              />
            </div>

            <div>
              <label className={labelClass}>Eligible batches</label>
              <div className="flex flex-wrap gap-1.5">
                {BATCH_OPTIONS.map((batch) => {
                  const selected = eligibleBatches.includes(batch);
                  return (
                    <button
                      key={batch}
                      type="button"
                      onClick={() => toggleBatch(batch)}
                      className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                        selected
                          ? 'bg-accent text-accent-fg border-accent'
                          : 'bg-surface text-muted border-line hover:text-ink'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 inline mr-1" />}
                      {batch}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className={labelClass}>Application URL</label>
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-muted absolute left-3 top-2.5" />
                <input
                  type="url"
                  value={applicationUrl}
                  onChange={(e) => setApplicationUrl(e.target.value)}
                  placeholder="https://placecom.iimv.ac.in/apply/..."
                  className={`${fieldClass} pl-9 font-mono text-xs`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Closing date</label>
                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className={`${fieldClass} font-mono text-xs`}
                />
              </div>
              <div>
                <label className={labelClass}>Closing time</label>
                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className={`${fieldClass} font-mono text-xs`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Fee</label>
                <input
                  type="text"
                  value={registrationFee}
                  onChange={(e) => setRegistrationFee(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Eligibility, documents required, process notes…"
                className={`${fieldClass} resize-none`}
              />
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-md border border-line bg-app cursor-pointer">
              <input
                type="checkbox"
                checked={isVerifiedCheck}
                onChange={(e) => setIsVerifiedCheck(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-xs text-muted leading-snug">
                I confirm this notice is official for <strong className="text-ink">{orgName}</strong>{' '}
                and complies with IIM Visakhapatnam PGP guidelines.
              </span>
            </label>

            <button
              type="submit"
              disabled={!isFormComplete}
              className={`w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-opacity ${
                isFormComplete
                  ? 'bg-accent text-accent-fg hover:opacity-90'
                  : 'bg-line text-muted cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              {isFormComplete ? 'Publish notice' : 'Complete required fields'}
            </button>
          </form>
        </section>

        <section className="bg-surface border border-line rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink">
            <MessageSquare className="w-4 h-4 text-muted" />
            Broadcast preview
          </div>
          <pre className="bg-app border border-line rounded-md p-3 text-[11px] font-mono text-muted whitespace-pre-wrap leading-relaxed">
            {generateWhatsAppPreview()}
          </pre>
        </section>

        <section className="bg-surface border border-line rounded-lg p-4 space-y-3">
          <h2 className="text-sm font-semibold text-ink">Your issued notices</h2>
          <p className="text-xs text-muted">
            Only notices from {orgName}. Update closing times here without duplicate posts.
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {orgNotices.length === 0 && (
              <p className="text-xs text-muted py-4 text-center">No notices yet for this body.</p>
            )}
            {orgNotices.map((n) => (
              <div
                key={n.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-md border border-line bg-app"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink truncate">{n.title}</p>
                  <p className="text-[10px] text-muted font-mono">
                    Closes{' '}
                    {new Date(n.deadline).toLocaleString([], {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingNoticeId(n.id);
                    setNewDeadlineIso(n.deadline);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border border-line text-ink hover:bg-surface shrink-0"
                >
                  <RefreshCw className="w-3 h-3" />
                  Update
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {editingNoticeId && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-lg max-w-md w-full p-5 space-y-4 shadow-xl">
            <h3 className="font-display text-base font-semibold text-ink">Update deadline</h3>
            <div className="space-y-3">
              <div>
                <label className={labelClass}>New date & time</label>
                <input
                  type="datetime-local"
                  value={toDatetimeLocalValue(newDeadlineIso)}
                  onChange={(e) => setNewDeadlineIso(datetimeLocalToIso(e.target.value))}
                  className={`${fieldClass} font-mono text-xs`}
                />
                {newDeadlineIso && (
                  <p className="mt-1.5 text-[11px] text-muted">
                    Will close{' '}
                    <span className="font-medium text-ink">
                      {new Date(newDeadlineIso).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                    {' '}(your local time). Set this a little ahead to test student alerts after Save/Apply.
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Reason</label>
                <input
                  type="text"
                  value={updateReason}
                  onChange={(e) => setUpdateReason(e.target.value)}
                  placeholder="e.g. Recruiter extended by 2 hours"
                  className={fieldClass}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingNoticeId(null)}
                className="px-3 py-2 text-xs font-medium text-muted hover:text-ink"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateNotice(editingNoticeId)}
                className="px-3 py-2 text-xs font-semibold bg-accent text-accent-fg rounded-md"
              >
                Save update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
