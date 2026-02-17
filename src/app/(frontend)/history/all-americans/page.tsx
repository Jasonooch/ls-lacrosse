import PageTitle from '@/components/ui/PageTitle/PageTitle';
import { PaginatedTable } from '@/components/tables/PaginatedTable/PaginatedTable';

// Columns for All Americans table
const columns = [
  { accessor: 'year', header: 'YEAR' },
  { accessor: 'name', header: 'NAME' },
  { accessor: 'position', header: 'POSITION' },
  { accessor: 'team', header: 'TEAM' },
];

export default async function AllAmericans() {
  // Placeholder data - will be replaced with actual data from CMS
  const allAmericans = [
    // Add placeholder rows here once collection is created
  ];

  return (
    <main>
      <section className="pb-[var(--section-padding)]">
        <div className="container">
          <div className="pt-[var(--item-gap)] flex flex-col gap-y-8">
            <PageTitle>All Americans</PageTitle>

            {allAmericans.length === 0 ? (
              <p className="text-center text-gray-600">No All Americans data available at this time.</p>
            ) : (
              <div className="hidden md:block">
                <PaginatedTable
                  columns={columns}
                  data={allAmericans}
                  gridTemplate="0.5fr 1.5fr 1fr 1fr"
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
