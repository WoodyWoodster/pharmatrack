import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drug } from "@/types/drug";
import { Package, Pill, AlertTriangle, CalendarOff } from "lucide-react";

interface StatsCardsProps {
  drugs: Drug[];
}

export function StatsCards({ drugs }: StatsCardsProps) {
  const totalStock = drugs.reduce((sum, drug) => sum + drug.quantity, 0);
  const lowStockCount = drugs.filter((drug) => drug.quantity < 100).length;
  const expiringSoonCount = drugs.filter(
    (drug) =>
      new Date(drug.expiration_date) <
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Drugs</CardTitle>
          <Pill className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{drugs.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStock}</div>
        </CardContent>
      </Card>
      <Card className="border-yellow-500/50 bg-yellow-500/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockCount}</div>
        </CardContent>
      </Card>
      <Card className="border-destructive/50 bg-destructive/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <CalendarOff className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{expiringSoonCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}
