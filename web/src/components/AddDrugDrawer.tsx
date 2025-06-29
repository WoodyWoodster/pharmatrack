import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { DrugForm } from "./DrugForm";
import { Drug } from "@/types/drug";

interface AddDrugDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<Drug>;
  setFormData: (data: Partial<Drug>) => void;
  onAdd: () => void;
  validationErrors?: string[];
}

export function AddDrugDrawer({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onAdd,
  validationErrors,
}: AddDrugDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add New Drug</DrawerTitle>
        </DrawerHeader>
        <DrugForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={onAdd}
          submitText="Add Drug"
          validationErrors={validationErrors}
        />
      </DrawerContent>
    </Drawer>
  );
}
