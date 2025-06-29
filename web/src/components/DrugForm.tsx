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
  submitButtonClass: string;
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
    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-black font-bold">Drug Name</Label>
          <Input
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
          />
        </div>
        <div>
          <Label className="text-black font-bold">Generic Name</Label>
          <Input
            value={formData.generic_name || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                generic_name: e.target.value,
              })
            }
            className="border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
          />
        </div>
        <div>
          <Label className="text-black font-bold">SKU</Label>
          <Input
            value={formData.sku || ""}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className="border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
          />
        </div>
        <div>
          <Label className="text-black font-bold">Dosage</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.1"
              placeholder="Amount"
              value={dosageValue}
              onChange={handleDosageValueChange}
              className="border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold flex-1"
            />
            <Select value={dosageUnit} onValueChange={handleDosageUnitChange}>
              <SelectTrigger className="border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-4 border-black bg-white">
                {dosageUnits.map((unit) => (
                  <SelectItem key={unit} value={unit} className="font-bold">
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-black font-bold">Quantity</Label>
          <Input
            type="number"
            value={formData.quantity || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: Number.parseInt(e.target.value),
              })
            }
            className="border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
          />
        </div>
        <div>
          <Label className="text-black font-bold">Expiration Date</Label>
          <Input
            type="date"
            value={formData.expiration_date || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                expiration_date: e.target.value,
              })
            }
            className="border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
          />
        </div>
        <div>
          <Label className="text-black font-bold">Manufacturer</Label>
          <Input
            value={formData.manufacturer || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                manufacturer: e.target.value,
              })
            }
            className="border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
          />
        </div>
        <div>
          <Label className="text-black font-bold">Price ($)</Label>
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
            className="border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
          />
        </div>
        <div>
          <Label className="text-black font-bold">Category</Label>
          <Select
            value={formData.category || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger className="border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="border-4 border-black bg-white">
              {categories.slice(1).map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="font-bold"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-black font-bold">Description</Label>
        <Textarea
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
          className="border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
          rows={3}
        />
      </div>
      <Button
        onClick={onSubmit}
        className={`w-full ${submitButtonClass} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-lg py-3`}
      >
        {submitText}
      </Button>
    </div>
  );
}
