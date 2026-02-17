'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Season = {
  id: number;
  year: string;
};

interface SeasonSelectorProps {
  seasons: Season[];
  currentYear: string;
}

export default function SeasonSelector({ seasons, currentYear }: SeasonSelectorProps) {
  const router = useRouter();

  const handleSeasonChange = (year: string) => {
    // Update URL with year parameter
    router.push(`?year=${year}`);
  };

  return (
    <Select value={currentYear} onValueChange={handleSeasonChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select season" />
      </SelectTrigger>
      <SelectContent>
        {seasons.map((season) => (
          <SelectItem key={season.id} value={season.year}>
            {season.year} Season
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}