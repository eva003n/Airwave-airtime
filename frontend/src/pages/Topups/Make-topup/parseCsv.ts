import Papa from "papaparse";
// --- CSV parse helpers (simple) ---

const parseCSV = (file: File) => {
  // const lines = text
  //   .split(/\r?\n/)
  //   .map((l) => l.trim())
  //   .filter(Boolean);
  // if (lines.length === 0) return [];
  // const headerCells = lines[0].split(",").map((h) => h.trim().toLowerCase());
  // const hasHeader = headerCells.some((h) =>
  //   /(name|phone|phone_number|amount)/.test(h)
  // );
  // const rows = hasHeader ? lines.slice(1) : lines;
  // return rows.map((row) => {
  //   const cells = row.split(",").map((c) => c.trim());
  //   if (hasHeader) {
  //     const rec: any = {};
  //     headerCells.forEach((h, i) => {
  //       if (/name/.test(h)) rec.name = cells[i] || "";
  //       else if (/phone/.test(h)) rec.phone = cells[i] || "";
  //       else if (/amount/.test(h)) rec.amount = cells[i] || "";
  //     });
  //     return {
  //       phone: rec.phone || "",
  //       name: rec.name || undefined,
  //       amount: rec.amount || undefined,
  //     };
  //   } else {
  //     const phone = cells[0] || "";
  //     const name =
  //       cells[1] && !/^[0-9+]+$/.test(cells[1]) ? cells[1] : undefined;
  //     const amount =
  //       cells[1] && /^[0-9.]+$/.test(cells[1])
  //         ? cells[1]
  //         : cells[2] && /^[0-9.]+$/.test(cells[2])
  //         ? cells[2]
  //         : undefined;
  //     return { phone, name, amount };
  //   }
  // });
  Papa.parse(file, {
    header: true, // Parse with column headers
    skipEmptyLines: true,
    complete: (result) => {
      console.log("Parsed CSV result:", result.data);
      return result.data;
    },
    error: (err) => {
      console.error("Parsing error:", err);
      throw new Error("Failed to parse CSV");
    },
  });
};

export default parseCSV;
