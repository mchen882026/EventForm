
import React, { useRef, useState, useEffect } from 'react';
import { EventData, FormResponse } from '../types';
import * as XLSX from 'xlsx';
import QRCode from 'qrcode';

interface EventManagerProps {
  events: EventData[];
  setEvents: React.Dispatch<React.SetStateAction<EventData[]>>;
  responses: FormResponse[];
}

const EventManager: React.FC<EventManagerProps> = ({ events, setEvents, responses }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Helper to format dates from various Excel formats
  const formatExcelDate = (val: any): string => {
    if (!val) return 'N/A';
    
    // If it's already a JS Date object (thanks to cellDates: true)
    if (val instanceof Date) {
      return val.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // If it's a string, try to parse it
    if (typeof val === 'string') {
      const parsed = new Date(val);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      }
      return val;
    }

    // If it's a number (Excel serial date), though cellDates:true usually handles this
    if (typeof val === 'number') {
      const date = new Date((val - 25569) * 86400 * 1000);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    return String(val);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target?.result;
      // cellDates: true ensures Excel date serials are converted to JS Dates automatically
      const workbook = XLSX.read(bstr, { type: 'binary', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet) as any[];

      const newEvents: EventData[] = data.map((row, index) => {
        const id = `evt_${Date.now()}_${index}`;
        const eventName = 
          row['Conference / Event'] || 
          row['Event'] || 
          row['Name'] || 
          row.EventName || 
          `Unnamed Event ${index + 1}`;
          
        const rawStart = row['Start Date'] || row['Date'] || row['Start'] || row['StartDate'];
        const rawEnd = row['End Date'] || row['End'] || row['EndDate'] || rawStart;

        return {
          id,
          name: eventName,
          startDate: formatExcelDate(rawStart),
          endDate: formatExcelDate(rawEnd),
          location: row['Location'] || row['City'] || row['Venue'] || 'Remote',
          status: 'Draft',
          formUrl: `${window.location.origin}${window.location.pathname}?event=${id}`
        };
      });

      setEvents((prev) => [...newEvents, ...prev]);
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const cycleStatus = (id: string) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id !== id) return evt;
      const nextStatus: EventData['status'] = 
        evt.status === 'Draft' ? 'Live' : 
        evt.status === 'Live' ? 'Closed' : 'Draft';
      return { ...evt, status: nextStatus };
    }));
  };

  const setBulkStatus = (status: EventData['status']) => {
    setEvents(prev => prev.map(evt => 
      selectedIds.has(evt.id) ? { ...evt, status } : evt
    ));
    setSelectedIds(new Set());
  };

  const deleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} selected event(s)?`)) {
      setEvents(prev => prev.filter(e => !selectedIds.has(e.id)));
      setSelectedIds(new Set());
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === events.length && events.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(events.map(e => e.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  useEffect(() => {
    const generateAllQrs = async () => {
      const newQrCodes: { [key: string]: string } = {};
      for (const event of events) {
        if (event.formUrl) {
          try {
            const url = await QRCode.toDataURL(event.formUrl, {
              width: 300,
              margin: 2,
              color: { dark: '#0f172a', light: '#ffffff' },
            });
            newQrCodes[event.id] = url;
          } catch (err) {
            console.error('Failed QR generation', err);
          }
        }
      }
      setQrCodes(newQrCodes);
    };
    if (events.length > 0) generateAllQrs();
  }, [events]);

  const downloadQr = (eventName: string, dataUrl: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `QR_${eventName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Event Management</h2>
          <p className="text-slate-500 mt-1">Generate internal inquiry forms and scan-to-fill QR codes.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-file-excel"></i>
            Upload Excel
          </button>
          {selectedIds.size > 0 && (
            <div className="flex gap-2">
              <button onClick={() => setBulkStatus('Live')} className="bg-emerald-600 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                Activate
              </button>
              <button onClick={deleteSelected} className="bg-red-50 text-red-600 border border-red-200 p-2 rounded-lg">
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls" className="hidden" />
        </div>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[1300px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                  checked={events.length > 0 && selectedIds.size === events.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Schedule</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Responses</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Form Address</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">QR Code</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {events.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-400 italic">No events found. Upload an Excel to start.</td>
              </tr>
            ) : (
              events.map((event) => {
                const responseCount = responses.filter(r => r.eventId === event.id).length;
                return (
                  <tr key={event.id} className={`hover:bg-slate-50/50 transition-colors ${selectedIds.has(event.id) ? 'bg-blue-50/20' : ''}`}>
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                        checked={selectedIds.has(event.id)}
                        onChange={() => toggleSelect(event.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{event.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{event.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 whitespace-nowrap">
                        {event.startDate === event.endDate ? event.startDate : `${event.startDate} - ${event.endDate}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold text-sm">
                        {responseCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <div className="truncate text-xs text-slate-500 font-mono bg-slate-50 border border-slate-200 px-2 py-1 rounded flex-1">
                          {event.formUrl}
                        </div>
                        <button 
                          onClick={() => copyToClipboard(event.formUrl || '', event.id)}
                          className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                            copiedId === event.id 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
                          }`}
                          title="Copy Link"
                        >
                          <i className={`fa-solid ${copiedId === event.id ? 'fa-check' : 'fa-copy'} text-xs`}></i>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 flex justify-center">
                      {qrCodes[event.id] ? (
                        <div className="relative group">
                          <img 
                            src={qrCodes[event.id]} 
                            className="w-12 h-12 border border-slate-200 rounded p-0.5 bg-white cursor-zoom-in"
                            onClick={() => window.open(event.formUrl)}
                          />
                          <button 
                            onClick={(e) => { e.stopPropagation(); downloadQr(event.name, qrCodes[event.id]); }}
                            className="absolute -top-1 -right-1 bg-slate-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100"
                          >
                            <i className="fa-solid fa-download"></i>
                          </button>
                        </div>
                      ) : <div className="w-12 h-12 bg-slate-100 rounded" />}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => cycleStatus(event.id)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
                          event.status === 'Live' ? 'bg-emerald-100 text-emerald-700' :
                          event.status === 'Closed' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {event.status}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <a href={event.formUrl} target="_blank" className="text-blue-600 text-xs font-bold hover:underline">
                        Preview Form
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventManager;
