export interface Drug {
  id: number;
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

export const initialDrugs: Drug[] = [
  {
    id: 1,
    name: "Amoxicillin",
    generic_name: "Amoxicillin",
    dosage: "500mg",
    quantity: 150,
    expiration_date: "2025-08-15",
    manufacturer: "PharmaCorp",
    price: 12.99,
    category: "Antibiotic",
    description: "Broad-spectrum antibiotic for bacterial infections",
  },
  {
    id: 2,
    name: "Lisinopril",
    generic_name: "Lisinopril",
    dosage: "10mg",
    quantity: 200,
    expiration_date: "2025-12-01",
    manufacturer: "MediGen",
    price: 8.5,
    category: "ACE Inhibitor",
    description: "Used to treat high blood pressure and heart failure",
  },
  {
    id: 3,
    name: "Metformin",
    generic_name: "Metformin HCl",
    dosage: "850mg",
    quantity: 75,
    expiration_date: "2025-06-30",
    manufacturer: "DiabetesCare",
    price: 15.25,
    category: "Antidiabetic",
    description: "First-line treatment for type 2 diabetes",
  },
  {
    id: 4,
    name: "Ibuprofen",
    generic_name: "Ibuprofen",
    dosage: "200mg",
    quantity: 300,
    expiration_date: "2026-03-20",
    manufacturer: "PainRelief Inc",
    price: 6.99,
    category: "NSAID",
    description: "Anti-inflammatory pain reliever",
  },
];
