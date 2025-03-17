export interface TestRun {
  id: string;
  name: string;
  project: string;
  progress?: { current: number, total: number, percentage: number };
  results?: { success: number, errors: number };
  date?: string;
}
