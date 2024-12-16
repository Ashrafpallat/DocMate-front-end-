import React from "react";

interface TableProps<T> {
  columns: {
    key: keyof T; // The key from the data object
    header: string; // Column header name
    render?: (value: any, row: T) => React.ReactNode; // Optional custom render function for the cell
  }[];
  data: T[]; // Array of data to display
  className?: string; // Optional additional class names for styling
  noDataMessage?: string; // Message to display when no data is available
}

const HistoryTable = <T extends { [key: string]: any }>({
  columns,
  data,
  className = "",
  noDataMessage = "No data available.",
}: TableProps<T>) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="table-auto w-full border-collapse border border-gray-300 text-center">
        {/* Table Head */}
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th key={String(col.key)} className="border p-2 font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={`${rowIndex}-${String(col.key)}`} className="border p-2">
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key] || "N/A"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="border p-4 text-gray-500">
                {noDataMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
