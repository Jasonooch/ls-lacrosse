import * as migration_20260218_042218 from './20260218_042218';

export const migrations = [
  {
    up: migration_20260218_042218.up,
    down: migration_20260218_042218.down,
    name: '20260218_042218'
  },
];
