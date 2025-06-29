import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, createMockDrug } from "@/test/utils";
import { InventoryTable } from "../InventoryTable";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("InventoryTable", () => {
  const mockOnEditDrug = vi.fn();
  const mockOnDeleteDrug = vi.fn();

  const defaultProps = {
    drugs: [],
    onEditDrug: mockOnEditDrug,
    onDeleteDrug: mockOnDeleteDrug,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table headers", () => {
    renderWithProviders(<InventoryTable {...defaultProps} />);

    expect(screen.getByText("DRUG NAME")).toBeInTheDocument();
    expect(screen.getByText("SKU")).toBeInTheDocument();
    expect(screen.getByText("GENERIC")).toBeInTheDocument();
    expect(screen.getByText("DOSAGE")).toBeInTheDocument();
    expect(screen.getByText("STOCK")).toBeInTheDocument();
    expect(screen.getByText("EXPIRES")).toBeInTheDocument();
    expect(screen.getByText("MANUFACTURER")).toBeInTheDocument();
    expect(screen.getByText("PRICE")).toBeInTheDocument();
    expect(screen.getByText("CATEGORY")).toBeInTheDocument();
    expect(screen.getByText("ACTIONS")).toBeInTheDocument();
  });

  it("displays inventory count in header", () => {
    const mockDrugs = [createMockDrug(), createMockDrug({ id: 2 })];

    renderWithProviders(<InventoryTable {...defaultProps} drugs={mockDrugs} />);

    expect(screen.getByText("INVENTORY (2 items)")).toBeInTheDocument();
  });

  it("renders drug data correctly", () => {
    const mockDrugs = [
      createMockDrug({
        sku: "TEST-001",
        name: "Test Medicine",
        generic_name: "test_medicine",
        dosage: "10mg",
        quantity: 100,
        manufacturer: "Test Pharma",
        price: 29.99,
        category: "Antibiotic",
      }),
    ];

    renderWithProviders(<InventoryTable {...defaultProps} drugs={mockDrugs} />);

    expect(screen.getByText("TEST-001")).toBeInTheDocument();
    expect(screen.getByText("Test Medicine")).toBeInTheDocument();
    expect(screen.getByText("test_medicine")).toBeInTheDocument();
    expect(screen.getByText("10mg")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Test Pharma")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("Antibiotic")).toBeInTheDocument();
  });

  it("displays empty state correctly", () => {
    renderWithProviders(<InventoryTable {...defaultProps} />);

    expect(screen.getByText("INVENTORY (0 items)")).toBeInTheDocument();
    expect(screen.getByText("DRUG NAME")).toBeInTheDocument();

    const tableBody = screen.getByRole("table").querySelector("tbody");
    expect(tableBody).toBeInTheDocument();
    expect(tableBody?.children).toHaveLength(0);
  });

  it("calls onEditDrug when edit button is clicked", async () => {
    const user = userEvent.setup();
    const mockDrugs = [createMockDrug()];

    const { container } = renderWithProviders(
      <InventoryTable {...defaultProps} drugs={mockDrugs} />
    );

    const editButton = container.querySelector(".bg-yellow-400");
    expect(editButton).toBeInTheDocument();

    await user.click(editButton!);
    expect(mockOnEditDrug).toHaveBeenCalledTimes(1);
    expect(mockOnEditDrug).toHaveBeenCalledWith(mockDrugs[0]);
  });

  it("calls onDeleteDrug when delete button is clicked", async () => {
    const user = userEvent.setup();
    const mockDrugs = [createMockDrug()];

    const { container } = renderWithProviders(
      <InventoryTable {...defaultProps} drugs={mockDrugs} />
    );

    const deleteButton = container.querySelector(".bg-red-400");
    expect(deleteButton).toBeInTheDocument();

    await user.click(deleteButton!);
    expect(mockOnDeleteDrug).toHaveBeenCalledTimes(1);
    expect(mockOnDeleteDrug).toHaveBeenCalledWith(mockDrugs[0]);
  });

  it("displays low stock quantity with red text", () => {
    const mockDrugs = [createMockDrug({ quantity: 50 })];

    const { container } = renderWithProviders(
      <InventoryTable {...defaultProps} drugs={mockDrugs} />
    );

    expect(screen.getByText("50")).toBeInTheDocument();
    const quantityCell = container.querySelector(".text-red-600");
    expect(quantityCell).toBeInTheDocument();
  });

  it("displays normal stock quantity with green text", () => {
    const mockDrugs = [createMockDrug({ quantity: 150 })];

    const { container } = renderWithProviders(
      <InventoryTable {...defaultProps} drugs={mockDrugs} />
    );

    expect(screen.getByText("150")).toBeInTheDocument();
    const quantityCell = container.querySelector(".text-green-600");
    expect(quantityCell).toBeInTheDocument();
  });

  it("handles multiple drugs correctly", () => {
    const mockDrugs = [
      createMockDrug({ id: 1, name: "Medicine A" }),
      createMockDrug({ id: 2, name: "Medicine B" }),
      createMockDrug({ id: 3, name: "Medicine C" }),
    ];

    const { container } = renderWithProviders(
      <InventoryTable {...defaultProps} drugs={mockDrugs} />
    );

    expect(screen.getByText("Medicine A")).toBeInTheDocument();
    expect(screen.getByText("Medicine B")).toBeInTheDocument();
    expect(screen.getByText("Medicine C")).toBeInTheDocument();

    const editButtons = container.querySelectorAll(".bg-yellow-400");
    const deleteButtons = container.querySelectorAll(".bg-red-400");

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it("displays expiration date correctly", () => {
    const mockDrugs = [createMockDrug({ expiration_date: "2025-12-31" })];

    renderWithProviders(<InventoryTable {...defaultProps} drugs={mockDrugs} />);

    expect(screen.getByText("2025-12-31")).toBeInTheDocument();
  });

  it("handles empty SKU gracefully", () => {
    const mockDrugs = [createMockDrug({ sku: "" })];

    renderWithProviders(<InventoryTable {...defaultProps} drugs={mockDrugs} />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
