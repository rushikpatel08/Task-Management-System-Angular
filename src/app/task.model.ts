export interface Task {
  id?: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  assignedTo: {
    id?: number;
    email?: string;
    name?: string;
    password?: string;
    role?: string;
  };
}
