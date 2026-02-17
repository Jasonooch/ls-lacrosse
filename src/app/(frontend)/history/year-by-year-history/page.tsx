import PageTitle from '@/components/ui/PageTitle/PageTitle';
import { PaginatedTable } from '@/components/tables/PaginatedTable/PaginatedTable';

// Columns for Year by Year History table
const columns = [
  { accessor: 'year', header: 'YEAR' },
  { accessor: 'record', header: 'RECORD' },
  { accessor: 'outcome', header: 'OUTCOME' },
  { accessor: 'captains', header: 'CAPTAINS' },
  { accessor: 'coach', header: 'COACH' },
  { accessor: 'asstCoaches', header: 'ASST. COACHES' },
];

export default async function YearByYearHistory() {
  // Placeholder data - will be replaced with actual data from CMS
  const historyData: Record<string, string>[] = [];

  return (
    <main>
      <section className="pb-[var(--section-padding)]">
        <div className="container">
          <div className="pt-[var(--item-gap)] flex flex-col gap-y-8">
            <PageTitle>Year By Year History</PageTitle>

            {historyData.length === 0 ? (
              <p className="text-center text-gray-600">No year by year history data available at this time.</p>
            ) : (
              <div className="hidden md:block">
                <PaginatedTable
                  columns={columns}
                  data={historyData}
                  gridTemplate="0.5fr 0.5fr 1fr 1fr 0.5fr 1.5fr"
                  itemsPerPage={15}
                />
              </div>
            )}

            {/* Mobile view - can be added later */}
            <div className="md:hidden flex flex-col gap-4">
              <p className="text-center text-gray-600">Mobile view coming soon</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}