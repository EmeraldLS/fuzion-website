export interface Profile {
  id: string;
  role: "admin" | "worker";
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface WorkerAssignment {
  id: string;
  admin_id: string;
  worker_id: string;
  created_at: string;
}
