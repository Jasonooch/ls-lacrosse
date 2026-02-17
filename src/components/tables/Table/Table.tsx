import React, { type ReactNode } from 'react';

export interface Column {
  header: string;
  accessor: string;
  className?: string;
}

interface TableProps {
  columns: Column[];
  data: Record<string, ReactNode>[];
  gridTemplate?: string;
}

const Table: React.FC<TableProps> = ({ columns, data, gridTemplate }) => {
  const gridCols = gridTemplate || `repeat(${columns.length}, 1fr)`;

  return (
    <div className="w-full">
      {/* Header */}
      <div
        className="overflow-hidden"
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: gridCols,
          background: 'rgb(9, 31, 63)',
          borderRadius: '0.625rem 0.625rem 0 0',
        }}
      >
        {columns.map((col) => (
          <div
            key={col.accessor}
            className={`font-bold text-base uppercase px-8 py-5 text-white ${col.className || ''}`}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Body */}
      <div>
        {data.map((row, index) => (
          <div
            key={index}
            className="border-x border-gray-200 even:bg-[#f3f3f3] hover:bg-[#e9e9e9] transition-colors"
            style={{
              display: 'grid',
              gridTemplateColumns: gridCols,
            }}
          >
            {columns.map((col) => (
              <div
                key={col.accessor}
                className={`font-medium text-base px-8 py-4 ${col.className || ''}`}
              >
                {row[col.accessor]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
