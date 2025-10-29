import LoaderComponent from "@/components/Loader";
import { type ParsedRecipient, csvDataSchema } from "@/validation/validators";
import Papa from "papaparse";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import z from "zod";

const CSVDropzone = ({
  onParsed,
  file,
  setCsvFile,
}: {
  onParsed: (rows: ParsedRecipient[]) => void;
  file: File | null;
  setCsvFile: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setLoading(true);
      setError(null);
      if (!acceptedFiles || acceptedFiles.length === 0) return;

      const f = acceptedFiles[0];
      if (!f.name.toLowerCase().endsWith(".csv")) {
        setLoading(false)
        setError("Please upload a valid CSV file");
        return;
      }

      Papa.parse<ParsedRecipient>(f, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          try {
        const cleaned = result.data.map((row: ParsedRecipient) => ({
          name: row.name.trim(),
          phone: row.phone?.replace(/\s+/g, ""),
          amount: row.amount,
          branch: row.branch,
          operator: row.operator,
        }));

            const parsed = z.array(csvDataSchema).parse(cleaned);
            onParsed(parsed);
            setCsvFile(f);
            setLoading(false)
          } catch (err) {
            if (err instanceof z.ZodError) {
                setLoading(false)
                console.log(err.issues)
              setError(
                `CSV validation failed due to invalid data or missing columns
                  `
              );
            } else {
                // console.log(err.message)
              setError("Failed to parse CSV file");
            }
          }
        },
        error: (err) => {
        //   console.error(err.message);
        setLoading(false)
          setError(`Failed to parse CSV ${err.message}`);
        },
      });
    },
    [onParsed, setCsvFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "text/csv": [".csv"],
        //  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] 
        },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 rounded-md p-6 text-center cursor-pointer h-[10rem] relative ${
          isDragActive ? " bg-gray-100" : " bg-white"
        }`}
      >
        {/* Loader component */}
        {loading && (
          <div className="bg-black/10 absolute inset-0 flex justify-center items-center">
            <LoaderComponent/>
          </div>
        )}
        <input {...getInputProps()}  type="file" name="recipients"/>
        <p className="text-sm text-gray-600">
          Drag & drop your CSV here, or click to upload.
        </p>
      </div>

      {file && (
        <div className="mt-3 text-sm text-gray-700">
          Uploaded file: <strong>{file.name}</strong>
        </div>
      )}

      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default CSVDropzone