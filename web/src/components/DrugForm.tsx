import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Drug, categories } from "@/types/drug";
import { useState, useEffect } from "react";

interface DrugFormProps {
  formData: Partial<Drug>;
  setFormData: (data: Partial<Drug>) => void;
  onSubmit: () => void;
  submitText: string;
  submitButtonClass?: string;
}

const dosageUnits = [
  "mg",
  "g",
  "ml",
  "L",
  "mcg",
  "units",
  "IU",
  "drops",
  "tablets",
  "capsules",
];

export function DrugForm({
  formData,
  setFormData,
  onSubmit,
  submitText,
  submitButtonClass,
}: DrugFormProps) {
  const [dosageValue, setDosageValue] = useState("");
  const [dosageUnit, setDosageUnit] = useState("mg");

  useEffect(() => {
    if (formData.dosage) {
      const match = formData.dosage.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
      if (match) {
        setDosageValue(match[1]);
        setDosageUnit(match[2]);
      } else {
        setDosageValue(formData.dosage);
        setDosageUnit("mg");
      }
    } else {
      setDosageValue("");
      setDosageUnit("mg");
    }
  }, [formData.dosage]);

  const updateDosage = (value: string, unit: string) => {
    const combinedDosage = value ? `${value}${unit}` : "";
    setFormData({ ...formData, dosage: combinedDosage });
  };

  const handleDosageValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDosageValue(value);
    updateDosage(value, dosageUnit);
  };

  const handleDosageUnitChange = (unit: string) => {
    setDosageUnit(unit);
    updateDosage(dosageValue, unit);
  };

  return (
    <div className="space-y-4 overflow-y-auto p-6 max-h-[70vh]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Drug Name</Label>
          <Input
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <Label>Generic Name</Label>
          <Input
            value={formData.generic_name || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                generic_name: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label>SKU</Label>
          <Input
            value={formData.sku || ""}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />
        </div>
        <div>
          <Label>Dosage</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.1"
              placeholder="Amount"
              value={dosageValue}
              onChange={handleDosageValueChange}
              className="flex-1"
            />
            <Select value={dosageUnit} onValueChange={handleDosageUnitChange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dosageUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Quantity</Label>
          <Input
            type="number"
            value={formData.quantity || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: Number.parseInt(e.target.value),
              })
            }
          />
        </div>
        <div>
          <Label>Expiration Date</Label>
          <Input
            type="date"
            value={formData.expiration_date || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                expiration_date: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label>Manufacturer</Label>
          <Input
            value={formData.manufacturer || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                manufacturer: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label>Price ($)</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.price || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: Number.parseFloat(e.target.value),
              })
            }
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select
            value={formData.category || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.slice(1).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
          rows={3}
        />
      </div>
      <Button onClick={onSubmit} className={`w-full ${submitButtonClass}`}>
        {submitText}
      </Button>
    </div>
  );
}
