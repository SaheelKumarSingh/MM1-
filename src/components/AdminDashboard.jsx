import React from 'react';
import { useApp } from '../context/AppContext';
import { INSTITUTION_METRICS } from '../data/seedData';
import { 
  BarChart3, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  FileCheck, 
  Clock, 
  Activity,
  Award
} from 'lucide-react';

export const AdminDashboard = () => {
  const { notices } = useApp();

  const activeDeadlines = notices.filter(n => new Date(n.deadline).getTime() > new Date().getTime());
  const expiredDeadlines = notices.filter(n => new Date(n.deadline).getTime() <= new Date().getTime());
  const totalApplications = notices.reduce((acc, curr) => acc + (curr.stats.applied || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-dark-surface via-dark-card to-dark-surface border border-sunrise-500/30 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sunrise-500/10 border border-sunrise-500/30 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-sunrise-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-ink">IIMV PGP Compliance Dashboard</h2>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold">
                Read-Only Audit
              </span>
            </div>
            <p className="text-xs text-muted">
              PlaceCom compliance & verified publisher audit for IIM Visakhapatnam PGP.
            </p>
          </div>
        </div>

        <div className="bg-dark-surface/90 border border-dark-border px-3 py-1.5 rounded-xl flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono text-muted">Placement Audit Trail: <strong className="text-ink">Active & Verifiable</strong></span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Live Deadlines</span>
            <Clock className="w-4 h-4 text-sunrise-400" />
          </div>
          <div className="text-2xl font-extrabold text-ink font-mono">{activeDeadlines.length}</div>
          <p className="text-[11px] text-emerald-400 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>100% On-Time Resolution</span>
          </p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Placement Compliance Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{INSTITUTION_METRICS.placementCompliance}</div>
          <p className="text-[11px] text-muted">Zero unverified link broadcasts</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Missed Deadline Drop</span>
            <Activity className="w-4 h-4 text-sunrise-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-red-400 line-through font-mono">{INSTITUTION_METRICS.missedDeadlineRateBefore}</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">→ {INSTITUTION_METRICS.missedDeadlineRateAfter}</span>
          </div>
          <p className="text-[11px] text-muted">Measured post-PulseLine rollout</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Active Student Body</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-ink font-mono">{INSTITUTION_METRICS.totalStudentsEngaged}</div>
          <p className="text-[11px] text-muted">100% Campus Penetration</p>
        </div>

      </div>

      {/* Two Column Layout: Publisher Leaderboard & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Publisher Activity & Compliance Leaderboard */}
        <div className="lg:col-span-6 bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <h3 className="text-base font-bold text-ink flex items-center space-x-2">
              <Award className="w-4 h-4 text-sunrise-400" />
              <span>Publisher Compliance Leaderboard</span>
            </h3>
            <span className="text-[10px] text-muted font-mono">Verified Bodies</span>
          </div>

          <div className="space-y-3">
            {INSTITUTION_METRICS.topPublishers.map((pub, idx) => (
              <div key={idx} className="bg-dark-surface p-3 rounded-xl border border-dark-border flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-sunrise-500/10 border border-sunrise-500/30 flex items-center justify-center text-xs font-mono font-bold text-sunrise-400">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-ink">{pub.name}</h4>
                    <p className="text-[10px] text-muted font-mono">{pub.count} Standard Broadcasts Issued</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-extrabold text-emerald-400">{pub.compliance}</span>
                  <p className="text-[10px] text-muted">Compliance</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Timeline */}
        <div className="lg:col-span-6 bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <h3 className="text-base font-bold text-ink flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-sunrise-400" />
              <span>Real-Time Audit Trail Log</span>
            </h3>
            <span className="text-[10px] text-muted font-mono">Immutable Log</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {notices.map(notice => (
              <div key={notice.id} className="bg-dark-surface p-3 rounded-xl border border-dark-border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-ink truncate max-w-[200px]">{notice.title}</span>
                  <span className="text-[10px] font-mono text-sunrise-400">{notice.categoryLabel}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted">
                  <span>Publisher: <strong className="text-muted">{notice.publisher}</strong></span>
                  <span>Applied: <strong className="text-emerald-400">{notice.stats.applied}</strong></span>
                </div>

                <div className="text-[10px] font-mono text-muted bg-dark-bg p-1.5 rounded border border-dark-border/60">
                  {notice.history?.[0]?.note || 'Notice Published'}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
