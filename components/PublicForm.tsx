
import React, { useState } from 'react';
import { EventData, FormResponse } from '../types';

interface PublicFormProps {
  event?: EventData;
  onClose: () => void;
  onSubmit: (response: FormResponse) => void;
}

const INTENTS = [
  'Simplicity',
  'Liquid Network',
  'Enterprise Custody Solutions',
  'AMP'
];

const PublicForm: React.FC<PublicFormProps> = ({ event, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    title: '',
    company: ''
  });
  const [selectedIntents, setSelectedIntents] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // If the event list is still being parsed or found
  if (!event || event.status === 'Closed') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-300">
          <i className="fa-solid fa-circle-xmark text-red-500 text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Closed</h2>
          <p className="text-slate-500">This event is either no longer accepting responses or the link has expired.</p>
          <button 
            onClick={onClose} 
            className="mt-6 bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const toggleIntent = (intent: string) => {
    setSelectedIntents(prev => 
      prev.includes(intent) ? prev.filter(i => i !== intent) : [...prev, intent]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIntents.length === 0) {
      alert("Please select at least one area of interest.");
      return;
    }
    const response: FormResponse = {
      id: `resp_${Date.now()}`,
      eventId: event.id,
      eventName: event.name,
      ...formData,
      intents: selectedIntents,
      submittedAt: new Date().toISOString()
    };
    onSubmit(response);
    setSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      title: '',
      company: ''
    });
    setSelectedIntents([]);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center text-white">
        <div className="max-w-md animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20">
            <i className="fa-solid fa-check text-3xl"></i>
          </div>
          <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Your inquiry for <b>{event.name}</b> has been received. Our team will contact you shortly.
          </p>
          <div className="space-y-3">
            <button 
              onClick={resetForm} 
              className="w-full bg-white text-slate-900 px-8 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg"
            >
              Submit Another Inquiry
            </button>
            <button 
              onClick={onClose} 
              className="w-full bg-slate-800 text-slate-300 px-8 py-3 rounded-xl font-bold transition-transform active:scale-95 hover:text-white"
            >
              Exit to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in fade-in duration-500">
      <header className="bg-slate-900 text-white p-8 pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl rotate-12">
          <i className="fa-solid fa-bolt-lightning"></i>
        </div>
        <div className="max-w-xl mx-auto relative">
          <div className="inline-block bg-blue-600 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-3">Event Registration</div>
          <h1 className="text-3xl font-extrabold mb-2">{event.name}</h1>
          <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
            <span className="flex items-center gap-1.5"><i className="fa-solid fa-calendar"></i> {event.startDate}</span>
            <span className="flex items-center gap-1.5"><i className="fa-solid fa-location-dot"></i> {event.location}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 -mt-12 px-4 pb-12">
        <form onSubmit={handleFormSubmit} className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-8 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-black">1</span>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                <input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                  <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" placeholder="john@company.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phone</label>
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" placeholder="+1..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Job Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" placeholder="Manager / Director" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Company</label>
                  <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} type="text" placeholder="Organization Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-black">2</span>
              Areas of Inquiry
            </h3>
            <p className="text-sm text-slate-500 mb-4 ml-11 leading-relaxed">Select the specific Blockstream solutions you are interested in discussing:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-0 md:ml-11">
              {INTENTS.map(intent => (
                <button
                  key={intent}
                  type="button"
                  onClick={() => toggleIntent(intent)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all text-left ${
                    selectedIntents.includes(intent)
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-slate-50'
                  }`}
                >
                  {intent}
                  {selectedIntents.includes(intent) ? <i className="fa-solid fa-check-circle"></i> : <i className="fa-regular fa-circle opacity-30"></i>}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
            >
              Submit Inquiry
              <i className="fa-solid fa-paper-plane text-sm opacity-50"></i>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-tighter">
              By submitting, you agree to our contact terms.
            </p>
          </div>
        </form>
      </main>
      <footer className="p-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        Powered by EventForm Native Orchestrator
      </footer>
    </div>
  );
};

export default PublicForm;
