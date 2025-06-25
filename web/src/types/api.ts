import { Drug } from "./drug";

export interface CreateDrugRequest {
  name: string;
  generic_name: string;
  dosage: string;
  quantity: number;
  expiration_date: string;
  manufacturer: string;
  price: number;
  category: string;
  description?: string;
}

export interface UpdateDrugRequest {
  name?: string;
  generic_name?: string;
  dosage?: string;
  quantity?: number;
  expiration_date?: string;
  manufacturer?: string;
  price?: number;
  category?: string;
  description?: string;
}

export type DrugResponse = Drug;
