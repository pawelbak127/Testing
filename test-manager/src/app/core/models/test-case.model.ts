export interface TestCase {
  id: string;
  name: string;
  project: { name: string; color: string };
  priority: { level: string; color: string };
  author: string;
  creationDate: string;
  status: { name: string; color: string };
}
