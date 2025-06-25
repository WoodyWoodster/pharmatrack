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
}

export function EditDrugDrawer({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onEdit,
}: EditDrugDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="border-4 border-black bg-white">
        <DrawerHeader className="bg-yellow-400 border-b-4 border-black">
          <DrawerTitle className="text-2xl font-black text-black">
            EDIT DRUG
          </DrawerTitle>
        </DrawerHeader>
        <DrugForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={onEdit}
          submitText="UPDATE DRUG"
          submitButtonClass="bg-yellow-400 hover:bg-yellow-500 text-black"
        />
      </DrawerContent>
    </Drawer>
  );
}
