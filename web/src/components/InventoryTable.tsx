import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Drug } from "@/types/drug";
import { cn } from "@/lib/utils";

interface InventoryTableProps {
  drugs: Drug[];
  onEditDrug: (drug: Drug) => void;
  onDeleteDrug: (drug: Drug) => void;
}

export function InventoryTable({
  drugs,
  onEditDrug,
  onDeleteDrug,
}: InventoryTableProps) {
  const getCategoryBadgeClass = (category: string) => {
    const colorMap: { [key: string]: string } = {
      Antibiotic: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
      "ACE Inhibitor":
        "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
      Antidiabetic:
        "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
      NSAID:
        "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
      Analgesic:
        "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100",
      Antihypertensive:
        "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-100",
    };
    return colorMap[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory ({drugs.length} items)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drug Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Generic</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drugs.length > 0 ? (
                drugs.map((drug) => (
                  <TableRow key={drug.id}>
                    <TableCell className="font-medium">{drug.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {drug.sku || "—"}
                    </TableCell>
                    <TableCell>{drug.generic_name}</TableCell>
                    <TableCell>{drug.dosage}</TableCell>
                    <TableCell
                      className={
                        drug.quantity < 100
                          ? "text-destructive font-bold"
                          : "font-bold"
                      }
                    >
                      {drug.quantity}
                    </TableCell>
                    <TableCell>{drug.expiration_date}</TableCell>
                    <TableCell>{drug.manufacturer}</TableCell>
                    <TableCell className="font-medium">
                      ${drug.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(getCategoryBadgeClass(drug.category))}
                      >
                        {drug.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => onEditDrug(drug)}
                          size="icon"
                          variant="ghost"
                          aria-label={`Edit ${drug.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => onDeleteDrug(drug)}
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          aria-label={`Delete ${drug.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No drugs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
