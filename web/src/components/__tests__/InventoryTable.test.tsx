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

    expect(screen.getByText("Drug Name")).toBeInTheDocument();
    expect(screen.getByText("SKU")).toBeInTheDocument();
    expect(screen.getByText("Generic")).toBeInTheDocument();
    expect(screen.getByText("Dosage")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getByText("Expires")).toBeInTheDocument();
    expect(screen.getByText("Manufacturer")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("displays inventory count in header", () => {
    const mockDrugs = [createMockDrug(), createMockDrug({ id: 2 })];

    renderWithProviders(<InventoryTable {...defaultProps} drugs={mockDrugs} />);

    expect(screen.getByText("Inventory (2 items)")).toBeInTheDocument();
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

    expect(screen.getByText("Inventory (0 items)")).toBeInTheDocument();
    expect(screen.getByText("Drug Name")).toBeInTheDocument();
    expect(screen.getByText("No drugs found.")).toBeInTheDocument();
  });

  it("calls onEditDrug when edit button is clicked", async () => {
    const user = userEvent.setup();
    const mockDrugs = [createMockDrug()];

    renderWithProviders(<InventoryTable {...defaultProps} drugs={mockDrugs} />);

    const editButton = screen.getByLabelText(`Edit ${mockDrugs[0].name}`);
    expect(editButton).toBeInTheDocument();

    await user.click(editButton);
    expect(mockOnEditDrug).toHaveBeenCalledTimes(1);
    expect(mockOnEditDrug).toHaveBeenCalledWith(mockDrugs[0]);
  });

  it("calls onDeleteDrug when delete button is clicked", async () => {
    const user = userEvent.setup();
    const mockDrugs = [createMockDrug()];

    renderWithProviders(<InventoryTable {...defaultProps} drugs={mockDrugs} />);

    const deleteButton = screen.getByLabelText(`Delete ${mockDrugs[0].name}`);
    expect(deleteButton).toBeInTheDocument();

    await user.click(deleteButton);
    expect(mockOnDeleteDrug).toHaveBeenCalledTimes(1);
    expect(mockOnDeleteDrug).toHaveBeenCalledWith(mockDrugs[0]);
  });

  it("displays low stock quantity with destructive styling", () => {
    const mockDrugs = [createMockDrug({ quantity: 50 })];

    renderWithProviders(<InventoryTable {...defaultProps} drugs={mockDrugs} />);

    expect(screen.getByText("50")).toBeInTheDocument();
    const quantityCell = screen.getByText("50").closest("td");
    expect(quantityCell).toHaveClass("text-destructive");
  });

  it("displays normal stock quantity without destructive styling", () => {
    const mockDrugs = [createMockDrug({ quantity: 150 })];

    renderWithProviders(<InventoryTable {...defaultProps} drugs={mockDrugs} />);

    expect(screen.getByText("150")).toBeInTheDocument();
    const quantityCell = screen.getByText("150").closest("td");
    expect(quantityCell).not.toHaveClass("text-destructive");
  });

  it("handles multiple drugs correctly", () => {
    const mockDrugs = [
      createMockDrug({ id: 1, name: "Medicine A" }),
      createMockDrug({ id: 2, name: "Medicine B" }),
      createMockDrug({ id: 3, name: "Medicine C" }),
    ];

    renderWithProviders(<InventoryTable {...defaultProps} drugs={mockDrugs} />);

    expect(screen.getByText("Medicine A")).toBeInTheDocument();
    expect(screen.getByText("Medicine B")).toBeInTheDocument();
    expect(screen.getByText("Medicine C")).toBeInTheDocument();

    expect(screen.getByLabelText("Edit Medicine A")).toBeInTheDocument();
    expect(screen.getByLabelText("Edit Medicine B")).toBeInTheDocument();
    expect(screen.getByLabelText("Edit Medicine C")).toBeInTheDocument();

    expect(screen.getByLabelText("Delete Medicine A")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete Medicine B")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete Medicine C")).toBeInTheDocument();
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
