
import React from 'react';

const SystemDocs: React.FC = () => {
  const troubleshooting = `// Why is my Tally form not pre-filling?
1. Ensure the "Hidden Field" in Tally is created.
2. The Hidden Field name must match exactly (e.g., "event_name").
3. Your Tally URL must follow the format: tally.so/r/XXXX?field_name=value`;

  return (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-3xl font-bold mb-4">A) System Architecture</h2>
      <div className="bg-slate-900 text-blue-400 p-6 rounded-lg font-mono text-sm leading-relaxed mb-8 whitespace-pre">
{`[Excel File] --(Upload)--> [Automator Web App]
                      |
                      v
                [Pre-fill URL Generation]
                      |
                      v
[Tally.so] --(Submission)--> [Zapier Trigger]
                           |
                         (Auth: Bearer API_KEY)
                           |
                           v
[Copper CRM] <------------ [Zapier Action]`.replace('<', '&lt;')}
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
        <h4 className="font-bold text-amber-800 mb-2">Important Note on "Live" Status</h4>
        <p className="text-sm text-amber-700">
          The <b>Live/Draft/Closed</b> status within this dashboard is for <b>Internal Management</b> only. 
          Changing a status here does not affect your Tally.so account. It is intended to help you filter events
          during Zapier automation (e.g., only sync "Live" events).
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">B) Tally URL Logic</h2>
      <p className="text-slate-600 mb-4">
        We use Tally's <b>Query Parameter Pre-filling</b>. This avoids the complexity of the Tally API 
        while remaining highly reliable.
      </p>
      <div className="bg-slate-100 p-4 rounded-lg font-mono text-xs whitespace-pre mb-8">
        {troubleshooting}
      </div>

      <h2 className="text-2xl font-bold mb-4">C) API Integration Design</h2>
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8">
        <div className="space-y-4">
          <div>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold mr-2 uppercase">GET</span>
            <code>/api/events</code>
            <p className="text-xs text-slate-500 mt-1">Returns list of active events. Auth: Header Authorization: Bearer sk_...</p>
          </div>
          <div>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold mr-2 uppercase">POST</span>
            <code>/api/keys</code>
            <p className="text-xs text-slate-500 mt-1">Admin endpoint to generate new access tokens.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDocs;
