import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Plus, Upload } from "lucide-react";
import { categories } from "@/types/drug";

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onAddDrug: () => void;
  onBatchImport: () => void;
}

export function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onAddDrug,
  onBatchImport,
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
      <div className="flex flex-1 flex-col gap-2 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search drugs, generics, or manufacturers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button onClick={onBatchImport} variant="outline">
          <Upload className="mr-2 h-5 w-5" />
          Batch Import
        </Button>
        <Button onClick={onAddDrug}>
          <Plus className="mr-2 h-5 w-5" />
          Add Drug
        </Button>
      </div>
    </div>
  );
}
