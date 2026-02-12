
import React, { useState } from 'react';
import { FormResponse, EventData } from '../types';

interface ResponseManagerProps {
  responses: FormResponse[];
  setResponses: React.Dispatch<React.SetStateAction<FormResponse[]>>;
  events: EventData[];
}

const ResponseManager: React.FC<ResponseManagerProps> = ({ responses, setResponses, events }) => {
  const [filterEventId, setFilterEventId] = useState<string>('all');

  const filteredResponses = filterEventId === 'all' 
    ? responses 
    : responses.filter(r => r.eventId === filterEventId);

  const exportCsv = () => {
    if (responses.length === 0) return;
    const headers = ['Event', 'Full Name', 'Email', 'Phone', 'Title', 'Company', 'Intents', 'Submitted At'];
    const rows = filteredResponses.map(r => [
      r.eventName,
      r.fullName,
      r.email,
      r.phone,
      r.title,
      r.company,
      r.intents.join('; '),
      r.submittedAt
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `responses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Form Responses</h2>
          <p className="text-slate-500 mt-1">View and manage collected lead inquiries.</p>
        </div>
        <button 
          onClick={exportCsv}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <i className="fa-solid fa-file-export"></i>
          Export CSV
        </button>
      </header>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <label className="text-sm font-bold text-slate-500 uppercase">Filter by Event:</label>
        <select 
          value={filterEventId} 
          onChange={(e) => setFilterEventId(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Events</option>
          {events.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Attendee</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Company/Title</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Inquiry Intents</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Event</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredResponses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No responses found.</td>
              </tr>
            ) : (
              filteredResponses.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{res.fullName}</div>
                    <div className="text-xs text-blue-600">{res.email}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{res.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">{res.company}</div>
                    <div className="text-xs text-slate-400">{res.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {res.intents.map(intent => (
                        <span key={intent} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-200">
                          {intent}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {res.eventName}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(res.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponseManager;
