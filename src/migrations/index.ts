import * as migration_20260218_042218 from './20260218_042218';
import * as migration_20260218_051352 from './20260218_051352';

export const migrations = [
  {
    up: migration_20260218_042218.up,
    down: migration_20260218_042218.down,
    name: '20260218_042218',
  },
  {
    up: migration_20260218_051352.up,
    down: migration_20260218_051352.down,
    name: '20260218_051352'
  },
];
