const downloadFile = (filename: string, content: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const exportToCsv = <T extends object>(filename: string, data: T[]) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","), // header row
    ...data.map((row) =>
      headers
        .map((fieldName) => {
          const value = (row as any)[fieldName];
          const stringValue = String(value).replace(/"/g, '""'); // escape double quotes
          return `"${stringValue}"`;
        })
        .join(",")
    ),
  ];

  const csvContent = csvRows.join("\n");
  downloadFile(filename, csvContent, "text/csv;charset=utf-8;");
};

export const exportToJson = <T extends object>(filename: string, data: T[]) => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(filename, jsonContent, "application/json;charset=utf-8;");
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
