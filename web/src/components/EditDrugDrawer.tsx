import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { DrugForm } from "./DrugForm";
import { Drug } from "@/types/drug";

interface EditDrugDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<Drug>;
  setFormData: (data: Partial<Drug>) => void;
  onEdit: () => void;
  validationErrors?: string[];
}

export function EditDrugDrawer({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onEdit,
  validationErrors,
}: EditDrugDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Drug</DrawerTitle>
        </DrawerHeader>
        <DrugForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={onEdit}
          submitText="Update Drug"
          validationErrors={validationErrors}
        />
      </DrawerContent>
    </Drawer>
  );
}
