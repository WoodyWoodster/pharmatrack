import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Drug } from "@/types/drug";
import { AlertTriangle } from "lucide-react";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the drug{" "}
            <strong>
              {drug?.name} ({drug?.dosage})
            </strong>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="confirm-text">
            Type &quot;Confirm&quot; to enable deletion:
          </Label>
          <Input
            id="confirm-text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type 'Confirm' here..."
          />
        </div>
        <DialogFooter className="gap-2">
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            disabled={confirmText !== "Confirm"}
            variant="destructive"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
