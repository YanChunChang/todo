export type Status = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';

export interface Todo {
  id: number;
  title: string;
  status: Status;
  status_display: string;
  description?: string;
  created_at: string;
  updated_at: string;
}