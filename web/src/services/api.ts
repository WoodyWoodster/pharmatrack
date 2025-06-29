import axios from "axios";
import { Drug } from "@/types/drug";
import { CreateDrugRequest, UpdateDrugRequest } from "@/types/api";
import { ValidationErrorResponse } from "@/types/validation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const drugApi = {
  getAllDrugs: async (
    searchQuery?: string,
    category?: string
  ): Promise<Drug[]> => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (category && category !== "All") params.append("category", category);

    const response = await api.get(`/drugs?${params.toString()}`);
    return response.data;
  },

  getDrugById: async (id: number): Promise<Drug> => {
    const response = await api.get(`/drugs/${id}`);
    return response.data;
  },

  createDrug: async (drugData: CreateDrugRequest): Promise<Drug> => {
    const response = await api.post("/drugs", drugData);
    return response.data;
  },

  updateDrug: async (
    id: number,
    drugData: UpdateDrugRequest
  ): Promise<Drug> => {
    const response = await api.put(`/drugs/${id}`, drugData);
    return response.data;
  },

  deleteDrug: async (id: number): Promise<void> => {
    await api.delete(`/drugs/${id}`);
  },

  batchCreateDrugs: async (drugsData: CreateDrugRequest[]): Promise<Drug[]> => {
    const response = await api.post("/drugs/batch", drugsData);
    return response.data;
  },

  getLowStockDrugs: async (threshold = 100): Promise<Drug[]> => {
    const response = await api.get(`/drugs/low-stock?threshold=${threshold}`);
    return response.data;
  },

  getExpiringSoonDrugs: async (days = 90): Promise<Drug[]> => {
    const response = await api.get(`/drugs/expiring-soon?days=${days}`);
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get("/drugs/categories");
    return response.data;
  },
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 422 && error.response?.data?.detail) {
      const validationErrors = error.response.data.detail;
      if (Array.isArray(validationErrors)) {
        const customError = new Error(
          `Validation failed: ${validationErrors.join(", ")}`
        ) as ValidationErrorResponse;
        customError.validationErrors = validationErrors.map((msg: string) => ({
          loc: [],
          msg,
          type: "value_error",
        }));
        customError.isValidationError = true;
        throw customError;
      }
    }

    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw error;
  }
);
