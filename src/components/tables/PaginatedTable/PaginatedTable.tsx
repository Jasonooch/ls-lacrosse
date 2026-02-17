'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export interface Column {
  header: string;
  accessor: string;
  className?: string;
}

interface PaginatedTableProps {
  columns: Column[];
  data: Record<string, string | React.ReactNode>[];
  gridTemplate?: string;
  className?: string;
  itemsPerPage?: number;
}

export function PaginatedTable({
  data,
  itemsPerPage = 10,
  columns,
  gridTemplate,
  className
}: PaginatedTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the current page's data
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <Table className={className}>
        <TableHeader
          className="overflow-hidden"
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: gridTemplate || `repeat(${columns.length}, 1fr)`,
            background: 'rgb(9, 31, 63)',
            paddingTop: '20px',
            paddingBottom: '20px',
            borderRadius: '0.625rem 0.625rem 0 0',
          }}
        >
          <TableRow
            className="border-0"
            style={{
              display: 'contents',
            }}
          >
            {columns.map((col) => (
              <TableHead
                key={col.accessor}
                className={`font-bold text-base uppercase !px-8 !h-auto ${col.className || ''}`}
                style={{
                  color: 'rgb(255, 255, 255)',
                }}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((row, index) => (
            <TableRow
              key={index}
              className="border-x border-gray-200 even:bg-[#f3f3f3] hover:bg-[#e9e9e9] transition-colors"
              style={gridTemplate ? {
                display: 'grid',
                gridTemplateColumns: gridTemplate
              } : undefined}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.accessor}
                  className={`font-medium text-base px-8 py-4 ${col.className || ''}`}
                >
                  {typeof row[col.accessor] === 'object' ? row[col.accessor] : row[col.accessor]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrevious}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Results info */}
          <div className="text-center text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
          </div>
        </div>
      )}
    </div>
  );
}
