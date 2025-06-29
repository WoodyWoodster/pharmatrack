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
  const getCategoryColor = (category: string) => {
    const colors = {
      Antibiotic: "bg-red-400 text-black border-2 border-black",
      "ACE Inhibitor": "bg-blue-400 text-black border-2 border-black",
      Antidiabetic: "bg-green-400 text-black border-2 border-black",
      NSAID: "bg-yellow-400 text-black border-2 border-black",
      Analgesic: "bg-purple-400 text-black border-2 border-black",
      Antihypertensive: "bg-pink-400 text-black border-2 border-black",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-400 text-black border-2 border-black"
    );
  };

  return (
    <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
      <CardHeader className="bg-blue-400 border-b-4 border-black">
        <CardTitle className="text-2xl font-black text-black">
          INVENTORY ({drugs.length} items)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-4 border-black bg-gray-200">
                <TableHead className="font-black text-black border-r-2 border-black">
                  DRUG NAME
                </TableHead>
                <TableHead className="font-black text-black border-r-2 border-black">
                  SKU
                </TableHead>
                <TableHead className="font-black text-black border-r-2 border-black">
                  GENERIC
                </TableHead>
                <TableHead className="font-black text-black border-r-2 border-black">
                  DOSAGE
                </TableHead>
                <TableHead className="font-black text-black border-r-2 border-black">
                  STOCK
                </TableHead>
                <TableHead className="font-black text-black border-r-2 border-black">
                  EXPIRES
                </TableHead>
                <TableHead className="font-black text-black border-r-2 border-black">
                  MANUFACTURER
                </TableHead>
                <TableHead className="font-black text-black border-r-2 border-black">
                  PRICE
                </TableHead>
                <TableHead className="font-black text-black border-r-2 border-black">
                  CATEGORY
                </TableHead>
                <TableHead className="font-black text-black">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drugs.map((drug) => (
                <TableRow
                  key={drug.id}
                  className="border-b-2 border-black hover:bg-yellow-100"
                >
                  <TableCell className="font-bold border-r-2 border-black">
                    {drug.name}
                  </TableCell>
                  <TableCell className="border-r-2 border-black text-gray-600">
                    {drug.sku || "—"}
                  </TableCell>
                  <TableCell className="border-r-2 border-black">
                    {drug.generic_name}
                  </TableCell>
                  <TableCell className="border-r-2 border-black">
                    {drug.dosage}
                  </TableCell>
                  <TableCell
                    className={`border-r-2 border-black font-bold ${
                      drug.quantity < 100 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {drug.quantity}
                  </TableCell>
                  <TableCell className="border-r-2 border-black">
                    {drug.expiration_date}
                  </TableCell>
                  <TableCell className="border-r-2 border-black">
                    {drug.manufacturer}
                  </TableCell>
                  <TableCell className="border-r-2 border-black font-bold">
                    ${drug.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="border-r-2 border-black">
                    <Badge className={getCategoryColor(drug.category)}>
                      {drug.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onEditDrug(drug)}
                        size="sm"
                        className="bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => onDeleteDrug(drug)}
                        size="sm"
                        className="bg-red-400 hover:bg-red-500 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
