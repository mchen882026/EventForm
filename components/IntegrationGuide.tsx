
import React from 'react';

const IntegrationGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Integration Hub</h2>
        <p className="text-slate-500 mt-1">Connect your native inquiries to Copper CRM via Zapier.</p>
      </header>

      <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-900 border-b pb-4">Native Pattern: App &rarr; Zapier &rarr; Copper</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
            <h4 className="font-bold">Step 1: Webhook Trigger</h4>
            <p className="text-sm text-slate-600">
              Since we are using internal collection, you can point a Zapier <b>Catch Hook</b> to an endpoint, or use the API Key to poll <code>/api/responses</code>.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">2</div>
            <h4 className="font-bold">Step 2: Authentication</h4>
            <p className="text-sm text-slate-600">
              Zapier calls this app with the header <code>Authorization: Bearer [API_KEY]</code> to fetch the latest leads securely.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">3</div>
            <h4 className="font-bold">Step 3: Copper Sync</h4>
            <p className="text-sm text-slate-600">
              <b>Copper: Create Person</b>. Map "Company" and "Title" directly. Use "Intents" as a <b>Tag</b> or <b>Note</b>.
            </p>
          </div>
        </div>

        <div className="mt-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h4 className="font-semibold text-slate-800 mb-3">Field Mapping (Native)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-2">Form Source</th>
                  <th className="pb-2">API Property</th>
                  <th className="pb-2">Copper Destination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr><td className="py-2">Full Name</td><td className="py-2"><code>fullName</code></td><td className="py-2">Name</td></tr>
                <tr><td className="py-2">Email</td><td className="py-2"><code>email</code></td><td className="py-2">Email (Primary)</td></tr>
                <tr><td className="py-2">Job Title</td><td className="py-2"><code>title</code></td><td className="py-2">Title</td></tr>
                <tr><td className="py-2">Company</td><td className="py-2"><code>company</code></td><td className="py-2">Company Name</td></tr>
                <tr><td className="py-2">Inquiry Intent</td><td className="py-2"><code>intents</code></td><td className="py-2">Tags / Activity Note</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntegrationGuide;
