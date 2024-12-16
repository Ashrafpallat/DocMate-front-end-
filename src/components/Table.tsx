import React, { useState } from 'react';

interface Column {
  header: string;
  accessor: string; // The key in the data object
  render?: (value: any, row: any) => React.ReactNode; // Optional custom render function
  sortable?: boolean; // Whether the column is sortable
}

interface TableProps {
  data: any[];
  columns: Column[];
  actions?: (row: any) => React.ReactNode; // Optional actions for each row
  itemsPerPage?: number; // Optional: default items per page
}

const Table: React.FC<TableProps> = ({ data, columns, actions, itemsPerPage = 4 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Handle sorting
  const handleSort = (column: Column) => {
    if (!column.sortable) return;

    const direction = sortConfig?.key === column.accessor && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: column.accessor, direction });
  };

  // Perform sorting
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  // Perform search
  const filteredData = sortedData.filter((row) =>
    columns.some((col) => String(row[col.accessor] || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>

      {/* Table */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                onClick={() => handleSort(col)}
                className={`py-2 px-4 text-center border border-gray-300 ${
                  col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
              >
                {col.header}
                {col.sortable && (
                  <span className="ml-1">
                    {sortConfig?.key === col.accessor && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </span>
                )}
              </th>
            ))}
            {actions && <th className="py-2 px-4 text-center border border-gray-300">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="py-2 px-4 text-center border border-gray-300">
                  {col.render ? col.render(row[col.accessor], row) : row[col.accessor] || 'N/A'}
                </td>
              ))}
              {actions && (
                <td className="py-2 px-4 text-center border border-gray-300">{actions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
