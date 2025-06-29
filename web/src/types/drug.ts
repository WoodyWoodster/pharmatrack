export interface Drug {
  id: number;
  sku: string;
  name: string;
  generic_name: string;
  dosage: string;
  quantity: number;
  expiration_date: string;
  manufacturer: string;
  price: number;
  category: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export const categories = [
  "All",
  "Antibiotic",
  "ACE Inhibitor",
  "Antidiabetic",
  "NSAID",
  "Analgesic",
  "Antihypertensive",
];
