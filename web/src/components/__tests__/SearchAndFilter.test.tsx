import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "@/test/utils";
import { SearchAndFilter } from "../SearchAndFilter";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("SearchAndFilter", () => {
  const mockProps = {
    searchTerm: "",
    setSearchTerm: vi.fn(),
    selectedCategory: "All",
    setSelectedCategory: vi.fn(),
    onAddDrug: vi.fn(),
    onBatchImport: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input with placeholder", () => {
    renderWithProviders(<SearchAndFilter {...mockProps} />);

    expect(
      screen.getByPlaceholderText("Search drugs, generics, or manufacturers...")
    ).toBeInTheDocument();
  });

  it("renders add drug button", () => {
    renderWithProviders(<SearchAndFilter {...mockProps} />);

    expect(screen.getByText("Add Drug")).toBeInTheDocument();
  });

  it("calls setSearchTerm when search input changes", async () => {
    const user = userEvent.setup();

    renderWithProviders(<SearchAndFilter {...mockProps} />);

    const searchInput = screen.getByPlaceholderText(
      "Search drugs, generics, or manufacturers..."
    );
    await user.type(searchInput, "test");

    expect(mockProps.setSearchTerm).toHaveBeenCalledWith("t");
    expect(mockProps.setSearchTerm).toHaveBeenCalledWith("e");
    expect(mockProps.setSearchTerm).toHaveBeenCalledWith("s");
    expect(mockProps.setSearchTerm).toHaveBeenCalledWith("t");
    expect(mockProps.setSearchTerm).toHaveBeenCalledTimes(4);
  });

  it("displays current search term in input", () => {
    const propsWithTerm = {
      ...mockProps,
      searchTerm: "test search",
    };

    renderWithProviders(<SearchAndFilter {...propsWithTerm} />);

    const searchInput = screen.getByDisplayValue("test search");
    expect(searchInput).toBeInTheDocument();
  });

  it("calls onAddDrug when add button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<SearchAndFilter {...mockProps} />);

    const addButton = screen.getByText("Add Drug");
    await user.click(addButton);

    expect(mockProps.onAddDrug).toHaveBeenCalledTimes(1);
  });

  it("renders category selector", () => {
    renderWithProviders(<SearchAndFilter {...mockProps} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("clears search when input is cleared", async () => {
    const user = userEvent.setup();
    const propsWithTerm = {
      ...mockProps,
      searchTerm: "test search",
    };

    renderWithProviders(<SearchAndFilter {...propsWithTerm} />);

    const searchInput = screen.getByDisplayValue("test search");
    await user.clear(searchInput);

    expect(mockProps.setSearchTerm).toHaveBeenCalledWith("");
  });
});
