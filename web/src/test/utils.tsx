import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
};

export const createMockDrug = (overrides = {}) => ({
  id: 1,
  sku: "TEST-001",
  name: "Test Medicine",
  generic_name: "test_medicine",
  dosage: "10mg",
  quantity: 100,
  expiration_date: "2025-12-31",
  manufacturer: "Test Pharma",
  price: 29.99,
  category: "Pain Relief",
  ...overrides,
});

export const createMockDrugs = (count: number = 3) =>
  Array.from({ length: count }, (_, index) =>
    createMockDrug({
      id: index + 1,
      sku: `TEST-${String(index + 1).padStart(3, "0")}`,
      name: `Test Medicine ${index + 1}`,
    })
  );

export const mockApiResponse = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

export * from "@testing-library/react";
export { vi } from "vitest";
