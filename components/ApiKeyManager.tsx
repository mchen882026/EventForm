
import React, { useState } from 'react';
import { ApiKey } from '../types';

interface ApiKeyManagerProps {
  apiKeys: ApiKey[];
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ apiKeys, setApiKeys }) => {
  const [newLabel, setNewLabel] = useState('');
  const [showKey, setShowKey] = useState<string | null>(null);

  const generateKey = () => {
    if (!newLabel) return alert('Please enter a label for the API key');
    
    // Generate a secure-looking random key
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = 'sk_live_';
    for (let i = 0; i < 32; i++) {
      key += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    const newApiKey: ApiKey = {
      id: `key_${Date.now()}`,
      key,
      label: newLabel,
      createdAt: new Date().toISOString()
    };

    setApiKeys((prev) => [newApiKey, ...prev]);
    setNewLabel('');
    setShowKey(key);
  };

  const deleteKey = (id: string) => {
    if (confirm('Revoke this key? Zapier will lose access immediately.')) {
      setApiKeys((prev) => prev.filter(k => k.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">API Access</h2>
        <p className="text-slate-500 mt-1">Manage keys used by Zapier for authentication to this application.</p>
      </header>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Generate New Key</h3>
        <div className="flex gap-4">
          <input 
            type="text" 
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g. Zapier Production Key"
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button 
            onClick={generateKey}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Generate Key
          </button>
        </div>
        {showKey && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm font-bold mb-1 flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation"></i>
              Copy your key now!
            </p>
            <div className="flex items-center gap-2">
              <code className="bg-white px-3 py-1 border border-amber-300 rounded text-amber-900 font-mono text-sm flex-1">
                {showKey}
              </code>
              <button 
                onClick={() => navigator.clipboard.writeText(showKey)}
                className="text-amber-700 hover:text-amber-900 text-sm font-medium"
              >
                Copy
              </button>
            </div>
            <p className="text-amber-600 text-xs mt-2">For security, we cannot show this full key again.</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Label</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prefix</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {apiKeys.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                  No API keys created yet.
                </td>
              </tr>
            ) : (
              apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">{key.label}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">sk_live_...{key.key.slice(-4)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => deleteKey(key.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Revoke
                    </button>
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

export default ApiKeyManager;
