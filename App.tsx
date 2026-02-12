
import React, { useState, useEffect } from 'react';
import { Tab, EventData, ApiKey, FormResponse } from './types';
import Sidebar from './components/Sidebar';
import EventManager from './components/EventManager';
import ApiKeyManager from './components/ApiKeyManager';
import IntegrationGuide from './components/IntegrationGuide';
import SystemDocs from './components/SystemDocs';
import ResponseManager from './components/ResponseManager';
import PublicForm from './components/PublicForm';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.EVENTS);
  const [events, setEvents] = useState<EventData[]>(() => {
    const saved = localStorage.getItem('ef_events');
    return saved ? JSON.parse(saved) : [];
  });
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() => {
    const saved = localStorage.getItem('ef_keys');
    return saved ? JSON.parse(saved) : [];
  });
  const [responses, setResponses] = useState<FormResponse[]>(() => {
    const saved = localStorage.getItem('ef_responses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [publicEventId, setPublicEventId] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Detect Public Form Mode and handle initial data load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('event');
    if (eventId) {
      setPublicEventId(eventId);
    }
    setIsDataLoaded(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('ef_events', JSON.stringify(events));
      localStorage.setItem('ef_keys', JSON.stringify(apiKeys));
      localStorage.setItem('ef_responses', JSON.stringify(responses));
    }
  }, [events, apiKeys, responses, isDataLoaded]);

  const handleClosePublicForm = () => {
    setPublicEventId(null);
    // Clear URL query parameters without reloading page
    const url = new URL(window.location.href);
    url.searchParams.delete('event');
    window.history.pushState({}, '', url.pathname);
  };

  if (publicEventId && isDataLoaded) {
    const event = events.find(e => e.id === publicEventId);
    return (
      <PublicForm 
        event={event} 
        onClose={handleClosePublicForm} 
        onSubmit={(resp) => setResponses(prev => [resp, ...prev])}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case Tab.EVENTS:
        return <EventManager events={events} setEvents={setEvents} responses={responses} />;
      case Tab.RESPONSES:
        return <ResponseManager responses={responses} setResponses={setResponses} events={events} />;
      case Tab.API_KEYS:
        return <ApiKeyManager apiKeys={apiKeys} setApiKeys={setApiKeys} />;
      case Tab.INTEGRATIONS:
        return <IntegrationGuide />;
      case Tab.DOCS:
        return <SystemDocs />;
      default:
        return <EventManager events={events} setEvents={setEvents} responses={responses} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {!isDataLoaded ? (
            <div className="flex items-center justify-center h-64 text-slate-400">
              <i className="fa-solid fa-circle-notch animate-spin text-2xl mr-2"></i>
              Loading orchestrator...
            </div>
          ) : renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
