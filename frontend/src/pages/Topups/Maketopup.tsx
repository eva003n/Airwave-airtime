import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { file, z } from "zod";
import { Controller, useForm } from "react-hook-form";
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
import { UploadCloud, Trash2, FileText, User2, Download } from "lucide-react";
import safaricomLogo from "/images/safaricom-logo.png";
import airtelLogo from "/images/airtel-logo.png";
import { autoDetectOperator, createBulkTopUps, sendTopUp } from "@/api";
import {
  phoneRegex,
  singleTopUpSchema,
  type OperatorDetect,
  type SingleTopUpForm,
  type ParsedRecipient,
  csvDataSchema,
  bulkTopUpSchema,
} from "@/validation/validators";
import { OPERATORS } from "@/constants";
import { toast } from "react-toastify";
import type { BulkTopUpForm, UserData } from "@/validation/validators";
import CSVDropzone from "./Make-topup/CsvDropZone";
import { getItem } from "@/utils";

// --- Main Page ---
export default function MakeTopUpPage() {
  const [bulkParsed, setBulkParsed] = useState<ParsedRecipient[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [detectibg, setDetecting] = useState(false);
  const [next, setNext] = useState(false);
  const [operatorData, setOperatorData] = useState<OperatorDetect>({
    data: { operatorId: 288, name: "" },
    message: "",
  });

  const singleForm = useForm<SingleTopUpForm>({
    resolver: zodResolver(singleTopUpSchema),
    defaultValues: {
      phone_number: "254",
      airtime_amount: 5,
      // operator_code: 0,
      // countryIsoCode: "KE",
      // operator: "Safaricom",
    },
  });

  // useEffect(() => {
  //   if (operatorData?.data?.operatorId) {
  //     singleForm.setValue("operator_code", operatorData.data.operatorId);
  //     singleForm.setValue(
  //       "operator",
  //       operatorData.data.operatorId == 266 ? "Safaricom" : "Airtel",
  //       {
  //         shouldValidate: true,
  //         shouldDirty: true,
  //         shouldTouch: true,
  //       }
  //     );
  //   }
  // }, [operatorData]);

  const bulkForm = useForm<BulkTopUpForm>({
    resolver: zodResolver(bulkTopUpSchema),
    defaultValues: {
      recipients: [],
    },
  });

  const onSingleSubmit = singleForm.handleSubmit(async (data) => {
    try {
      // setStatusMessage(null);
      const response = await sendTopUp(data);
      toast.success(response.data.message);
      // setStatusMessage("Single top-up queued (console.log)");
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  });

  const onBulkSubmit = bulkForm.handleSubmit(async () => {
    setStatusMessage(null);
    if (!csvFile || bulkParsed.length === 0) {
      setStatusMessage(
        "Please upload a valid CSV before starting bulk top-up."
      );
      return;
    }

    try {
      const user = getItem<UserData>("user");
      const formData = new FormData();
      formData.append("recipients", csvFile);

      const response = await createBulkTopUps(user.id, formData);
      setCsvFile(null);
      setBulkParsed([]);
      bulkForm.reset();
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  });

  const handleOperatorAutoDetection = async () => {
    try {
      const isValid = await singleForm.trigger("phone_number");
      if (isValid) {
        setDetecting(true);

        const operator = await autoDetectOperator({
          phone_number: singleForm.getValues("phone_number"),
          countryIsoCode: "KE",
        });

        setOperatorData(operator.data);
        toast.success(operator.data.message);

        setDetecting(false);
        setNext(true);
      }
    } catch (error) {
      setDetecting(false);
      setNext(false);
      singleForm.formState.errors.phone_number = error.message;
      console.log(error.message);
    }
  };
  return (
    <div className="">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex justify-between">
          <p className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
            Make top up
          </p>
          <a href="/files/Bulk-top-up-template.xlsx" download className="">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:brightness-95">
              <Download size={16} /> Download template
            </Button>
          </a>
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
              <form onSubmit={onSingleSubmit} className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-700">
                    Recipient phone
                  </Label>
                  <Input
                    {...singleForm.register("phone_number")}
                    placeholder="e.g. +254712345678"
                    minLength={12}
                    maxLength={12}
                  />
                  {/* <Button
                    variant={"outline"}
                    className=" my-2 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    onClick={handleOperatorAutoDetection}
                    type="button"
                  >
                    {detectibg ? "Detecting..." : "Next"}
                  </Button> */}
                  {singleForm.formState.errors.phone_number && (
                    <div className="text-xs text-red-600 mt-1">
                      {singleForm.formState.errors.phone_number.message}
                    </div>
                  )}
                </div>
                {next && operatorData && (
                  <div className="flex gap-4 bg-gray-100 items-center justify-between px-2 ">
                    {operatorData.data.operatorId == 266 && (
                      <img src={safaricomLogo} width={100} height={5} />
                    )}
                    {operatorData.data.operatorId == 265 && (
                      <img src={airtelLogo} width={100} height={5} />
                    )}
                    <p className="max-w-[12rem]">
                      Detected operator {operatorData?.data.name}
                    </p>
                  </div>
                )}

                {/* {next && operatorData && ( */}
                <>
                  <div>
                    <Label className="text-sm text-gray-700">
                      Amount (KES) eg 5 - 10000
                    </Label>
                    <Input
                      {...singleForm.register("airtime_amount")}
                      placeholder="Amount"
                      type="number"
                      max={10000}
                      min={5}
                    />
                    {singleForm.formState.errors.airtime_amount && (
                      <div className="text-xs text-red-600 mt-1">
                        {singleForm.formState.errors.airtime_amount?.message}
                      </div>
                    )}
                  </div>
                  {/* <div>
                      <Label className="text-sm text-gray-700">Operator</Label>
                      <Controller
                        name="operator"
                        control={singleForm.control}
                        rules={{ required: "Operator is required" }}
                        render={({ field }) => (
                          <>
                            <Select
                              onValueChange={(val) => field.onChange(val)}
                              value={field.value}
                            >
                              <SelectTrigger
                                className=" focus:ring-2 focus:ring-gray-500"
                                // attach ref and onBlur to the trigger (interactive element)
                                ref={field.ref}
                                onBlur={field.onBlur}
                              >
                                <SelectValue placeholder={"Select operator"} />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {OPERATORS.map((operator) => (
                                  <SelectItem key={operator} value={operator}>
                                    {operator}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {singleForm.formState.errors.operator && (
                              <div className="text-rose-500 text-[.8rem]">
                                {singleForm.formState.errors.operator.message}
                              </div>
                            )}
                          </>
                        )}
                      />
                    </div> */}
                </>
                {/* )} */}

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-200 text-gray-500 hover:bg-gray-100"
                    onClick={() => {
                      setNext(false);
                      singleForm.reset();
                    }}
                    type="button"
                  >
                    Reset
                  </Button>
                  <Button
                    className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    type="submit"
                  >
                    {singleForm.formState.isSubmitting ? "Sending" : "Top up"}
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
                  onParsed={(rows) => {
                    bulkForm.setValue("recipients", rows);
                    setBulkParsed(rows);
                  }}
                  file={csvFile}
                  setCsvFile={setCsvFile}
                />

                {/* <div>
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
                </div> */}

                {bulkForm.formState.errors.recipients && (
                  <p className="text-sm text-red-600 mt-1">
                    {bulkForm.formState.errors.recipients.message}
                  </p>
                )}

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
                    Reset
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:brightness-95 "
                    type="submit"
                    onClick={() => bulkForm.reset()}
                  >
                    {bulkForm.formState.isSubmitting
                      ? "Uploading"
                      : "Start topup"}
                  </Button>
                </div>

                {statusMessage && (
                  <div className="text-sm text-red-500 mt-2">
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
