import { Card, CardContent } from "@/components/ui/card";
import { Drug } from "@/types/drug";

interface StatsCardsProps {
  drugs: Drug[];
}

export function StatsCards({ drugs }: StatsCardsProps) {
  const totalStock = drugs.reduce((sum, drug) => sum + drug.quantity, 0);
  const lowStockCount = drugs.filter((drug) => drug.quantity < 100).length;
  const expiringSoonCount = drugs.filter(
    (drug) =>
      new Date(drug.expirationDate) <
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-blue-400">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-black text-black">{drugs.length}</div>
          <div className="text-lg font-bold text-black">TOTAL DRUGS</div>
        </CardContent>
      </Card>
      <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-green-400">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-black text-black">{totalStock}</div>
          <div className="text-lg font-bold text-black">TOTAL STOCK</div>
        </CardContent>
      </Card>
      <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-purple-400">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-black text-black">{lowStockCount}</div>
          <div className="text-lg font-bold text-black">LOW STOCK</div>
        </CardContent>
      </Card>
      <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-red-400">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-black text-black">
            {expiringSoonCount}
          </div>
          <div className="text-lg font-bold text-black">EXPIRING SOON</div>
        </CardContent>
      </Card>
    </div>
  );
}
