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
      <div className="min-h-screen bg-yellow-300 p-6 flex items-center justify-center">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-black text-red-600 mb-4">
              Error Loading Data
            </h2>
            <p className="text-black">
              {error instanceof Error
                ? error.message
                : "Failed to connect to the server"}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Make sure the API server is running on port 8000
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-300 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <CardHeader className="bg-red-400 border-b-4 border-black">
            <CardTitle className="text-4xl font-black text-black flex items-center gap-3">
              <Pill className="w-10 h-10" />
              Pharmatrack{" "}
              {isLoading && <span className="text-sm">Loading...</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <SearchAndFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onAddDrug={handleAddDrugClick}
            />
          </CardContent>
        </Card>

        <StatsCards drugs={drugs} />

        <InventoryTable
          drugs={drugs}
          onEditDrug={openEditDrawer}
          onDeleteDrug={openDeleteModal}
        />

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
    </div>
  );
}
