export type Status = 'Offen' | 'In Bearbeitung' | 'Fertig';

export interface Todo {
  id: string;
  title: string;
  status: Status;
  description?: string;
  created_at: string;
  updated_at: string;
}