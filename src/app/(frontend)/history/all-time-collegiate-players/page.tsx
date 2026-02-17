import PageTitle from '@/components/ui/PageTitle/PageTitle';
import { PaginatedTable } from '@/components/tables/PaginatedTable/PaginatedTable';

// Columns for All-Time Collegiate Players table
const columns = [
  { accessor: 'name', header: 'NAME' },
  { accessor: 'graduationYear', header: 'GRADUATION YEAR' },
  { accessor: 'college', header: 'COLLEGE/UNIVERSITY' },
  { accessor: 'position', header: 'POSITION' },
];

export default async function AllTimeCollegiatePlayers() {
  // Placeholder data - will be replaced with actual data from CMS
  const collegiatePlayers: Record<string, string>[] = [];

  return (
    <main>
      <section className="pb-[var(--section-padding)]">
        <div className="container">
          <div className="pt-[var(--item-gap)] flex flex-col gap-y-8">
            <PageTitle>All-Time Collegiate Players</PageTitle>

            {collegiatePlayers.length === 0 ? (
              <p className="text-center text-gray-600">No collegiate players data available at this time.</p>
            ) : (
              <div className="hidden md:block">
                <PaginatedTable
                  columns={columns}
                  data={collegiatePlayers}
                  gridTemplate="1.5fr 0.75fr 1.5fr 0.75fr"
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
