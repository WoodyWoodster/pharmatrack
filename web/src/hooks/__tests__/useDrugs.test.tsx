import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useDrugs,
  useCreateDrug,
  useUpdateDrug,
  useDeleteDrug,
} from "../useDrugs";
import { drugApi } from "@/services/api";
import { createMockDrug } from "@/test/utils";
import type { CreateDrugRequest, UpdateDrugRequest } from "@/types/api";

vi.mock("@/services/api");

const mockDrugApi = vi.mocked(drugApi);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = "TestQueryWrapper";

  return Wrapper;
};

describe("useDrugs hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useDrugs", () => {
    it("fetches drugs successfully", async () => {
      const mockDrugs = [createMockDrug(), createMockDrug({ id: 2 })];
      mockDrugApi.getAllDrugs.mockResolvedValue(mockDrugs);

      const { result } = renderHook(() => useDrugs(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockDrugs);
      expect(mockDrugApi.getAllDrugs).toHaveBeenCalledWith(
        undefined,
        undefined
      );
    });

    it("passes search parameters to API", async () => {
      const mockDrugs = [createMockDrug()];
      mockDrugApi.getAllDrugs.mockResolvedValue(mockDrugs);

      const { result } = renderHook(() => useDrugs("aspirin", "Pain Relief"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockDrugApi.getAllDrugs).toHaveBeenCalledWith(
        "aspirin",
        "Pain Relief"
      );
    });

    it("handles fetch errors", async () => {
      const mockError = new Error("Network error");
      mockDrugApi.getAllDrugs.mockRejectedValue(mockError);

      const { result } = renderHook(() => useDrugs(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe("useCreateDrug", () => {
    it("creates drug successfully", async () => {
      const newDrug = createMockDrug();
      const drugData: CreateDrugRequest = {
        name: "New Drug",
        sku: "NEW-001",
        generic_name: "new_drug",
        dosage: "10mg",
        quantity: 100,
        expiration_date: "2025-12-31",
        manufacturer: "Test Pharma",
        price: 29.99,
        category: "Pain Relief",
      };
      mockDrugApi.createDrug.mockResolvedValue(newDrug);

      const { result } = renderHook(() => useCreateDrug(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(drugData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(newDrug);
      expect(mockDrugApi.createDrug).toHaveBeenCalledWith(drugData);
    });

    it("handles creation errors", async () => {
      const mockError = new Error("Validation failed");
      const drugData: CreateDrugRequest = {
        name: "New Drug",
        sku: "NEW-001",
        generic_name: "new_drug",
        dosage: "10mg",
        quantity: 100,
        expiration_date: "2025-12-31",
        manufacturer: "Test Pharma",
        price: 29.99,
        category: "Pain Relief",
      };
      mockDrugApi.createDrug.mockRejectedValue(mockError);

      const { result } = renderHook(() => useCreateDrug(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(drugData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe("useUpdateDrug", () => {
    it("updates drug successfully", async () => {
      const updatedDrug = createMockDrug({ name: "Updated Drug" });
      const updateData: UpdateDrugRequest = { name: "Updated Drug" };
      mockDrugApi.updateDrug.mockResolvedValue(updatedDrug);

      const { result } = renderHook(() => useUpdateDrug(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: 1, drugData: updateData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(updatedDrug);
      expect(mockDrugApi.updateDrug).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe("useDeleteDrug", () => {
    it("deletes drug successfully", async () => {
      mockDrugApi.deleteDrug.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteDrug(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockDrugApi.deleteDrug).toHaveBeenCalledWith(1);
    });

    it("handles deletion errors", async () => {
      const mockError = new Error("Drug not found");
      mockDrugApi.deleteDrug.mockRejectedValue(mockError);

      const { result } = renderHook(() => useDeleteDrug(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
    });
  });
});
