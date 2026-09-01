import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Copy, Check, X, Share2 } from 'lucide-react';

export const WhatsAppModal = () => {
  const { whatsAppModalNotice, setWhatsAppModalNotice, showToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!whatsAppModalNotice) return null;

  const text = whatsAppModalNotice.whatsappFormatted;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('WhatsApp alert string copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-line rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        <button 
          onClick={() => setWhatsAppModalNotice(null)}
          className="absolute top-4 right-4 p-1 rounded-lg text-muted hover:text-ink hover:bg-app transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-ok-soft border border-ok/30 flex items-center justify-center text-ok">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-ink">Simulated WhatsApp Broadcast Alert</h3>
            <p className="text-xs text-muted">Standardized zero-noise format pushed to batch WhatsApp groups.</p>
          </div>
        </div>

        <div className="bg-[#111b21] p-4 rounded-xl font-mono text-xs text-emerald-100 border border-emerald-900/60 whitespace-pre-wrap leading-relaxed shadow-inner">
          {text}
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[10px] text-muted italic">
            *One-way broadcast prevents conversational clutter & reply spam.
          </p>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
            <span className="text-white">{copied ? 'Copied to Clipboard!' : 'Copy Alert String'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
