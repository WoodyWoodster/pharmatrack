"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useBatchCreateDrugs } from "@/hooks/useDrugs";
import { Upload, FileText, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

interface DrugData {
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

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface BatchImportDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const REQUIRED_FIELDS = [
  "sku",
  "name",
  "generic_name",
  "dosage",
  "quantity",
  "expiration_date",
  "manufacturer",
  "price",
  "category",
];

const CATEGORIES = [
  "Antibiotic",
  "Pain Relief",
  "ACE Inhibitor",
  "Beta Blocker",
  "Diuretic",
  "Statin",
  "Antacid",
  "Antihistamine",
  "Vitamins",
  "Supplements",
];

export function BatchImportDrawer({
  isOpen,
  onOpenChange,
}: BatchImportDrawerProps) {
  const [parsedData, setParsedData] = useState<DrugData[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const batchCreateMutation = useBatchCreateDrugs();

  const downloadTemplate = () => {
    const headers = REQUIRED_FIELDS.join(",");
    const sampleRow = [
      "SAMPLE-001",
      "Sample Drug",
      "sample_drug",
      "10mg",
      "100",
      "2025-12-31",
      "Sample Pharma",
      "29.99",
      "Antibiotic",
    ].join(",");

    const csvContent = `${headers}\n${sampleRow}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drug_import_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const validateRow = useCallback(
    (row: DrugData, index: number): ValidationError[] => {
      const errors: ValidationError[] = [];

      REQUIRED_FIELDS.forEach((field) => {
        if (
          !row[field as keyof DrugData] ||
          String(row[field as keyof DrugData]).trim() === ""
        ) {
          errors.push({
            row: index + 1,
            field,
            message: `${field} is required`,
          });
        }
      });

      if (
        row.quantity &&
        (isNaN(Number(row.quantity)) || Number(row.quantity) < 0)
      ) {
        errors.push({
          row: index + 1,
          field: "quantity",
          message: "Quantity must be a positive number",
        });
      }

      if (row.price && (isNaN(Number(row.price)) || Number(row.price) < 0)) {
        errors.push({
          row: index + 1,
          field: "price",
          message: "Price must be a positive number",
        });
      }

      if (row.expiration_date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(row.expiration_date)) {
          errors.push({
            row: index + 1,
            field: "expiration_date",
            message: "Date must be in YYYY-MM-DD format",
          });
        } else {
          const date = new Date(row.expiration_date);
          if (isNaN(date.getTime()) || date < new Date()) {
            errors.push({
              row: index + 1,
              field: "expiration_date",
              message: "Date must be valid and in the future",
            });
          }
        }
      }

      if (row.category && !CATEGORIES.includes(row.category)) {
        errors.push({
          row: index + 1,
          field: "category",
          message: `Category must be one of: ${CATEGORIES.join(", ")}`,
        });
      }

      return errors;
    },
    []
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setFileName(file.name);
      setIsUploading(true);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.toLowerCase().replace(/\s+/g, "_"),
        complete: (results) => {
          setIsUploading(false);

          if (results.errors.length > 0) {
            toast.error("Error parsing CSV file");
            return;
          }

          const data = results.data as DrugData[];

          const processedData = data.map((row) => ({
            ...row,
            quantity: Number(row.quantity) || 0,
            price: Number(row.price) || 0,
          }));

          setParsedData(processedData);

          const allErrors: ValidationError[] = [];
          processedData.forEach((row, index) => {
            const rowErrors = validateRow(row, index);
            allErrors.push(...rowErrors);
          });

          setValidationErrors(allErrors);

          if (allErrors.length === 0) {
            toast.success(`${processedData.length} rows loaded successfully`);
          } else {
            toast.error(`${allErrors.length} validation errors found`);
          }
        },
        error: (error) => {
          setIsUploading(false);
          toast.error(`Error reading file: ${error.message}`);
        },
      });
    },
    [validateRow]
  );

  const handleSubmit = async () => {
    if (validationErrors.length > 0) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    if (parsedData.length === 0) {
      toast.error("No data to import");
      return;
    }

    try {
      await batchCreateMutation.mutateAsync(parsedData);
      setParsedData([]);
      setValidationErrors([]);
      setFileName("");
      onOpenChange(false);
    } catch {
      toast.error("Failed to import drugs");
    }
  };

  const handleReset = () => {
    setParsedData([]);
    setValidationErrors([]);
    setFileName("");
  };

  const getRowError = (rowIndex: number) => {
    return validationErrors.find((error) => error.row === rowIndex + 1);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-6xl">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Batch Import Drugs
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Need a template?</p>
                <p className="text-xs text-muted-foreground">
                  Download a CSV template with the required columns and sample
                  data
                </p>
              </div>
              <Button onClick={downloadTemplate} size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>

            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <div className="space-y-2">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Upload CSV File</p>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 10MB. Supported format: CSV
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload">
                  <Button variant="outline" asChild className="cursor-pointer">
                    <span>Choose File</span>
                  </Button>
                </label>
                {fileName && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {fileName}
                  </p>
                )}
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <p className="text-sm">Processing file...</p>
                <Progress value={undefined} className="h-2" />
              </div>
            )}

            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Found {validationErrors.length} validation errors. Please
                  review and fix them before importing.
                </AlertDescription>
              </Alert>
            )}

            {parsedData.length > 0 && validationErrors.length === 0 && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  {parsedData.length} rows ready for import. All validation
                  checks passed.
                </AlertDescription>
              </Alert>
            )}

            {parsedData.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Data Preview ({parsedData.length} rows)
                  </h3>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>

                <div className="border rounded-lg max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Generic</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Expiration</TableHead>
                        <TableHead>Manufacturer</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.map((row, index) => {
                        const rowError = getRowError(index);
                        return (
                          <TableRow
                            key={index}
                            className={
                              rowError ? "bg-destructive/10" : undefined
                            }
                          >
                            <TableCell className="font-mono text-sm">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-mono">
                              {row.sku}
                            </TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.generic_name}</TableCell>
                            <TableCell>{row.dosage}</TableCell>
                            <TableCell>{row.quantity}</TableCell>
                            <TableCell>{row.expiration_date}</TableCell>
                            <TableCell>{row.manufacturer}</TableCell>
                            <TableCell>${row.price}</TableCell>
                            <TableCell>{row.category}</TableCell>
                            <TableCell>
                              {rowError ? (
                                <Badge variant="destructive">Error</Badge>
                              ) : (
                                <Badge variant="default">Valid</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {validationErrors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-destructive">
                      Validation Errors:
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-auto">
                      {validationErrors.map((error, index) => (
                        <div
                          key={index}
                          className="text-sm text-destructive bg-destructive/10 p-2 rounded"
                        >
                          Row {error.row}, {error.field}: {error.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DrawerFooter>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={
                  parsedData.length === 0 ||
                  validationErrors.length > 0 ||
                  batchCreateMutation.isPending
                }
                className="flex-1"
              >
                {batchCreateMutation.isPending
                  ? "Importing..."
                  : `Import ${parsedData.length} Drugs`}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
