import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Plus } from "lucide-react";
import { categories } from "@/types/drug";

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onAddDrug: () => void;
}

export function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onAddDrug,
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
          <Input
            placeholder="Search drugs, generics, or manufacturers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white text-black placeholder:text-gray-600 font-bold"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white font-bold">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-4 border-black bg-white">
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="font-bold">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={onAddDrug}
        className="bg-green-400 hover:bg-green-500 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-lg px-6 py-3"
      >
        <Plus className="w-5 h-5 mr-2" />
        ADD DRUG
      </Button>
    </div>
  );
}
