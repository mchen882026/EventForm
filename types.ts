
export interface EventData {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  status: 'Draft' | 'Live' | 'Closed';
  formUrl?: string;
}

export interface FormResponse {
  id: string;
  eventId: string;
  eventName: string;
  fullName: string;
  email: string;
  phone: string;
  title: string;
  company: string;
  intents: string[];
  submittedAt: string;
}

export interface ApiKey {
  id: string;
  key: string;
  label: string;
  createdAt: string;
  lastUsed?: string;
}

export enum Tab {
  EVENTS = 'events',
  RESPONSES = 'responses',
  API_KEYS = 'api_keys',
  INTEGRATIONS = 'integrations',
  DOCS = 'docs'
}
