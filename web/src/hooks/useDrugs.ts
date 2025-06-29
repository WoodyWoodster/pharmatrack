import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { drugApi } from "@/services/api";
import { CreateDrugRequest, UpdateDrugRequest } from "@/types/api";
import { toast } from "sonner";

interface DrugCreate {
  sku: string;
  name: string;
  generic_name: string;
  dosage: string;
  quantity: number;
  expiration_date: string;
  manufacturer: string;
  price: number;
  category: string;
}

export const drugQueryKeys = {
  all: ["drugs"] as const,
  lists: () => [...drugQueryKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...drugQueryKeys.lists(), filters] as const,
  details: () => [...drugQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...drugQueryKeys.details(), id] as const,
  lowStock: () => [...drugQueryKeys.all, "lowStock"] as const,
  expiringSoon: () => [...drugQueryKeys.all, "expiringSoon"] as const,
  categories: () => [...drugQueryKeys.all, "categories"] as const,
};

export function useDrugs(searchQuery?: string, category?: string) {
  return useQuery({
    queryKey: drugQueryKeys.list({ search: searchQuery, category }),
    queryFn: () => drugApi.getAllDrugs(searchQuery, category),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDrug(id: number) {
  return useQuery({
    queryKey: drugQueryKeys.detail(id),
    queryFn: () => drugApi.getDrugById(id),
    enabled: !!id,
  });
}

export function useLowStockDrugs(threshold = 100) {
  return useQuery({
    queryKey: drugQueryKeys.lowStock(),
    queryFn: () => drugApi.getLowStockDrugs(threshold),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useExpiringSoonDrugs(days = 90) {
  return useQuery({
    queryKey: drugQueryKeys.expiringSoon(),
    queryFn: () => drugApi.getExpiringSoonDrugs(days),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCategories() {
  return useQuery({
    queryKey: drugQueryKeys.categories(),
    queryFn: drugApi.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateDrug() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (drugData: CreateDrugRequest) => drugApi.createDrug(drugData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: drugQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: drugQueryKeys.lowStock() });
      queryClient.invalidateQueries({ queryKey: drugQueryKeys.expiringSoon() });
      queryClient.invalidateQueries({ queryKey: drugQueryKeys.categories() });
    },
  });
}

export function useUpdateDrug() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      drugData,
    }: {
      id: number;
      drugData: UpdateDrugRequest;
    }) => drugApi.updateDrug(id, drugData),
    onSuccess: (updatedDrug) => {
      queryClient.setQueryData(
        drugQueryKeys.detail(updatedDrug.id),
        updatedDrug
      );

      queryClient.invalidateQueries({ queryKey: drugQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: drugQueryKeys.lowStock() });
      queryClient.invalidateQueries({ queryKey: drugQueryKeys.expiringSoon() });
    },
  });
}

export function useDeleteDrug() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: drugApi.deleteDrug,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: drugQueryKeys.detail(deletedId) });

      queryClient.invalidateQueries({ queryKey: drugQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: drugQueryKeys.lowStock() });
      queryClient.invalidateQueries({ queryKey: drugQueryKeys.expiringSoon() });
    },
  });
}

export function useBatchCreateDrugs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (drugs: DrugCreate[]) => {
      const drugRequests = drugs.map((drug) => ({
        sku: drug.sku,
        name: drug.name,
        generic_name: drug.generic_name,
        dosage: drug.dosage,
        quantity: drug.quantity,
        expiration_date: drug.expiration_date,
        manufacturer: drug.manufacturer,
        price: drug.price,
        category: drug.category,
      }));

      return drugApi.batchCreateDrugs(drugRequests);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["drugs"] });
      toast.success(`Successfully imported ${data.length} drugs`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to import drugs: ${error.message}`);
    },
  });
}
