import PageTitle from '@/components/ui/PageTitle/PageTitle';
import Table from '@/components/tables/Table/Table';
import SeasonSelector from '@/components/ui/season-selector';
import {
  getCoachingStaffYears,
  getCoachingStaffByYear,
} from '@/lib/api/coaching-staff/coaching-staff';
const columns = [
  { accessor: 'name', header: 'NAME' },
  { accessor: 'role', header: 'ROLE' },
];

type Props = {
  searchParams: Promise<{ year?: string }>;
};

export default async function CoachesPage({ searchParams }: Props) {
  const [params, years] = await Promise.all([
    searchParams,
    getCoachingStaffYears(),
  ]);

  const selectedYear = years.find((y) => y === params.year) ?? years[0];

  const staff = selectedYear ? await getCoachingStaffByYear(selectedYear) : null;

  // SeasonSelector expects { id: number, year: string }[]
  const seasons = years.map((y, i) => ({ id: i, year: y }));

  return (
    <main>
      <section className="pb-[var(--section-padding)]">
        <div className="container">
          <div className="pt-[var(--item-gap)] flex flex-col gap-y-6">
            <PageTitle>
              {selectedYear ? `${selectedYear} Coaching Staff` : 'Coaching Staff'}
            </PageTitle>

            {seasons.length > 0 && (
              <div className="flex justify-end">
                <SeasonSelector seasons={seasons} currentYear={selectedYear ?? ''} />
              </div>
            )}

            {staff && staff.coaches.length > 0 ? (
              <Table columns={columns} data={staff.coaches} />
            ) : (
              <p className="text-center text-gray-600">
                No coaching staff data available for this year.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
