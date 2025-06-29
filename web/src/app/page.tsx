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
import {
  useDrugs,
  useCreateDrug,
  useUpdateDrug,
  useDeleteDrug,
} from "@/hooks/useDrugs";
import { Drug } from "@/types/drug";
import { toast } from "sonner";

export default function PharmacyInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null);
  const [deletingDrug, setDeletingDrug] = useState<Drug | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [formData, setFormData] = useState<Partial<Drug>>({});

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

  const handleAdd = async () => {
    if (
      formData.sku &&
      formData.name &&
      formData.generic_name &&
      formData.dosage &&
      formData.quantity &&
      formData.expiration_date &&
      formData.manufacturer &&
      formData.price &&
      formData.category
    ) {
      try {
        await createDrugMutation.mutateAsync({
          sku: formData.sku,
          name: formData.name,
          generic_name: formData.generic_name,
          dosage: formData.dosage,
          quantity: formData.quantity,
          expiration_date: formData.expiration_date,
          manufacturer: formData.manufacturer,
          price: formData.price,
          category: formData.category,
          description: formData.description,
        });

        setFormData({});
        setIsAddDrawerOpen(false);
        toast.success("Drug added successfully!");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to add drug"
        );
      }
    }
  };

  const handleEdit = async () => {
    if (editingDrug && formData.name) {
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
  };

  const handleAddDrugClick = () => {
    resetForm();
    setIsAddDrawerOpen(true);
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
        setFormData={setFormData}
        onAdd={handleAdd}
      />
      <EditDrugDrawer
        isOpen={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        formData={formData}
        setFormData={setFormData}
        onEdit={handleEdit}
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
    </div>
  );
}
