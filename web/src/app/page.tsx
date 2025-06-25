"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "lucide-react";
import { Drug, initialDrugs } from "@/types/drug";
import { StatsCards } from "@/components/StatsCards";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { InventoryTable } from "@/components/InventoryTable";
import { AddDrugDrawer } from "@/components/AddDrugDrawer";
import { EditDrugDrawer } from "@/components/EditDrugDrawer";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";

export default function PharmacyInventory() {
  const [drugs, setDrugs] = useState<Drug[]>(initialDrugs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null);
  const [deletingDrug, setDeletingDrug] = useState<Drug | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [formData, setFormData] = useState<Partial<Drug>>({});

  const filteredDrugs = drugs.filter((drug) => {
    const matchesSearch =
      drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || drug.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = () => {
    if (
      formData.name &&
      formData.genericName &&
      formData.dosage &&
      formData.quantity &&
      formData.expirationDate &&
      formData.manufacturer &&
      formData.price &&
      formData.category
    ) {
      const newDrug: Drug = {
        id: Date.now().toString(),
        name: formData.name,
        genericName: formData.genericName,
        dosage: formData.dosage,
        quantity: formData.quantity,
        expirationDate: formData.expirationDate,
        manufacturer: formData.manufacturer,
        price: formData.price,
        category: formData.category,
        description: formData.description || "",
      };
      setDrugs([...drugs, newDrug]);
      setFormData({});
      setIsAddDrawerOpen(false);
    }
  };

  const handleEdit = () => {
    if (
      editingDrug &&
      formData.name &&
      formData.genericName &&
      formData.dosage &&
      formData.quantity &&
      formData.expirationDate &&
      formData.manufacturer &&
      formData.price &&
      formData.category
    ) {
      const updatedDrugs = drugs.map((drug) =>
        drug.id === editingDrug.id ? ({ ...drug, ...formData } as Drug) : drug
      );
      setDrugs(updatedDrugs);
      setEditingDrug(null);
      setFormData({});
      setIsEditDrawerOpen(false);
    }
  };

  const handleDelete = () => {
    if (deletingDrug && confirmText === "Confirm") {
      setDrugs(drugs.filter((drug) => drug.id !== deletingDrug.id));
      setDeletingDrug(null);
      setConfirmText("");
      setIsDeleteModalOpen(false);
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

  return (
    <div className="min-h-screen bg-yellow-300 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <CardHeader className="bg-red-400 border-b-4 border-black">
            <CardTitle className="text-4xl font-black text-black flex items-center gap-3">
              <Pill className="w-10 h-10" />
              Pharmatrack
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

        {/* Stats Cards */}
        <StatsCards drugs={drugs} />

        {/* Inventory Table */}
        <InventoryTable
          drugs={filteredDrugs}
          onEditDrug={openEditDrawer}
          onDeleteDrug={openDeleteModal}
        />

        {/* Add Drug Drawer */}
        <AddDrugDrawer
          isOpen={isAddDrawerOpen}
          onOpenChange={setIsAddDrawerOpen}
          formData={formData}
          setFormData={setFormData}
          onAdd={handleAdd}
        />

        {/* Edit Drug Drawer */}
        <EditDrugDrawer
          isOpen={isEditDrawerOpen}
          onOpenChange={setIsEditDrawerOpen}
          formData={formData}
          setFormData={setFormData}
          onEdit={handleEdit}
        />

        {/* Delete Confirmation Modal */}
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
