import { describe, it, expect } from "vitest";
import { renderWithProviders, createMockDrug } from "@/test/utils";
import { StatsCards } from "../StatsCards";
import { Drug } from "@/types/drug";

describe("StatsCards", () => {
  it("displays correct statistics for drugs", () => {
    const mockDrugs: Drug[] = [
      createMockDrug({ quantity: 100 }),
      createMockDrug({ id: 2, quantity: 50 }),
      createMockDrug({ id: 3, quantity: 200 }),
    ];

    const { getByText } = renderWithProviders(<StatsCards drugs={mockDrugs} />);

    expect(getByText("3")).toBeInTheDocument();
    expect(getByText("Total Drugs")).toBeInTheDocument();

    expect(getByText("350")).toBeInTheDocument();
    expect(getByText("Total Stock")).toBeInTheDocument();

    expect(getByText("1")).toBeInTheDocument();
    expect(getByText("Low Stock")).toBeInTheDocument();
  });

  it("handles empty drugs array", () => {
    const { getAllByText, getByText } = renderWithProviders(
      <StatsCards drugs={[]} />
    );

    const zeros = getAllByText("0");
    expect(zeros).toHaveLength(4);

    expect(getByText("Total Drugs")).toBeInTheDocument();
    expect(getByText("Total Stock")).toBeInTheDocument();
  });

  it("calculates low stock correctly", () => {
    const mockDrugs: Drug[] = [
      createMockDrug({ quantity: 50 }),
      createMockDrug({ id: 2, quantity: 25 }),
      createMockDrug({ id: 3, quantity: 100 }),
      createMockDrug({ id: 4, quantity: 150 }),
    ];

    const { getByText } = renderWithProviders(<StatsCards drugs={mockDrugs} />);

    expect(getByText("2")).toBeInTheDocument();
    expect(getByText("Low Stock")).toBeInTheDocument();
  });

  it("calculates expiring soon correctly", () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const farFutureDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    const mockDrugs: Drug[] = [
      createMockDrug({
        expiration_date: futureDate.toISOString().split("T")[0],
      }),
      createMockDrug({
        id: 2,
        expiration_date: farFutureDate.toISOString().split("T")[0],
      }),
    ];

    const { container, getByText } = renderWithProviders(
      <StatsCards drugs={mockDrugs} />
    );

    const expiringSoonCard = container.querySelector(".bg-destructive\\/10");
    expect(expiringSoonCard).toBeTruthy();
    expect(getByText("1")).toBeInTheDocument();
    expect(getByText("Expiring Soon")).toBeInTheDocument();
  });
});
