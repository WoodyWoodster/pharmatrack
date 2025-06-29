"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "lucide-react";
import { StatsCards } from "@/components/StatsCards";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { InventoryTable } from "@/components/InventoryTable";
import { AddDrugDrawer } from "@/components/AddDrugDrawer";
import { EditDrugDrawer } from "@/components/EditDrugDrawer";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { BatchImportDrawer } from "@/components/BatchImportDrawer";
import {
  useDrugs,
  useCreateDrug,
  useUpdateDrug,
  useDeleteDrug,
} from "@/hooks/useDrugs";
import { Drug } from "@/types/drug";
import { toast } from "sonner";
import { extractValidationErrors } from "@/lib/utils";

export default function PharmacyInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBatchImportOpen, setIsBatchImportOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null);
  const [deletingDrug, setDeletingDrug] = useState<Drug | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [formData, setFormData] = useState<Partial<Drug>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const {
    data: drugs = [],
    isLoading,
    error,
  } = useDrugs(
    searchTerm || undefined,
    selectedCategory !== "All" ? selectedCategory : undefined
  );

  const createDrugMutation = useCreateDrug();
  const updateDrugMutation = useUpdateDrug();
  const deleteDrugMutation = useDeleteDrug();

  const handleFormDataChange = (data: Partial<Drug>) => {
    setFormData(data);
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleAdd = async () => {
    setValidationErrors([]);

    try {
      await createDrugMutation.mutateAsync({
        sku: formData.sku || "",
        name: formData.name || "",
        generic_name: formData.generic_name || "",
        dosage: formData.dosage || "",
        quantity: formData.quantity || 0,
        expiration_date: formData.expiration_date || "",
        manufacturer: formData.manufacturer || "",
        price: formData.price || 0,
        category: formData.category || "",
        description: formData.description,
      });

      setFormData({});
      setIsAddDrawerOpen(false);
      toast.success("Drug added successfully!");
    } catch (error) {
      const backendErrors = extractValidationErrors(error);
      if (backendErrors.length > 0) {
        setValidationErrors(backendErrors);
        toast.error("Please fix the validation errors");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to add drug"
        );
      }
    }
  };

  const handleEdit = async () => {
    if (!editingDrug) return;

    setValidationErrors([]);

    try {
      await updateDrugMutation.mutateAsync({
        id: editingDrug.id,
        drugData: formData,
      });

      setEditingDrug(null);
      setFormData({});
      setIsEditDrawerOpen(false);
      toast.success("Drug updated successfully!");
    } catch (error) {
      const backendErrors = extractValidationErrors(error);
      if (backendErrors.length > 0) {
        setValidationErrors(backendErrors);
        toast.error("Please fix the validation errors");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to update drug"
        );
      }
    }
  };

  const handleDelete = async () => {
    if (deletingDrug && confirmText === "Confirm") {
      try {
        await deleteDrugMutation.mutateAsync(deletingDrug.id);

        setDeletingDrug(null);
        setConfirmText("");
        setIsDeleteModalOpen(false);
        toast.success("Drug deleted successfully!");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete drug"
        );
      }
    }
  };

  const openEditDrawer = (drug: Drug) => {
    setEditingDrug(drug);
    setFormData(drug);
    setIsEditDrawerOpen(true);
  };

  const openDeleteModal = (drug: Drug) => {
    setDeletingDrug(drug);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({});
    setEditingDrug(null);
    setValidationErrors([]);
  };

  const handleAddDrugClick = () => {
    resetForm();
    setIsAddDrawerOpen(true);
  };

  const handleBatchImportClick = () => {
    setIsBatchImportOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setConfirmText("");
    setDeletingDrug(null);
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p>
              {error instanceof Error
                ? error.message
                : "Failed to connect to the server"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Make sure the API server is running on port 8000
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-muted/40">
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Pill className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            PharmaTrack{" "}
            {isLoading && (
              <span className="text-sm font-normal text-muted-foreground">
                Loading...
              </span>
            )}
          </h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <div className="grid gap-4">
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onAddDrug={handleAddDrugClick}
            onBatchImport={handleBatchImportClick}
          />
          <StatsCards drugs={drugs} />
          <InventoryTable
            drugs={drugs}
            onEditDrug={openEditDrawer}
            onDeleteDrug={openDeleteModal}
          />
        </div>
      </main>
      <AddDrugDrawer
        isOpen={isAddDrawerOpen}
        onOpenChange={setIsAddDrawerOpen}
        formData={formData}
        setFormData={handleFormDataChange}
        onAdd={handleAdd}
        validationErrors={validationErrors}
      />
      <EditDrugDrawer
        isOpen={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        formData={formData}
        setFormData={handleFormDataChange}
        onEdit={handleEdit}
        validationErrors={validationErrors}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        drug={deletingDrug}
        confirmText={confirmText}
        setConfirmText={setConfirmText}
        onDelete={handleDelete}
        onCancel={handleDeleteCancel}
      />
      <BatchImportDrawer
        isOpen={isBatchImportOpen}
        onOpenChange={setIsBatchImportOpen}
      />
    </div>
  );
}
