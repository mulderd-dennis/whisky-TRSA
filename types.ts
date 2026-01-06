
export interface Whisky {
  id: string;
  name: string;
  distillery: string;
  region: string;
  bottleSizeCl: number; // usually 70
}

export interface InventoryItem {
  whiskyId: string;
  startCl: number;
  endCl?: number;
}

export interface EventLog {
  id: string;
  title: string;
  date: string;
  location: string;
  organizer: string;
  ambassador: string;
  inventory: InventoryItem[];
  status: 'draft' | 'active' | 'completed';
  createdAt: number;
}

export enum AppState {
  DASHBOARD = 'DASHBOARD',
  CREATE_EVENT = 'CREATE_EVENT',
  INVENTORY_START = 'INVENTORY_START',
  INVENTORY_END = 'INVENTORY_END',
  EVENT_DETAIL = 'EVENT_DETAIL'
}
