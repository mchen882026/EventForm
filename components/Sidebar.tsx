
import React from 'react';
import { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: Tab.EVENTS, label: 'Events', icon: 'fa-calendar-days' },
    { id: Tab.RESPONSES, label: 'Responses', icon: 'fa-id-card-clip' },
    { id: Tab.API_KEYS, label: 'API Keys', icon: 'fa-key' },
    { id: Tab.INTEGRATIONS, label: 'Integrations', icon: 'fa-plug-circle-bolt' },
    { id: Tab.DOCS, label: 'System Design', icon: 'fa-book' }
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-full flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-bolt-lightning text-amber-400"></i>
          EventForm
        </h1>
        <p className="text-xs text-slate-400 mt-1">Lead Orchestrator</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        v2.0.0 (Native Forms)
      </div>
    </div>
  );
};

export default Sidebar;
