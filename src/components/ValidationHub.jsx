import React, { useState } from 'react';
import { STUDENT_INTERVIEWS, VALIDATION_STATS, MONETIZATION_MODEL } from '../data/interviewData';
import { 
  Quote, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  BarChart2, 
  Users, 
  Lightbulb, 
  Building,
  Target,
  Sparkles,
  Volume2
} from 'lucide-react';

export const ValidationHub = () => {
  const [studentCount, setStudentCount] = useState(420);

  // Pricing calculator math tailored to IIMV PGP cohort size
  // B2B Pricing: ₹120 per student/year
  const calculatedAnnualFee = Math.round(studentCount * 120);
  const hoursSavedPerYear = Math.round((studentCount / 1000) * 500);
  const placementRiskPrevented = Math.round((studentCount * 0.18 * 450000));

  return (
    <div className="space-y-6">
      
      {/* Pitch Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/30 via-dark-card to-dark-card border border-amber-500/40 rounded-2xl p-5 shadow-xl space-y-2">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">
            Case Competition Pitch Deck Asset
          </span>
          <span className="text-xs text-muted font-mono">• 5 Empirical Case Studies</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-ink">
          Validation & Qualitative Research Hub
        </h2>
        <p className="text-xs sm:text-sm text-muted max-w-3xl">
          Empirical validation for PulseLine at IIM Visakhapatnam — PGP placement & club deadline noise.
        </p>
      </div>

      {/* Metric Proof Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {VALIDATION_STATS.map((stat, idx) => (
          <div key={idx} className="bg-dark-card border border-dark-border rounded-2xl p-4 space-y-2 hover:border-amber-500/30 transition-colors">
            <div className="text-3xl font-extrabold text-amber-400 font-mono">{stat.value}</div>
            <h3 className="text-xs font-bold text-ink leading-snug">{stat.label}</h3>
            <p className="text-[10px] text-muted">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* 5 Qualitative Student Interview Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-ink flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <span>1-on-1 Student & Admin Interview Transcripts (N = 5)</span>
          </h3>
          <span className="text-xs text-muted font-mono">Qualitative Field Interviews</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STUDENT_INTERVIEWS.map((interview) => (
            <div key={interview.id} className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4 relative overflow-hidden flex flex-col justify-between">
              
              {/* Profile Header */}
              <div className="flex items-start space-x-3">
                <img 
                  src={interview.avatar} 
                  alt={interview.name} 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/30 shrink-0" 
                />
                <div>
                  <h4 className="text-sm font-bold text-ink flex items-center space-x-2">
                    <span>{interview.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      interview.painSeverity === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {interview.painSeverity} Impact
                    </span>
                  </h4>
                  <p className="text-xs text-muted font-medium">{interview.role}</p>
                  <p className="text-[10px] text-muted font-mono">{interview.campus}</p>
                </div>
              </div>

              {/* Direct Quote */}
              <div className="bg-dark-surface/90 border border-dark-border p-3.5 rounded-xl relative">
                <Quote className="w-4 h-4 text-amber-500/40 absolute top-2 right-2" />
                <p className="text-xs text-ink italic leading-relaxed">
                  "{interview.quote}"
                </p>
              </div>

              {/* Workaround & Why it Fails */}
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="bg-dark-bg p-2.5 rounded-xl border border-dark-border">
                  <span className="text-[10px] font-bold text-muted uppercase font-mono block">Current Campus Workaround:</span>
                  <span className="text-muted font-semibold">{interview.currentWorkaround}</span>
                </div>
                <div className="bg-red-950/20 p-2.5 rounded-xl border border-red-500/30">
                  <span className="text-[10px] font-bold text-red-400 uppercase font-mono block">Where Workaround Breaks Down:</span>
                  <span className="text-muted">{interview.whyWorkaroundFails}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {interview.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="bg-dark-surface text-muted text-[10px] px-2 py-0.5 rounded-full border border-dark-border">
                    #{tag}
                  </span>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Interactive Institutional B2B ROI Calculator */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-ink flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>B2B Institutional Subscription & ROI Estimator</span>
            </h3>
            <p className="text-xs text-muted">
              Calculate annual license value and administrative cost savings for campus adoption.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
            SaaS B2B Pricing Model
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Slider & Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-ink mb-2">
                <span>Total Enrolled Student Batch Size:</span>
                <span className="text-amber-400 font-mono text-base">{studentCount.toLocaleString()} Students</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                className="w-full h-2 bg-dark-surface rounded-lg appearance-none cursor-pointer accent-sunrise-500"
              />
              <div className="flex justify-between text-[10px] text-muted font-mono mt-1">
                <span>500 (B-School)</span>
                <span>5,000 (Tech Institute)</span>
                <span>10,000 (State Uni)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-dark-surface rounded-xl border border-dark-border">
                <span className="text-muted">Annual Institutional License Fee:</span>
                <span className="font-mono font-bold text-ink text-sm">₹{calculatedAnnualFee.toLocaleString()} / year</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-dark-surface rounded-xl border border-dark-border">
                <span className="text-muted">Student Cost per Year:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">₹120 / student (~₹10/mo)</span>
              </div>
            </div>
          </div>

          {/* ROI Metric Outputs */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-dark-surface p-4 rounded-xl border border-dark-border space-y-1">
              <span className="text-[10px] uppercase font-mono text-muted">PlaceCom Admin Hours Saved</span>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">{hoursSavedPerYear.toLocaleString()} hrs / yr</div>
              <p className="text-[10px] text-muted">Replaced manual broadcast chaos</p>
            </div>

            <div className="bg-dark-surface p-4 rounded-xl border border-dark-border space-y-1">
              <span className="text-[10px] uppercase font-mono text-muted">Placement Risk Protection</span>
              <div className="text-xl font-extrabold text-amber-400 font-mono">₹{(placementRiskPrevented / 100000).toFixed(1)} Lakhs</div>
              <p className="text-[10px] text-muted">Value of zero missed placement rounds</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
