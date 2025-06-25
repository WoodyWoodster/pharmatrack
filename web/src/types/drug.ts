export interface Drug {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  quantity: number;
  expirationDate: string;
  manufacturer: string;
  price: number;
  category: string;
  description: string;
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
    id: "1",
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    dosage: "500mg",
    quantity: 150,
    expirationDate: "2025-08-15",
    manufacturer: "PharmaCorp",
    price: 12.99,
    category: "Antibiotic",
    description: "Broad-spectrum antibiotic for bacterial infections",
  },
  {
    id: "2",
    name: "Lisinopril",
    genericName: "Lisinopril",
    dosage: "10mg",
    quantity: 200,
    expirationDate: "2025-12-01",
    manufacturer: "MediGen",
    price: 8.5,
    category: "ACE Inhibitor",
    description: "Used to treat high blood pressure and heart failure",
  },
  {
    id: "3",
    name: "Metformin",
    genericName: "Metformin HCl",
    dosage: "850mg",
    quantity: 75,
    expirationDate: "2025-06-30",
    manufacturer: "DiabetesCare",
    price: 15.25,
    category: "Antidiabetic",
    description: "First-line treatment for type 2 diabetes",
  },
  {
    id: "4",
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    dosage: "200mg",
    quantity: 300,
    expirationDate: "2026-03-20",
    manufacturer: "PainRelief Inc",
    price: 6.99,
    category: "NSAID",
    description: "Anti-inflammatory pain reliever",
  },
];
