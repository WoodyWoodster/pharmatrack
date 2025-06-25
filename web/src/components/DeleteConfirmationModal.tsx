import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Drug } from "@/types/drug";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  drug: Drug | null;
  confirmText: string;
  setConfirmText: (text: string) => void;
  onDelete: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  onOpenChange,
  drug,
  confirmText,
  setConfirmText,
  onDelete,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
        <DialogHeader className="bg-red-400 -m-6 mb-6 p-6 border-b-4 border-black">
          <DialogTitle className="text-2xl font-black text-black">
            ⚠️ DANGER ZONE ⚠️
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-red-100 border-4 border-red-400 p-4">
            <p className="font-bold text-black">
              You are about to permanently delete:
            </p>
            <p className="text-xl font-black text-red-600">
              {drug?.name} ({drug?.dosage})
            </p>
            <p className="font-bold text-black mt-2">
              This action cannot be undone!
            </p>
          </div>
          <div>
            <Label className="text-black font-bold">
              Type &quot;Confirm&quot; to enable deletion:
            </Label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type 'Confirm' here..."
              className="border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold mt-2"
            />
          </div>
          <div className="flex gap-4">
            <Button
              onClick={onCancel}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black"
            >
              CANCEL
            </Button>
            <Button
              onClick={onDelete}
              disabled={confirmText !== "Confirm"}
              className={`flex-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black ${
                confirmText === "Confirm"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              DELETE FOREVER
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
