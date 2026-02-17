// app/roster/page.tsx
import PageTitle from '@/components/ui/PageTitle/PageTitle';
import Table from '@/components/tables/Table/Table';
import { getLatestRoster } from '@/lib/api/rosters';
import MobileRosterCard from '@/components/cards/MobileRosterCard/MobileRosterCard';

// Columns — match the transformed data keys
const columns = [
  { accessor: 'jerseyNumber', header: 'NUMBER' },
  { accessor: 'fullName', header: 'NAME' },
  { accessor: 'position', header: 'POSITION' },
  { accessor: 'graduationYear', header: 'YOG' },
];

export default async function Roster() {
  const latestRoster = await getLatestRoster();

  if (!latestRoster || !latestRoster.players || latestRoster.players.length === 0) {
    return (
        <section className="pb-[var(--section-padding)]">
          <div className="container">
            <div className="pt-[var(--item-gap)] flex flex-col gap-y-8">
              <PageTitle>Roster</PageTitle>
              <p className="text-center text-gray-600">No roster data available at this time.</p>
            </div>
          </div>
        </section>
    );
  }

  // Transform player data to match table keys
  const players = latestRoster.players.map((player) => ({
    jerseyNumber: player.jerseyNumber ?? '-',
    fullName: player.fullName,
    position: player.position ?? '-',
    graduationYear: player.graduationYear ?? '-',
  }));

  // Dynamic title: "2025 Roster" or "2026 Roster"
  const pageTitle = `${latestRoster.season} Varsity Roster`;

  return (
    <main>
      <section className="pb-[var(--section-padding)]">
        <div className="container">
          <div className="pt-[var(--item-gap)] flex flex-col gap-y-8">
            <PageTitle>{pageTitle}</PageTitle>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table columns={columns} data={players} gridTemplate="0.5fr 1fr 1fr 1fr" />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4">
              {players.map((player, index) => (
                <MobileRosterCard
                  key={index}
                  jerseyNumber={player.jerseyNumber}
                  fullName={player.fullName}
                  position={player.position}
                  graduationYear={String(player.graduationYear)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}