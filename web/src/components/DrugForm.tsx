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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Drug, categories } from "@/types/drug";
import { useState, useEffect } from "react";

interface DrugFormProps {
  formData: Partial<Drug>;
  setFormData: (data: Partial<Drug>) => void;
  onSubmit: () => void;
  submitText: string;
  submitButtonClass?: string;
  validationErrors?: string[];
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
  validationErrors = [],
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

  const hasFieldError = (fieldName: string) => {
    const fieldDisplayNames: Record<string, string[]> = {
      name: ["Drug Name"],
      generic_name: ["Generic Name"],
      sku: ["SKU"],
      dosage: ["Dosage"],
      quantity: ["Quantity"],
      expiration_date: ["Expiration Date"],
      manufacturer: ["Manufacturer"],
      price: ["Price"],
      category: ["Category"],
    };

    const possibleNames = fieldDisplayNames[fieldName] || [fieldName];

    return validationErrors.some((error) =>
      possibleNames.some((name) => error.includes(name))
    );
  };

  return (
    <div className="space-y-4 overflow-y-auto p-6 max-h-[70vh]">
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Please fix the following errors:</p>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label className={hasFieldError("name") ? "text-destructive" : ""}>
            Drug Name
          </Label>
          <Input
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={
              hasFieldError("name")
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
        </div>
        <div>
          <Label
            className={hasFieldError("generic_name") ? "text-destructive" : ""}
          >
            Generic Name
          </Label>
          <Input
            value={formData.generic_name || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                generic_name: e.target.value,
              })
            }
            className={
              hasFieldError("generic_name")
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
        </div>
        <div>
          <Label className={hasFieldError("sku") ? "text-destructive" : ""}>
            SKU
          </Label>
          <Input
            value={formData.sku || ""}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className={
              hasFieldError("sku")
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
        </div>
        <div>
          <Label className={hasFieldError("dosage") ? "text-destructive" : ""}>
            Dosage
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.1"
              placeholder="Amount"
              value={dosageValue}
              onChange={handleDosageValueChange}
              className={`flex-1 ${
                hasFieldError("dosage")
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
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
          <Label
            className={hasFieldError("quantity") ? "text-destructive" : ""}
          >
            Quantity
          </Label>
          <Input
            type="number"
            value={formData.quantity || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: Number.parseInt(e.target.value),
              })
            }
            className={
              hasFieldError("quantity")
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
        </div>
        <div>
          <Label
            className={
              hasFieldError("expiration_date") ? "text-destructive" : ""
            }
          >
            Expiration Date
          </Label>
          <Input
            type="date"
            value={formData.expiration_date || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                expiration_date: e.target.value,
              })
            }
            className={
              hasFieldError("expiration_date")
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
        </div>
        <div>
          <Label
            className={hasFieldError("manufacturer") ? "text-destructive" : ""}
          >
            Manufacturer
          </Label>
          <Input
            value={formData.manufacturer || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                manufacturer: e.target.value,
              })
            }
            className={
              hasFieldError("manufacturer")
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
        </div>
        <div>
          <Label className={hasFieldError("price") ? "text-destructive" : ""}>
            Price ($)
          </Label>
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
            className={
              hasFieldError("price")
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
        </div>
        <div>
          <Label
            className={hasFieldError("category") ? "text-destructive" : ""}
          >
            Category
          </Label>
          <Select
            value={formData.category || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger
              className={
                hasFieldError("category")
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            >
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
