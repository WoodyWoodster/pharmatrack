import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, createMockDrug } from "@/test/utils";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("DeleteConfirmationModal", () => {
  const mockDrug = createMockDrug();
  const mockOnOpenChange = vi.fn();
  const mockSetConfirmText = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultProps = {
    isOpen: false,
    onOpenChange: mockOnOpenChange,
    drug: mockDrug,
    confirmText: "",
    setConfirmText: mockSetConfirmText,
    onDelete: mockOnDelete,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal when open", () => {
    renderWithProviders(
      <DeleteConfirmationModal {...defaultProps} isOpen={true} />
    );

    expect(screen.getByText("⚠️ DANGER ZONE ⚠️")).toBeInTheDocument();
    expect(
      screen.getByText("You are about to permanently delete:")
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${mockDrug.name} (${mockDrug.dosage})`)
    ).toBeInTheDocument();
    expect(
      screen.getByText("This action cannot be undone!")
    ).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    renderWithProviders(
      <DeleteConfirmationModal {...defaultProps} isOpen={false} />
    );

    expect(screen.queryByText("⚠️ DANGER ZONE ⚠️")).not.toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked with correct confirmation", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DeleteConfirmationModal
        {...defaultProps}
        isOpen={true}
        confirmText="Confirm"
      />
    );

    const deleteButton = screen.getByText("DELETE FOREVER");
    expect(deleteButton).not.toBeDisabled();

    await user.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it("disables delete button when confirmation text is incorrect", () => {
    renderWithProviders(
      <DeleteConfirmationModal
        {...defaultProps}
        isOpen={true}
        confirmText="wrong"
      />
    );

    const deleteButton = screen.getByText("DELETE FOREVER");
    expect(deleteButton).toBeDisabled();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DeleteConfirmationModal {...defaultProps} isOpen={true} />
    );

    const cancelButton = screen.getByText("CANCEL");
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("calls setConfirmText when user types in confirmation input", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DeleteConfirmationModal {...defaultProps} isOpen={true} />
    );

    const confirmInput = screen.getByPlaceholderText("Type 'Confirm' here...");
    await user.type(confirmInput, "C");

    expect(mockSetConfirmText).toHaveBeenCalledWith("C");
  });

  it("displays current confirmation text in input", () => {
    renderWithProviders(
      <DeleteConfirmationModal
        {...defaultProps}
        isOpen={true}
        confirmText="Conf"
      />
    );

    const confirmInput = screen.getByDisplayValue("Conf");
    expect(confirmInput).toBeInTheDocument();
  });

  it("handles null drug gracefully", () => {
    renderWithProviders(
      <DeleteConfirmationModal {...defaultProps} isOpen={true} drug={null} />
    );

    expect(screen.getByText("⚠️ DANGER ZONE ⚠️")).toBeInTheDocument();
    expect(
      screen.getByText("You are about to permanently delete:")
    ).toBeInTheDocument();
  });
});
