import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { UploadCloud, Trash2, FileText, User2 } from "lucide-react";

// --- Validation Schemas ---
const phoneRegex = /^\+?[0-9]{7,15}$/;
const singleTopUpSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(phoneRegex, "Invalid phone number"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, {
      message: "Amount must be a positive number",
    }),
  operator: z.enum(["Safaricom", "Airtel", "Telkom"]),
});

type SingleTopUpForm = z.infer<typeof singleTopUpSchema>;

const bulkTopUpSchema = z.object({
  fixedAmount: z
    .string()
    .optional()
    .refine(
      (v) =>
        v === undefined ||
        v === "" ||
        (!Number.isNaN(Number(v)) && Number(v) > 0),
      { message: "Amount must be a positive number" }
    ),
  operator: z.enum(["Safaricom", "Airtel", "Telkom"]),
});

type BulkTopUpForm = z.infer<typeof bulkTopUpSchema>;

// --- CSV parse helpers (simple) ---
type ParsedRecipient = { name?: string; phone: string; amount?: string };
function parseCSV(text: string): ParsedRecipient[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];
  const headerCells = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const hasHeader = headerCells.some((h) =>
    /(name|phone|phone_number|amount)/.test(h)
  );
  const rows = hasHeader ? lines.slice(1) : lines;
  return rows.map((row) => {
    const cells = row.split(",").map((c) => c.trim());
    if (hasHeader) {
      const rec: any = {};
      headerCells.forEach((h, i) => {
        if (/name/.test(h)) rec.name = cells[i] || "";
        else if (/phone/.test(h)) rec.phone = cells[i] || "";
        else if (/amount/.test(h)) rec.amount = cells[i] || "";
      });
      return {
        phone: rec.phone || "",
        name: rec.name || undefined,
        amount: rec.amount || undefined,
      };
    } else {
      const phone = cells[0] || "";
      const name =
        cells[1] && !/^[0-9+]+$/.test(cells[1]) ? cells[1] : undefined;
      const amount =
        cells[1] && /^[0-9.]+$/.test(cells[1])
          ? cells[1]
          : cells[2] && /^[0-9.]+$/.test(cells[2])
          ? cells[2]
          : undefined;
      return { phone, name, amount };
    }
  });
}

function isValidPhone(s: string) {
  return phoneRegex.test(s.replace(/\s+/g, ""));
}

// --- Dropzone component ---
function CSVDropzone({
  onParsed,
  file,
  setFile,
}: {
  onParsed: (rows: ParsedRecipient[]) => void;
  file: File | null;
  setFile: (f: File | null) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      if (!acceptedFiles || acceptedFiles.length === 0) return;
      const f = acceptedFiles[0];
      if (!f.name.toLowerCase().endsWith(".csv")) {
        setError("Please upload a CSV file");
        return;
      }
      setFile(f);
      const reader = new FileReader();
      reader.onerror = () => setError("Failed to read file");
      reader.onload = () => {
        try {
          const text = String(reader.result || "");
          const rows = parseCSV(text);
          const invalid = rows.find((r) => !r.phone || !isValidPhone(r.phone));
          if (invalid) {
            setError(
              "CSV contains invalid or missing phone numbers. Use +2547... or local digits."
            );
            return;
          }
          onParsed(rows);
        } catch (e) {
          setError("Invalid CSV format. Example header: name,phone,amount");
        }
      };
      reader.readAsText(f);
    },
    [onParsed, setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "text/csv": [".csv"] },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 rounded-md p-6 text-center cursor-pointer ${
          isDragActive
            ? "border-gray-500 bg-gray-50"
            : "border-gray-200 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex items-center justify-center gap-3">
          <UploadCloud className="w-6 h-6 text-gray-500" />
          <div>
            <div className="font-medium text-sm text-gray-700">
              Drag & drop CSV here, or click to browse
            </div>
            <div className="text-xs text-gray-500">
              Sample columns:{" "}
              <span className="font-mono">name,phone,amount</span>
            </div>
          </div>
        </div>
      </div>

      {file && (
        <div className="mt-3 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-3">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-sm font-medium text-gray-700">
                {file.name}
              </div>
              <div className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                onParsed([]);
              }}
              className="border-gray-200 text-gray-500 hover:bg-gray-100"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Remove File
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3">
          <Alert>
            <AlertTitle>Upload error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}

// --- Main Page ---
export default function MakeTopUpPage() {
  const [bulkParsed, setBulkParsed] = useState<ParsedRecipient[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const singleForm = useForm<SingleTopUpForm>({
    resolver: zodResolver(singleTopUpSchema),
    defaultValues: { phone: "", amount: "", operator: "Safaricom" },
  });
  const bulkForm = useForm<BulkTopUpForm>({
    resolver: zodResolver(bulkTopUpSchema),
    defaultValues: { fixedAmount: "", operator: "Safaricom" },
  });

  const onSingleSubmit = singleForm.handleSubmit((data) => {
    setStatusMessage(null);
    console.log("Single top-up payload:", data);
    setStatusMessage("Single top-up queued (console.log)");
  });

  const onBulkSubmit = bulkForm.handleSubmit((data) => {
    setStatusMessage(null);
    if (!csvFile || bulkParsed.length === 0) {
      setStatusMessage(
        "Please upload a valid CSV before starting bulk top-up."
      );
      return;
    }
    // attach fixed amount if provided
    const payload = bulkParsed.map((r) => ({
      name: r.name,
      phone: r.phone,
      amount: r.amount ?? data.fixedAmount,
    }));
    console.log("Bulk top-up payload:", {
      operator: data.operator,
      rows: payload,
    });
    setStatusMessage(
      `Bulk top-up queued for ${payload.length} recipients (console.log).`
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-gray-700">Make Top-Up</h1>
          <p className="text-sm text-gray-500">
            Single or bulk top-ups. Bulk CSV sample:{" "}
            <span className="font-mono">name,phone,amount</span>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Single Top-Up Card */}
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User2 className="w-5 h-5 text-gray-500" />
                <CardTitle className="text-gray-700">Single Top-Up</CardTitle>
              </div>
              <div className="text-xs text-gray-500">Instant</div>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSingleSubmit();
                }}
                className="space-y-4"
              >
                <div>
                  <Label className="text-sm text-gray-700">
                    Recipient phone
                  </Label>
                  <Input
                    {...singleForm.register("phone")}
                    placeholder="e.g. +254712345678"
                  />
                  {singleForm.formState.errors.phone && (
                    <div className="text-xs text-red-600 mt-1">
                      {singleForm.formState.errors.phone.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-gray-700">Amount (KES)</Label>
                  <Input
                    {...singleForm.register("amount")}
                    placeholder="Amount"
                  />
                  {singleForm.formState.errors.amount && (
                    <div className="text-xs text-red-600 mt-1">
                      {singleForm.formState.errors.amount.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-gray-700">Operator</Label>
                  <Select
                    onValueChange={(val) =>
                      singleForm.setValue("operator", val)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Safaricom">Safaricom</SelectItem>
                      <SelectItem value="Airtel">Airtel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-200 text-gray-500 hover:bg-gray-100"
                    onClick={() => singleForm.reset()}
                    type="button"
                  >
                    Reset
                  </Button>
                  <Button
                    className="bg-gray-500 hover:bg-gray-600 text-white"
                    type="submit"
                  >
                    Send Top-Up
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Bulk Top-Up Card */}
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <CardTitle className="text-gray-700">
                  Bulk Top-Up (CSV)
                </CardTitle>
              </div>
              <div className="text-xs text-gray-500">Asynchronous</div>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onBulkSubmit();
                }}
                className="space-y-4"
              >
                <CSVDropzone
                  onParsed={(rows) => setBulkParsed(rows)}
                  file={csvFile}
                  setFile={setCsvFile}
                />

                <div>
                  <Label className="text-sm text-gray-700">
                    Fixed Amount (KES)
                  </Label>
                  <Input
                    {...bulkForm.register("fixedAmount")}
                    placeholder="If set, overrides CSV amount column"
                  />
                  {bulkForm.formState.errors.fixedAmount && (
                    <div className="text-xs text-red-600 mt-1">
                      {bulkForm.formState.errors.fixedAmount.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-gray-700">Operator</Label>
                  <Select
                    onValueChange={(val) => bulkForm.setValue("operator", val)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Safaricom">Safaricom</SelectItem>
                      <SelectItem value="Airtel">Airtel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-200 text-gray-500 hover:bg-gray-100"
                    onClick={() => {
                      setCsvFile(null);
                      setBulkParsed([]);
                      bulkForm.reset();
                    }}
                    type="button"
                  >
                    Clear
                  </Button>
                  <Button
                    className="bg-gray-500 hover:bg-gray-600 text-white"
                    type="submit"
                  >
                    Start Bulk Top-Up
                  </Button>
                </div>

                {statusMessage && (
                  <div className="text-sm text-gray-700 mt-2">
                    {statusMessage}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
