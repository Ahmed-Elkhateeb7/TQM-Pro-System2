export type PageView = 'dashboard' | 'products' | 'team' | 'kpi' | 'documents' | 'about';

export interface Product {
  id: string;
  name: string;
  specs: string;
  defects: string;
  status: 'approved' | 'rejected' | 'pending';
  image: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: 'management' | 'qc' | 'qa';
  joinedDate: string;
  email: string;
  phone: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'word';
  size: string;
  date: string;
  url: string; // Simulated URL
}

export interface KPIData {
  month: string;
  qualityRate: number;
  defects: number;
}