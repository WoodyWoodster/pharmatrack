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
}

export function AddDrugDrawer({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onAdd,
}: AddDrugDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="border-4 border-black bg-white">
        <DrawerHeader className="bg-green-400 border-b-4 border-black">
          <DrawerTitle className="text-2xl font-black text-black">
            ADD NEW DRUG
          </DrawerTitle>
        </DrawerHeader>
        <DrugForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={onAdd}
          submitText="ADD DRUG TO INVENTORY"
          submitButtonClass="bg-green-400 hover:bg-green-500 text-black"
        />
      </DrawerContent>
    </Drawer>
  );
}
